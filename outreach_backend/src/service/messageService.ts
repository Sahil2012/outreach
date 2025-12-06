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

export async function updateMessage(
  tx: Prisma.TransactionClient,
  messageId: number,
  authUserId: string,
  newSubject?: string,
  newBody?: string
) {
  console.log("Editing message ID:", messageId, "by user:", authUserId);

  const updateData: any = {};
  if (typeof newSubject === "string" && newSubject.length != 0) updateData.subject = newSubject;
  if (typeof newBody === "string" && newBody.length != 0) updateData.body = newBody;

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided to update.");
  }

  return tx.message.update({
    where: {
      id: messageId,
      authUserId: authUserId,
    },
    data: updateData,
  });
}

export async function getMessageById(
  tx: Prisma.TransactionClient,
  messageId: number,
  authUserId: string
) {
  log("Retrieving message ID:", messageId, "for user:", authUserId);
  return tx.message.findFirst({
    where: {
      id: messageId,
      authUserId: authUserId,
    },
  });
}