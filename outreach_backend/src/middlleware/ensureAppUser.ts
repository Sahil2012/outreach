import { clerkClient, getAuth } from "@clerk/express";
import { log } from "console";
import prisma from "../apis/prismaClient.js";
import { Request, Response, NextFunction } from "express";

export const ensureAppUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { userId: clerkUserId } = getAuth(req);
  log("Authenticated User ID:", clerkUserId);

  const clerkUser = await clerkClient.users.getUser(clerkUserId || "");

  let appUser = await prisma.userTable.findUnique({
    where: { authUserId: clerkUserId || "" },
  });

  if (!appUser) {
    log("User not found, creating new user with ID:", clerkUserId);

    try {
      appUser = await prisma.userTable.create({
        data: {
          authUserId: clerkUser.id,
          userName: clerkUser.emailAddresses[0].emailAddress,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
        },
      });
      log("User created successfully with ID:", clerkUser.id);
      next();
    } catch (err: any) {
      log("Error creating user:", err.message);
      res.status(500).json({ error: "Failed to initialize the user." });
    }
  }

  next();
};
