import { Prisma } from "@prisma/client";

export async function ingestSkills(tx: Prisma.TransactionClient, skillNames: string[], profileId: number) {
  if (!skillNames.length) return;

  const existingSkills = await tx.skills.findMany({
    where: { name: { in: skillNames } },
  });

  const existingNames = new Set(existingSkills.map((s:any) => s.name));
  const newNames = skillNames.filter(n => !existingNames.has(n));

  if (newNames.length) {
    await tx.skills.createMany({
      data: newNames.map(name => ({ name, category: "General" })),
      skipDuplicates: true,
    });
  }

  const allSkills = await tx.skills.findMany({
    where: { name: { in: skillNames } },
  });

  await tx.profilSkillMapping.createMany({
    data: allSkills.map((skill:any) => ({
      userProfileDataId: profileId,
      skillId: skill.id,
    })),
  });
}
