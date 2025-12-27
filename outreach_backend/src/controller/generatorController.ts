import { NextFunction, Request, Response } from "express";
import { log } from "console";
import { GenerateMailRequest } from "../types/GenerateMailRequest.js";
import { emailStrategy } from "../service/email/context.js";
import { getAuth } from "@clerk/express";
import { saveDraftEmail } from "../service/emailService.js";
import { DraftEmailDTO } from "../dto/reponse/DraftEmailDTO.js";
import EmailType from "../types/EmailType.js";

const mailGeneratorController = async (
  req: Request<{}, {}, GenerateMailRequest>,
  res: Response<DraftEmailDTO | { error: string }>,
  next: NextFunction
) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      log("Unauthorized access attempt to mail generator");
      return res.status(401).json({ error: "Unauthorized" });
    }
    log("Generating email for user:", clerkUserId);
    req.body.userId = clerkUserId;

    const emailGenerator = emailStrategy[req.body.type.toLowerCase()];

    if (!emailGenerator) {
      log("No email strategy found for type:", req.body.type);
      return res.status(400).json({ error: "Invalid email type" });
    }
    log("Generating email for type:", req.body);

    const emailContent = await emailGenerator(req.body);
    log("Email generated successfully for userId:", req.body.userId);

    const draftThread = await saveDraftEmail(
      clerkUserId,
      req.body as Extract<GenerateMailRequest, { type: EmailType.COLD | EmailType.TAILORED }>,
      emailContent.body,
      emailContent.subject
    );
    log("Draft email saved successfully for userId:", req.body.userId);

    res.status(200).json({ threadId: draftThread.id, messageId: draftThread.messageId, ...emailContent });
  } catch (error) {
    console.error("Error generating email:", error);
    next(error);
  }
};

export default mailGeneratorController;
