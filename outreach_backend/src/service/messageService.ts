import { MessageStatus, Prisma } from "@prisma/client";
import { log } from "console";
import { MessageRequest } from "../schema/messageSchema.js";
import { logger } from "../utils/logger.js";

export async function saveMessage(
  tx: Prisma.TransactionClient,
  threadId: number,
  authUserId: string,
  subject: string,
  body: string
) {

  const lastMessage = await getLastMessage(tx, threadId, authUserId);

  if (lastMessage && lastMessage.status == MessageStatus.DRAFT) {
    log("Updating draft message for thread:", threadId, " by user:", authUserId);
    return tx.message.update({
      where: {
        id: lastMessage.id,
        authUserId: authUserId,
      },
      data: {
        subject,
        body,
      },
    });
  }

  log("Saving message for thread:", threadId, " by user:", authUserId);
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

export async function getLastMessage(tx: Prisma.TransactionClient, threadId: number, authUserId: string) {
  return tx.message.findFirst({
    where: {
      threadId,
      authUserId: authUserId,
    },
    orderBy: {
      date: "desc",
    },
    take: 1
  });
}

export async function updateMessage(
  tx: Prisma.TransactionClient,
  messageId: number,
  authUserId: string,
  message: MessageRequest
) {
  console.log("Editing message ID:", messageId, "by user:", authUserId);

  const updateData: any = {};
  if (typeof message.subject === "string" && message.subject.length != 0) updateData.subject = message.subject;
  if (typeof message.body === "string" && message.body.length != 0) updateData.body = message.body;
  if (typeof message.status === "string" && message.status.length != 0) updateData.status = MessageStatus[message.status];

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided to update");
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

export async function populateMessagesForThread(tx: Prisma.TransactionClient, threadId: number, authUserId: string, messages: any[]) {
  logger.info(`Populating messages for user ${authUserId} from external source to db with thread ID ${threadId}`);
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

  const newMessages = messages.filter((m: any) => !existingIds.has(m.id));

  if (newMessages.length === 0) {
    logger.info(`No new messages to save for user ${authUserId} with thread ID ${threadId}`);
    return;
  }

  logger.info(`Saving ${newMessages.length} new messages for user ${authUserId} with thread ID ${threadId}`);

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

export async function deleteMessage(tx: Prisma.TransactionClient, messageId: number, authUserId: string) {
  console.log("Deleting message ID:", messageId, "for user:", authUserId);

  const message = await tx.message.findFirst({
    where: {
      id: messageId,
      authUserId: authUserId,
    },
  });

  if (!message) {
    return null;
  }

  if (message.status !== MessageStatus.DRAFT) {
    throw new Error("Message cannot be deleted unless it is in DRAFT state");
  }

  return tx.message.delete({
    where: {
      id: messageId,
    },
  });
}