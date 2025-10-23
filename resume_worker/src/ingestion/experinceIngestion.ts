import { Prisma } from "@prisma/client";
import { log } from "console";


export async function ingestExperience(tx: Prisma.TransactionClient, experiences: any[], profileId: number) {
  log("Ingesting experiences for profileId:", profileId, "with experiences:", experiences);
  if (!experiences?.length) return;

  await tx.experience.createMany({
    data: experiences.map(exp => ({
      companyName: exp.companyName,
      role: exp.role,
      description: exp.description || null,
      userProfileDataId: profileId,
    })),
  });
}
