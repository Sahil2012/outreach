import { PrismaClient, ProfileCompletenessStatus } from "@prisma/client";
import { log } from "console";
import { ingestSkills } from "../ingestion/skillsIngestion";
import { ingestUserProfile } from "../ingestion/profileDataIngestion";
import { ingestExperience } from "../ingestion/experinceIngestion";
import { linkProfileToUser } from "../ingestion/linkProfileToUser";

const prisma = new PrismaClient();

export async function processResume(id: string, extracted: any) {
  log("Processing resume for user:", id);

  try {
    await prisma.$connect();
    log("Connected to DB");

    const result = await prisma.$transaction(async (tx) => {
      log("Transaction started for user:", id);
      const user = await tx.userTable.findUnique({ where: { authUserId: id } });
      if (!user) {
        log("User not found for id:", id);
        throw new Error("User not found");
      }
      log("User found:", user.id);

      // 1. Create profile
      const profile = await ingestUserProfile(tx, user.authUserId, extracted);

      // 2. Handle skills
      const skillNames = extracted.skills?.map((s: any) => s.name) || [];
      await ingestSkills(tx, skillNames, profile.id);

      //   3. Handle experiences
      await ingestExperience(tx, extracted.experiences || [], profile.id);

      // 4. Link to user
      await linkProfileToUser(tx, user.id, profile.id);

      await tx.profileReadiness.upsert({
        where: { userProfileId: profile.id },
        create: { userProfileId: profile.id, completenessStatus: ProfileCompletenessStatus.COMPLETE },
        update: { completenessStatus: ProfileCompletenessStatus.COMPLETE },
      });

      return { success: true, profileId: profile.id };
    });

    log("Transaction committed:", result);
    return result;
  } catch (err) {
    log("Transaction failed:", err);
    throw err;
  } finally {
    await prisma.$disconnect();
    log("Disconnected");
  }
}
