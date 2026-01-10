import { NextFunction, Request, Response } from "express";
import { log } from "console";
import { getAuth } from "@clerk/express";
import { mailService } from "../service/mailService.js";
import {
  linkToExternalThread,
  upgradeThreadStatus,
} from "../service/threadService.js";
import prisma from "../apis/prismaClient.js";
import { generateAndSaveEmail } from "../service/emailService.js";
import { DraftEmailDTO } from "../dto/reponse/DraftEmailDTO.js";
import { GenerateMailBody, SendMailDto } from "../schema/mailSchema.js";
import { getUserCredits, updateCredits } from "../service/profileService.js";
import { updateState } from "../service/messageService.js";
import { MessageState } from "@prisma/client";

import { GenerateMailRequest } from "../types/GenerateMailRequest.js";

export const generateNewMailTrail = async (
  req: Request<
    {},
    {},
    GenerateMailBody
  >,
  res: Response<DraftEmailDTO | { error: string }>,
  next: NextFunction
) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      log("Unauthorized access attempt to mail generator");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requestWithUser = { ...req.body, userId: clerkUserId };

    const profile = await getUserCredits(clerkUserId);
    if (!profile || profile.credits <= 0) {
      log("User has no credits");
      return res.status(429).json({ error: "No credits available" });
    }
    log("User has credits:", profile.credits);

    const result = await generateAndSaveEmail(clerkUserId, requestWithUser as unknown as GenerateMailRequest);

    await updateCredits(clerkUserId, 1);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error generating email:", error);
    // Return 400 for bad requests (like invalid type), 500 otherwise
    const status = error.message.includes("No email strategy") ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
};

export const sendMailUsingClerkToken = async (req: Request<{}, {}, SendMailDto>, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });
    const mailData: SendMailDto = req.body;

    const response = await mailService.sendMail(userId, mailData);
    console.log("Response from Gmail API:", response);

    await prisma.$transaction(async (tx) => {
      await linkToExternalThread(
        tx,
        req.body.threadId,
        response.threadId,
        response.id
      );
      console.log("Linked thread to external thread");
      await upgradeThreadStatus(tx, req.body.threadId, userId);
      await updateState(tx, mailData.messageId, MessageState.SENT, userId);
      console.log("Upgraded the thread status and updated message status to SENT");
    });

    return res.json({ success: true });
  } catch (error: any) {
    if (
      error.clerkError &&
      error.errors.length > 0 &&
      error.errors.some((e: any) => e.code === "oauth_missing_refresh_token")
    ) {
      return res
        .status(422)
        .json({ error: { code: "oauth_missing_refresh_token", message: "Please re-authenticate with Google" } });
    }
    log("Send email error:", error);
    const statusCode = error.message.includes("User not connected") ? 400 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
