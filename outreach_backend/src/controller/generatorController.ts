import { NextFunction, Request, Response } from "express";
import { log } from "console";
import { GenerateMailRequest } from "../types/GenerateMailRequest.js";
import { emailStrategy } from "../service/email/emailStratergy.js";
import prisma from "../apis/prismaClient.js";
import { getAuth } from "@clerk/express";
import { saveDraftEmail } from "../service/emailService.js";
import { DraftEmailDTO } from "../dto/DraftEmailDTO.js";

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

    const appUser = await prisma.userTable.findUnique({
      where: { authUserId: clerkUserId },
      select: { id: true },
    });

    if (!appUser) {
      log("User not found for authUserId:", clerkUserId);
      return res.status(404).json({ error: "User not found" });
    } else {
      log("Generating email for userId:", appUser.id);
      req.body.userId = appUser.id;
    }

    const emailGenerator = emailStrategy[req.body.type];

    if (!emailGenerator) {
      log("No email strategy found for type:", req.body.type);
      return res.status(400).json({ error: "Invalid email type" });
    }

    const emailContent = await emailGenerator(req.body);
    log("Email generated successfully for userId:", req.body.userId);

    const thread = await saveDraftEmail(
      clerkUserId,
      req.body as Extract<GenerateMailRequest, { type: "cold" | "tailored" }>,
      emailContent.body,
      emailContent.subject
    );
    log("Draft email saved successfully for userId:", req.body.userId);

    res.status(200).json({ threadId: thread.id,...emailContent });
  } catch (error) {
    console.error("Error generating email:", error);
    next(error);
  }
};

export default mailGeneratorController;
