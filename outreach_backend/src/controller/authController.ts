import { Request, Response } from "express";

// /auth/me
export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({ message: "User info retrieved" });
};