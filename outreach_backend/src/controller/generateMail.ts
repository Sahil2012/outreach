import { NextFunction, Request, Response } from "express";
import GenerateMailRequest from "../types/GenerateMailRequest.js";
import HttpError from "../types/HttpError.js";
import { getCandidateProfile } from "../service/extractCandidateProfile.js";
import { log } from "console";
import generateEmail from "../service/generateEmail.js";

const generateMail = async (req : Request<{},{},GenerateMailRequest>, res : Response, next : NextFunction) => {
  try {
    const { jobId, hrName, companyName, roleType, roleDescription } = req.body;

    log(req.user);

    if (!jobId || !hrName || !companyName || !(roleType || roleDescription)) {
        const error : HttpError = new Error("Missing required fields");
        error.status = 400;
        throw error;
    }
    
    let profile = await getCandidateProfile(req.user.id);

    log(profile);

    const email = await generateEmail({
      ...profile,
      jobId,
      hrName,
      companyName,
      name : "",
      achievements : "",
      roleType,
      roleDescription
    });

    return res.status(200).json({ email });
  } catch (error) {
    console.error("Error generating email:", error);
    next(error);
  }
};

export default generateMail;
