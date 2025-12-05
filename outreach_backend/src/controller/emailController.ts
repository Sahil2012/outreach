
import { Request, Response } from "express";
import EmailType from "../types/EmailType.js";

export const getEmailTypes = (_req: Request, res: Response) => {
  try {
    const dto = Object.values(EmailType);

    return res.status(200).json(dto);
  } catch (error) {
    console.error("Error returning email types:", error);

    return res.status(500).json({
      error: "Internal server error",
      detail: (error as any).message,
    });
  }
};
