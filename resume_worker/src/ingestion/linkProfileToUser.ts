import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function linkProfileToUser(tx: PrismaClient, userId: string, profileId: number) {
  return await tx.userTable.update({
    where: { id: userId },
    data: { profileDataId: profileId },
  });
}
