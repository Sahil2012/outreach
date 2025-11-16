import { Prisma } from "@prisma/client";
import { log } from "console";

export async function ingestUserProfile(
  tx: Prisma.TransactionClient,
  userId: string,
  data: any
) {
  log("Ingesting user profile for userId:", userId);

  const profileData = {
    summary: data.summary || null,
    education: data.education || null,
  };

  const profile = await tx.userProfileData.create({
    data: {
      ...profileData,
      userId: userId,
    },
  });

  log("Created user profile with id:", profile.id);
  return profile;
}
