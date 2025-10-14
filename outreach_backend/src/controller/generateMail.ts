import { NextFunction, Request, Response } from "express";
import extractSkills from "../service/extractSkills.js";
import generateEmail from "../service/generateEmail.js";
import GenerateMailRequest from "../types/GenerateMailRequest.js";
import HttpError from "../types/HttpError.js";
import UserSpecificDetails from "../types/UserSpecificDetails.js";

const generateMail = async (req : Request<{},{},GenerateMailRequest>, res : Response, next : NextFunction) => {
  try {
    const { resumeLink, jobId, hrName, companyName } = req.body;

    if (!resumeLink || !jobId || !hrName || !companyName) {
        const error : HttpError = new Error("Missing required fields");
        error.status = 400;
        throw error;
    }

    const userSpecificDetails : UserSpecificDetails  = await extractSkills(resumeLink);
    userSpecificDetails.jobId = jobId;
    userSpecificDetails.hrName = hrName;
    userSpecificDetails.companyName = companyName;

    const email = await generateEmail(userSpecificDetails);
    return res.status(200).json({ email });
  } catch (error) {
    console.error("Error generating email:", error);
    next(error);
  }
};

export default generateMail;
