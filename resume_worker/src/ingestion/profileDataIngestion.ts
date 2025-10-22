import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ingestUserProfile(
  tx: PrismaClient,
  userId: string,
  data: any
) {
  // Find the user's existing profileDataId
  const user = await tx.userTable.findUnique({
    where: { id: userId },
    select: { profileDataId: true },
  });

  if (user?.profileDataId) {
    // Update existing profile
    return tx.userProfileData.update({
      where: { id: user.profileDataId },
      data: {
        summary: data.summary || null,
        education: data.education || null,
      },
    });
  }
  // Create new profile and link it to user
  return await tx.userProfileData.create({
    data: {
      summary: data.summary || null,
      education: data.education || null,
    },
  });
}
