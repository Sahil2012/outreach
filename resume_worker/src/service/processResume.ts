import { PrismaClient, ProfileCompletenessStatus } from "@prisma/client";
import { log } from "console";
import { ensureSkillsExist, linkSkills } from "../ingestion/skillsIngestion";
import { ingestUserProfile } from "../ingestion/profileDataIngestion";
import { ingestExperience } from "../ingestion/experinceIngestion";

const prisma = new PrismaClient();

export async function processResume(id: string, extracted: any) {
  log("Processing resume for user:", id);

  try {
    await prisma.$connect();
    log("Connected to DB");

    // Pre-process skills outside of transaction to avoid timeouts
    const skillNames = extracted.skills?.map((s: any) => s.name) || [];
    await ensureSkillsExist(prisma, skillNames);

    // 1. Create profile
    const profile = await ingestUserProfile(prisma, id, extracted);

    // 2. Handle skills (link existing skills to profile)
    await linkSkills(prisma, skillNames, profile.id);

    // 3. Handle experiences
    await ingestExperience(prisma, extracted.experiences || [], profile.id);

    await prisma.userProfileData.update({
      where: {
        authUserId: id,
      },
      data: {
        status: ProfileCompletenessStatus.PARTIAL,
      },
    });

    log("Resume processing completed for user:", id);
    return { success: true, profileId: profile.id };
  } catch (err) {
    log("Transaction failed:", err);
    throw err;
  } finally {
    await prisma.$disconnect();
    log("Disconnected");
  }
}
