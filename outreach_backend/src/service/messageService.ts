import { MessageState, Prisma } from "@prisma/client";
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

export async function updateState(
  tx: Prisma.TransactionClient,
  messageId: number,
  state: MessageState
) {
  console.log("Updating message ID:", messageId, "to state:", state);

  return tx.message.update({
    where: {
      id: messageId,
    },
    data: {
      state,
    },
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

export async function populateMessagesForThread(tx: Prisma.TransactionClient, threadId: number, authUserId: string, messages: any[]) {

  // Get all existing messages for this thread
  const existingMessages = await tx.message.findMany({
    where: {
      threadId,
      externalMessageId: {
        in: messages.map((m) => m.id),
      },
    },
    select: {
      externalMessageId: true,
    },
  });

  const existingIds = new Set(existingMessages.map((m: any) => m.externalMessageId));

  // Filter out messages that already exist
  const newMessages = messages.filter((m: any) => !existingIds.has(m.id));

  if (newMessages.length === 0) {
    log("No new messages to save for thread:", threadId);
    return;
  }

  log("Saving", newMessages.length, "new messages for thread:", threadId);

  // Bulk insert new messages
  await tx.message.createMany({
    data: newMessages.map((message: any) => ({
      threadId,
      authUserId,
      subject: message.subject || "",
      body: message.body || "",
      fromUser: message.fromUser || false,
      externalMessageId: message.id,
    })),
  });
}