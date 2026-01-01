import { Request, Response } from "express";
import busboy from "busboy";
import { storageService } from "../service/storageService.js";
import { enqueueResumeJob } from "../utils/enqueResume.js";
import { log } from "console";
import { getAuth } from "@clerk/express";
import { toProfileDTO } from "../mapper/profileDTOMapper.js";
import { getUserProfile, updateProfile as updateProfileService } from "../service/profileService.js";
import { ProfileDTO } from "../dto/reponse/ProfileDTO.js";
import prisma from "../apis/prismaClient.js";

// GET /profile
export const getProfile = async (req: Request, res: Response<ProfileDTO | any>) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User authentication required",
      });
    }

    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Profile does not exist for this user",
      });
    }

    // Convert DB model to a safe DTO
    const dto = toProfileDTO(profile);

    return res.status(200).json(dto);

  } catch (error: any) {
    console.error("[getProfile] Internal Error:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      details: error.message,
    });
  }
};

// PATCH /profile
export const updateProfile = async (req: Request<{}, {}, ProfileDTO>, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      log("Unauthorized access attempt to update profile");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedProfile = await updateProfileService(clerkUserId, req.body);
    res.json({ message: "Profile updated", data: updatedProfile });
  } catch (err: any) {
    console.error("[updateProfile] Internal Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /profile/upload/resume
export const uploadResume = async (req: Request, res: Response) => {
  const { userId: clerkUserId } = getAuth(req);

  if (!clerkUserId) {
    log("Unauthorized access attempt to upload resume");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const bb = busboy({ headers: req.headers });
  let autofill = false;
  let fileUploaded = false;

  bb.on("field", (name, val) => {
    if (name === "autofill") {
      autofill = val === "true";
    }
  });

  bb.on("file", async (name, file, info) => {
    const { filename, mimeType } = info;
    const filePath = `user_${clerkUserId}/${filename}`;

    try {
      const uploadPath = await storageService.uploadFileStream(filePath, file, mimeType);

      await prisma.userProfileData.update({
        where: { authUserId: clerkUserId },
        data: { resumeUrl: uploadPath },
      });

      log(`Resume uploaded for user ${clerkUserId} at path ${uploadPath}`);
      fileUploaded = true;

      if (autofill) {
        await enqueueResumeJob(clerkUserId, uploadPath);
      }

    } catch (err) {
      console.error("Stream upload error:", err);
    }
  });

  bb.on("close", () => {
    if (fileUploaded) {
      res.json({
        message: autofill
          ? "Resume uploaded and sent for parsing"
          : "Resume uploaded successfully",
      });
    } else {
      // If no file was processed (or error occurred preventing upload)
      // Ideally we track errors better, but strictly:
      res.status(400).json({ message: "File processing completed, but check logs for success." });
    }
  });

  req.pipe(bb);
};
