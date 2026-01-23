import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";
import busboy from "busboy";
import { storageService } from "../service/storageService.js";
import { enqueueResumeJob } from "../utils/enqueResume.js";
import { getAuth } from "@clerk/express";
import { toProfileDTO } from "../mapper/profileDTOMapper.js";
import { addCredits, getUserProfile, updateProfile as updateProfileService } from "../service/profileService.js";
import prisma from "../apis/prismaClient.js";
import { getStats } from "../service/threadService.js";
import { CreditRequest, CreditResponse, ProfileRequest, ProfileResponse, StatsResponse } from "../schema/profileSchema.js";

// GET /profile
export const getProfile = async (
  req: Request,
  res: Response<ProfileResponse | any>,
  next: NextFunction
) => {

  try {
    const { userId } = getAuth(req);

    const profile = await getUserProfile(userId!);

    if (!profile) {
      logger.info("Profile not found for user", { userId });
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Profile does not exist for this user",
      });
    }

    return res.status(200).json(toProfileDTO(profile));

  } catch (error) {
    logger.error("Error fetching profile", error);
    next(error);
  }
};

// PATCH /profile
export const updateProfile = async (
  req: Request<{}, {}, ProfileRequest>,
  res: Response,
  next: NextFunction
) => {

  try {
    const { userId: clerkUserId } = getAuth(req);

    const updatedProfile = await updateProfileService(clerkUserId!, req.body);

    logger.info("Profile updated successfully", { userId: clerkUserId });
    res.json({ message: "Profile updated", data: updatedProfile });
  } catch (err: any) {
    logger.error("Error updating profile", err);
    next(err);
  }
};

// PUT /profile/resume
export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { userId: clerkUserId } = getAuth(req);
  logger.info("Starting resume upload", { userId: clerkUserId });

  const bb = busboy({ headers: req.headers });
  let autofill = false;
  let fileUploadPromise: Promise<void> | null = null;

  bb.on("field", (name, val) => {
    if (name === "autofill") {
      autofill = val === "true";
    }
  });

  bb.on("file", (name, file, info) => {
    const { filename, mimeType } = info;
    const filePath = `user_${clerkUserId!}/${filename}`;

    // Store the promise so we can wait for it in 'close'
    fileUploadPromise = (async () => {
      try {
        const uploadPath = await storageService.uploadFileStream(filePath, file, mimeType);

        await prisma.userProfileData.update({
          where: { authUserId: clerkUserId! },
          data: { resumeUrl: uploadPath },
        });

        logger.info("Resume uploaded successfully", { userId: clerkUserId, path: uploadPath });

        if (autofill) {
          logger.info("Enqueuing resume parsing job", { userId: clerkUserId });
          await enqueueResumeJob(clerkUserId!, uploadPath);
        }
      } catch (err) {
        logger.error("Stream upload error:", err);
        throw err; // Propagate error
      }
    })();
  });

  bb.on("close", async () => {
    try {
      if (fileUploadPromise) {
        // Wait for the file processing to complete
        await fileUploadPromise;

        res.json({
          message: autofill
            ? "Resume uploaded and sent for parsing"
            : "Resume uploaded successfully",
        });
      } else {
        res.status(400).json({ message: "No file uploaded or file processing failed." });
      }
    } catch (error) {
      logger.error("Upload failed in close handler", error);
      if (!res.headersSent) {
        next(error);
      }
    }
  });

  req.pipe(bb);
};

// POST /profile/credits/transaction
export const rechargeCredits = async (
  req: Request<{}, {}, CreditRequest>,
  res: Response<CreditResponse>,
  next: NextFunction
) => {

  const { userId: clerkUserId } = getAuth(req);
  const amount = req.body.amount;

  logger.info("Initiating credit recharge", { userId: clerkUserId, amount });

  try {
    const profile = await addCredits(clerkUserId!, amount * 20);
    logger.info("Credits recharged successfully", { userId: clerkUserId, amount });
    res.status(200).json({ amount: profile.credits });
  } catch (e) {
    logger.error("Error recharging credits", e);
    next(e);
  }
}

// GET /profile/stats
export const extractStats = async (
  req: Request,
  res: Response<StatsResponse | { error: string }>,
  next: NextFunction
) => {
  const { userId: clerkUserId } = getAuth(req);
  logger.info("Extracting stats", { userId: clerkUserId });
  try {
    const stats = await getStats(prisma, clerkUserId!);
    logger.info("Stats extracted successfully", { userId: clerkUserId });
    return res.status(200).json(stats);
  } catch (error) {
    logger.error("Error extracting stats", error);
    next(error);
  }
}
