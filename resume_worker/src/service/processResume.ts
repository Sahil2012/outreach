import { Prisma, PrismaClient } from "@prisma/client";
import { ingestUserProfile } from "../ingestion/profileDataIngestion";
import { ingestSkills } from "../ingestion/skillsIngestion";
import { ingestExperience } from "../ingestion/experinceIngestion";
import { linkProfileToUser } from "../ingestion/linkProfileToUser";


const prisma = new PrismaClient();

export async function processResume(userId: string, extracted: any) {
  return prisma.$transaction(async (tx : Prisma.TransactionClient) => {

    const user = await tx.userTable.findUnique({ where: { userId } });
    if (!user) throw new Error("User not found");

    // 1. Create profile
    const profile = await ingestUserProfile(tx, userId, extracted);

    // 2. Handle skills
    const skillNames = extracted.skills?.map((s: any) => s.name) || [];
    await ingestSkills(tx, skillNames, profile.id);

    // 3. Handle experiences
    await ingestExperience(tx, extracted.experiences || [], profile.id);

    // 4. Link to user
    await linkProfileToUser(tx, userId, profile.id);

    return { success: true, profileId: profile.id };
  });
}
