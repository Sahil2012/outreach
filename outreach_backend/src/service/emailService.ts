import { log } from "console";
import prisma from "../apis/prismaClient.js";
import { GenerateMailRequest } from "../types/GenerateMailRequest.js";
import { upsertEmployee } from "./employeeService.js";
import { handleTailoredJobs } from "./jobService.js";
import { saveMessage } from "./messageService.js";
import { createThread } from "./threadService.js";
import EmailType from "../types/EmailType.js";


export async function saveDraftEmail(
  authUserId: string,
  req: Extract<GenerateMailRequest, { type: EmailType.COLD | EmailType.TAILORED }>,
  body: string,
  subject: string
) {
  if (!authUserId) throw new Error("Missing authUserId");
  if (!body.trim()) throw new Error("Empty mail body");
  if (!subject.trim()) throw new Error("Empty subject");

  log("Saving draft email for user:", authUserId);

  return prisma.$transaction(async (tx) => {
    const employee = await upsertEmployee(tx, req);

    const thread = await createThread(tx, authUserId, employee.id, req.type);

    if (req.type === EmailType.TAILORED) {
      await handleTailoredJobs(tx, thread.id, req.jobs, req.jobDescription);
    }

    const message = await saveMessage(tx, thread.id, authUserId, subject, body);

    return { messageId: message.id, ...thread };
  });
}
