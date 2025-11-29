import { log } from "console";
import { Request, Response } from "express";
import prisma from "../apis/prismaClient.js";
import { clerkClient, getAuth } from "@clerk/express";

// /auth/me
export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({ message: "User info retrieved" });
};