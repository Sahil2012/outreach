import { Prisma } from "@prisma/client";

export async function linkProfileToUser(tx: Prisma.TransactionClient, userId: string, profileId: number) {
  return await tx.userTable.update({
    where: { id: userId },
    data: { profileDataId: profileId },
  });
}
