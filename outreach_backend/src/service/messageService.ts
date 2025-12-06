import { Prisma } from "@prisma/client";
import { log } from "console";

export async function saveMessage(
  tx: Prisma.TransactionClient,
  threadId: number,
  authUserId: string,
  subject: string,
  body: string
) {
    log("Saving message for thread:", threadId, "by user:", authUserId);
  return tx.message.create({
    data: {
      threadId,
      authUserId,
      subject,
      body,
      fromUser: true,
    },
  });
}
