import { Prisma } from "@prisma/client";
import { log } from "console";

export async function ingestExperience(
  tx: Prisma.TransactionClient,
  experiences: any[],
  profileId: number
) {
  try {
    log("Ingesting experiences for profileId:", profileId, "with experiences:", experiences);

    // No experiences? Delete existing ones (cleanup)
    if (!experiences?.length) {
      await tx.experience.deleteMany({
        where: { userProfileDataId: profileId },
      });
      log("No experiences provided. Existing experiences deleted for profile:", profileId);
      return;
    }

    // 1️⃣ Delete existing experiences for this profile
    await tx.experience.deleteMany({
      where: { userProfileDataId: profileId },
    });

    // 2️⃣ Insert new experiences
    await tx.experience.createMany({
      data: experiences.map((exp) => ({
        companyName: exp.companyName,
        role: exp.role,
        description: exp.description || null,
        userProfileDataId: profileId,
      })),
    });

    log(`Experiences updated successfully for profile: ${profileId}`);
  } catch (error) {
    log("Error ingesting experiences for profileId:", profileId, error);
    // Bubble up so transaction can roll back
    throw new Error(`Failed to ingest experiences for profileId ${profileId}: ${(error as Error).message}`);
  }
}
