import { log } from "console";
import { Request, Response } from "express";
import prisma from "../apis/prismaClient.js";
import { clerkClient, getAuth } from "@clerk/express";

// GET /auth/me
export const getMe = async (req: Request, res: Response) => {
  let { userId: clerkUserId } = getAuth(req);
  log("Authenticated User ID:", clerkUserId);

  if (!clerkUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  const appUser = await prisma.userTable.findUnique({
    where: { id: clerkUserId },
  });

  if (!appUser) {
    log("User not found, creating new user with ID:", clerkUserId);

    try {
      await prisma.userTable.create({
        data: {
          authUserId: clerkUser.id,
          userName: clerkUser.username,
          email: clerkUser.emailAddresses[0].emailAddress,
        },
      });
      log("User created successfully with ID:", clerkUser.id);
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
