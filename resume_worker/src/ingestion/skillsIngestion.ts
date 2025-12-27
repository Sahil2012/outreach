import { Prisma, PrismaClient } from "@prisma/client";

export async function ensureSkillsExist(prisma: PrismaClient, skillNames: string[]) {
  if (!skillNames.length) return;

  // Deduplicate input names
  const uniqueNames = [...new Set(skillNames)];

  // Find which ones already exist
  const existingSkills = await prisma.skills.findMany({
    where: { name: { in: uniqueNames } },
    select: { name: true },
  });

  const existingNameSet = new Set(existingSkills.map((s) => s.name));
  const newNames = uniqueNames.filter((n) => !existingNameSet.has(n));

  if (newNames.length) {
    await prisma.skills.createMany({
      data: newNames.map((name) => ({ name, category: "General" })),
      skipDuplicates: true,
    });
  }
}

export async function linkSkills(tx: Prisma.TransactionClient, skillNames: string[], profileId: number) {
  if (!skillNames.length) return;

  const uniqueNames = [...new Set(skillNames)];

  // Fetch all skills (now guaranteed to exist) to get their IDs
  const allSkills = await tx.skills.findMany({
    where: { name: { in: uniqueNames } },
  });

  if (allSkills.length) {
    await tx.profilSkillMapping.createMany({
      data: allSkills.map((skill) => ({
        userProfileDataId: profileId,
        skillId: skill.id,
      })),
      skipDuplicates: true,
    });
  }
}
