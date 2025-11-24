import { Request, Response } from "express";
import { supabase } from "../apis/supabaseClient.js";
import { enqueueResumeJob } from "../utils/enqueResume.js";
import { log } from "console";
import prisma from "../apis/prismaClient.js";
import { getAuth } from "@clerk/express";

// GET /profile/me
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("id", clerkUserId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

//GET /profile/readiness
export const checkReadiness = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      log("Unauthorized access attempt to check readiness");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await prisma.userProfileData.findUnique({
      where: { userId: clerkUserId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const readiness = await prisma.profileReadiness.findUnique({
      where: { userProfileId: profile.id },
    });

    if (!readiness) {
      return res.status(404).json({ error: "Readiness status not found" });
    }

    res.json({ completenessStatus: readiness.completenessStatus });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /profile/update
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      log("Unauthorized access attempt to update profile");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updates = req.body;

    const { data, error } = await supabase
      .from("User")
      .update(updates)
      .eq("id", clerkUserId)
      .select();

    if (error) throw error;
    res.json({ message: "Profile updated", data });
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

    await supabase
      .from("User")
      .update({ resumeUrl: uploadData.path })
      .eq("id", clerkUserId);

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
