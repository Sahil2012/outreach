import { log } from "console";
import { Request, Response } from "express";
import prisma from "../apis/prismaClient.js";

// GET /auth/me
export const getMe = async (req: Request, res: Response) => {
  let authUserId = req.user.id;
  log("Authenticated User ID:", authUserId);

  const user = await prisma.userTable.findUnique({
    where: { id: authUserId },
  });

  if (!user) {
    log("User not found, creating new user with ID:", req.user.id);
    try {
      await prisma.userTable.create({
        data: {
          authUserId: req.user.id,
          userName: req.user.userName,
          email: req.user.email,
        },
      });
      log("User created successfully with ID:", req.user.id);
    } catch (err: any) {
      log("Error creating user:", err.message);
      res.status(500).json({ error: "Failed to initialize the user." });
    }
  }

  res.status(200).json({ message: "User info retrieved" });
};

// POST /auth/webhook
export const authWebhook = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Webhook received" });
};
