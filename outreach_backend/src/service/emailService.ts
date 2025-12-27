import { Prisma } from "@prisma/client";
import { log } from "console";
import prisma from "../apis/prismaClient.js";
import { GenerateMailRequest } from "../types/GenerateMailRequest.js";
import { emailStrategy } from "./email/context.js";
import { upsertEmployee } from "./employeeService.js";
import { handleTailoredJobs } from "./jobService.js";
import { saveMessage } from "./messageService.js";
import { createThread } from "./threadService.js";
import EmailType from "../types/EmailType.js";


export async function saveDraftEmail(
  authUserId: string,
  req: Extract<GenerateMailRequest, { type: EmailType.COLD | EmailType.TAILORED | EmailType.FOLLOWUP }>,
  body: string,
  subject: string
) {
  if (!authUserId) throw new Error("Missing authUserId");
  if (!body.trim()) throw new Error("Empty mail body");
  if (!subject.trim()) throw new Error("Empty subject");

  log("Saving draft email for user:", authUserId);

  return prisma.$transaction(async (tx) => {
    const employee = await upsertEmployee(tx, req);
    const threadContext = await resolveThread(tx, authUserId, employee.id, req);

    const message = await saveMessage(
      tx,
      threadContext.id,
      authUserId,
      subject,
      body
    );

    return {
      messageId: message.id,
      ...('isNew' in threadContext ? threadContext : {})
    };
  });
}

async function resolveThread(
  tx: Prisma.TransactionClient,
  authUserId: string,
  employeeId: number,
  req: Extract<GenerateMailRequest, { type: EmailType.COLD | EmailType.TAILORED | EmailType.FOLLOWUP }>
) {
  if (req.type === EmailType.FOLLOWUP) {
    return { id: req.threadId };
  }

  const thread = await createThread(tx, authUserId, employeeId, req.type);

  if (req.type === EmailType.TAILORED) {
    await handleTailoredJobs(tx, thread.id, req.jobs, req.jobDescription);
  }

  return { ...thread, isNew: true };
}

export async function generateAndSaveEmail(
  authUserId: string,
  req: Extract<GenerateMailRequest, { type: EmailType.COLD | EmailType.TAILORED | EmailType.FOLLOWUP }>
) {
  const strategy = emailStrategy[req.type.toLowerCase()];
  if (!strategy) {
    throw new Error(`No email strategy found for type: ${req.type}`);
  }

  log("Generating email using strategy for:", req.type);
  const emailContent = await strategy(req);

  let responseData: any = { ...emailContent };


  const draft = await saveDraftEmail(
    authUserId,
    req,
    emailContent.body,
    emailContent.subject
  );
  responseData.threadId = draft.id;
  responseData.messageId = draft.messageId;


  return responseData;
}
