import { Request, Response } from "express";
import { supabase } from "../apis/supabaseClient.js";
import { enqueueResumeJob } from "../utils/enqueResume.js";
import { log } from "console";
import { getAuth } from "@clerk/express";
import { toProfileDTO } from "../mapper/profile.profileDTO.js";
import { getUserProfile, updateProfile as updateProfileService } from "../service/profileService.js";
import { ProfileDTO } from "../dto/reponse/ProfileDTO.js";
import prisma from "../apis/prismaClient.js";

// GET /profile/me
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

// PATCH /profile/update
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      log("Unauthorized access attempt to update profile");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedProfile = await updateProfileService(clerkUserId, req.body);
    res.json({ message: "Profile updated", data: updatedProfile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /profile/upload/resume
export const uploadResume = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      log("Unauthorized access attempt to upload resume");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const file = req.file;
    const autofill = req.body.autofill === "true";

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(`user_${clerkUserId}/${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    prisma.userProfileData.update({
      where: {
        authUserId: clerkUserId,
      },
      data: {
        resumeUrl: uploadData.path,
      },
    });

    log(`Resume uploaded for user ${clerkUserId} at path ${uploadData.path}`);
    // Enqueue for background processing
    if (autofill) {
      await enqueueResumeJob(clerkUserId, uploadData.path);
    }

    res.json({
      message: autofill
        ? "Resume uploaded and sent for parsing"
        : "Resume uploaded successfully",
      resumePath: uploadData.path,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
