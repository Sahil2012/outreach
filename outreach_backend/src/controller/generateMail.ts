import { NextFunction, Request, Response } from "express";
import GenerateMailRequest from "../types/GenerateMailRequest.js";
import HttpError from "../types/HttpError.js";

const generateMail = async (req : Request<{},{},GenerateMailRequest>, res : Response, next : NextFunction) => {
  try {
    const { resumeLink, jobId, hrName, companyName } = req.body;

    if (!resumeLink || !jobId || !hrName || !companyName) {
        const error : HttpError = new Error("Missing required fields");
        error.status = 400;
        throw error;
    }

    return res.status(200).json({  });
  } catch (error) {
    console.error("Error generating email:", error);
    next(error);
  }
};

export default generateMail;
