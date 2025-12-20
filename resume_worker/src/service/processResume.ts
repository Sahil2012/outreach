import { PrismaClient, ProfileCompletenessStatus } from "@prisma/client";
import { log } from "console";
import { ingestSkills } from "../ingestion/skillsIngestion";
import { ingestUserProfile } from "../ingestion/profileDataIngestion";
import { ingestExperience } from "../ingestion/experinceIngestion";

const prisma = new PrismaClient();

export async function processResume(id: string, extracted: any) {
  log("Processing resume for user:", id);

  try {
    await prisma.$connect();
    log("Connected to DB");

    const result = await prisma.$transaction(async (tx) => {
      log("Transaction started for user:", id);

      // 1. Create profile
      const profile = await ingestUserProfile(tx, id, extracted);

      // 2. Handle skills
      const skillNames = extracted.skills?.map((s: any) => s.name) || [];
      await ingestSkills(tx, skillNames, profile.id);

      //   3. Handle experiences
      await ingestExperience(tx, extracted.experiences || [], profile.id);

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
