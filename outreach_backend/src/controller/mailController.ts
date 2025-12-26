import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { log } from "console";
import { SendMailDto, SendMailSchema } from "../dto/request/SendMailDto.js";
import { mailService } from "../service/mailService.js";
import { linkToExternalThread } from "../service/threadService.js";
import prisma from "../apis/prismaClient.js";

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

    await linkToExternalThread(prisma, req.body.threadId, response.threadId);
    console.log("Linked thread to external thread");

    return res.json({ success: true });

  } catch (error: any) {
    log("Send email error:", error);
    const statusCode = error.message.includes("User not connected") ? 400 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
