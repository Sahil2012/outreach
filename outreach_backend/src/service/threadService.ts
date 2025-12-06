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
