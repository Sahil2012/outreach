import { NextFunction, Request, Response } from "express";
import { log } from "console";
import { GenerateMailRequest } from "../types/GenerateMailRequest.js";
import { emailStrategy } from "../service/email/emailStratergy.js";
import prisma from "../apis/prismaClient.js";

const mailGeneratorController = async (req : Request<{},{},GenerateMailRequest>, res : Response, next : NextFunction) => {
  try {
    const authUserId = req.user.id;
    
    const user = await prisma.userTable.findUnique({
      where: { authUserId: authUserId },
      select: { id: true }
    });

    if (!user) {
      log("User not found for authUserId:", authUserId);
      return res.status(404).json({ error: "User not found" });
    } else {
      log("Generating email for userId:", user.id);
      req.body.userId = user.id;
    }

    const emailGenerator = emailStrategy[req.body.type];
    
    if (!emailGenerator) {
      log("No email strategy found for type:", req.body.type);
      return res.status(400).json({ error: "Invalid email type" });
    }

    const emailContent = await emailGenerator(req.body);
    
    log("Email generated successfully for userId:", req.body.userId);

    res.status(200).json({ emailContent });
  } catch (error) {
    console.error("Error generating email:", error);
    next(error);
  }
};

export default mailGeneratorController;
