import { NextFunction, Request, Response } from "express";
import { log } from "console";
import { getAuth } from "@clerk/express";
import { SendMailDto, SendMailSchema } from "../dto/request/SendMailDto.js";
import { mailService } from "../service/mailService.js";
import { linkToExternalThread, updateStatus } from "../service/threadService.js";
import prisma from "../apis/prismaClient.js";
import { ThreadStatus } from "@prisma/client";
import { GenerateMailRequest, TailoredEmailRequest } from "../types/GenerateMailRequest.js";
import { generateAndSaveEmail } from "../service/emailService.js";
import { DraftEmailDTO } from "../dto/reponse/DraftEmailDTO.js";
import EmailType from "../types/EmailType.js";


export const generateNewMailTrail = async (
  req: Request<{}, {}, Extract<GenerateMailRequest, { type: EmailType.COLD | EmailType.TAILORED | EmailType.FOLLOWUP }>>,
  res: Response<DraftEmailDTO | { error: string }>,
  next: NextFunction
) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      log("Unauthorized access attempt to mail generator");
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.body.userId = clerkUserId;

    const result = await generateAndSaveEmail(clerkUserId, req.body);

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error generating email:", error);
    // Return 400 for bad requests (like invalid type), 500 otherwise
    const status = error.message.includes("No email strategy") ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
};

export const sendMailUsingClerkToken = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    // Validate Input
    const validationResult = SendMailSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: validationResult.error.errors
      });
    }

    const mailData: SendMailDto = validationResult.data;

    const response = await mailService.sendMail(userId, mailData);
    console.log("Response from Gmail API:", response);

    await linkToExternalThread(prisma, req.body.threadId, response.threadId, response.id);
    console.log("Linked thread to external thread");

    await updateStatus(prisma, req.body.threadId, ThreadStatus.SENT);
    console.log("Updated thread status to SENT");
    return res.json({ success: true });

  } catch (error: any) {
    log("Send email error:", error);
    const statusCode = error.message.includes("User not connected") ? 400 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
