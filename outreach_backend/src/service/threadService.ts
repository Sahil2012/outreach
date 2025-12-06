import { Prisma } from "@prisma/client";
import { mapEmailTypeToDB } from "../mapper/emailTypeMapper.js";
import { log } from "console";


export async function createThread(
  tx: Prisma.TransactionClient,
  authUserId: string,
  employeeId: number,
  type: "cold" | "tailored"
) {
    log("Creating thread for user:", authUserId, "and employee:", employeeId, "of type:", type);
  return tx.thread.create({
    data: {
      authUserId,
      employeeId,
      type: mapEmailTypeToDB(type),
      lastUpdated: new Date(),
    },
  });
}

export async function getThreadPreview(
  tx: Prisma.TransactionClient,
  authUserId: string,
  threadId: number
) {
  
  log("Fetching preview for thread ID:", threadId);
  return tx.thread.findUnique({
    where: { id: threadId, AND: { authUserId: authUserId } },
    include: {
      Message : {
        orderBy: {
          date : 'desc',
        },
        take: 1
      }
    }
  });
}

export async function getThreadById(
  tx: Prisma.TransactionClient,
  authUserId: string,
  threadId: number
) {
  
  log("Fetching full thread for thread ID:", threadId);
  return tx.thread.findUnique({
    where: { id: threadId, AND: { authUserId: authUserId } },
    include: {
      Message : {
        orderBy: {
          date : 'asc',
        }
      },
      Employee: true,
      Job: {
        select:{
          Job: true
        }
      }
    }
  });
}