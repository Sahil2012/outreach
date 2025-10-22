import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ingestExperience(tx: PrismaClient, experiences: any[], profileId: number) {
  if (!experiences?.length) return;

  await tx.experience.createMany({
    data: experiences.map(exp => ({
      companyName: exp.companyName,
      role: exp.role,
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : null,
      description: exp.description || null,
      userProfileDataId: profileId,
    })),
  });
}
