import { getAuth } from "@clerk/express";
import { Request, Response } from "express";

export const requireAuth = (req: Request, res: Response, next: any) => {
  const { isAuthenticated } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "User authentication required" });
  }
  next();
}