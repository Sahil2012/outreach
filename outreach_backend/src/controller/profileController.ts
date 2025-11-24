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

// GET /profile/details
export const getProfileDetails = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [skillsRes, projectsRes, educationRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", clerkUserId),
      supabase.from("projects").select("*").eq("user_id", clerkUserId),
      supabase.from("education").select("*").eq("user_id", clerkUserId),
    ]);

    res.json({
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      education: educationRes.data || [],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /profile/details
export const updateProfileDetails = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    const { skills, projects, education } = req.body;

    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Skills
    if (skills) {
      const existingSkills = skills.filter((s: any) => s.id);
      const newSkills = skills.filter((s: any) => !s.id && s.skill_name.trim());

      // Insert new
      if (newSkills.length > 0) {
        await supabase.from("skills").insert(
          newSkills.map((s: any) => ({
            user_id: clerkUserId,
            skill_name: s.skill_name,
            proficiency_level: s.proficiency_level,
          }))
        );
      }

      // Update existing
      for (const skill of existingSkills) {
        await supabase
          .from("skills")
          .update({
            skill_name: skill.skill_name,
            proficiency_level: skill.proficiency_level,
          })
          .eq("id", skill.id);
      }
      
      // Handle deletions (if client sends full list, we should delete missing ones? 
      // The frontend logic handled deletion separately via delete button. 
      // Here we just handle save. The frontend handles delete by calling delete endpoint? 
      // No, frontend `handleSave` didn't handle delete. `deleteSkill` was separate.
      // So we don't need to handle delete here, just update/insert.
    }

    // Projects
    if (projects) {
      const existingProjects = projects.filter((p: any) => p.id);
      const newProjects = projects.filter((p: any) => !p.id && p.title.trim());

      if (newProjects.length > 0) {
        await supabase.from("projects").insert(
          newProjects.map((p: any) => ({
            user_id: clerkUserId,
            ...p,
          }))
        );
      }

      for (const project of existingProjects) {
        await supabase
          .from("projects")
          .update(project)
          .eq("id", project.id);
      }
    }

    // Education
    if (education) {
      const existingEducation = education.filter((e: any) => e.id);
      const newEducation = education.filter((e: any) => !e.id && e.institution.trim());

      if (newEducation.length > 0) {
        await supabase.from("education").insert(
          newEducation.map((e: any) => ({
            user_id: clerkUserId,
            ...e,
          }))
        );
      }

      for (const edu of existingEducation) {
        await supabase
          .from("education")
          .update(edu)
          .eq("id", edu.id);
      }
    }

    res.json({ message: "Profile details updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /profile/item/:type/:id
export const deleteProfileItem = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    const { type, id } = req.params;

    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!["skills", "projects", "education"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const { error } = await supabase
      .from(type)
      .delete()
      .eq("id", id)
      .eq("user_id", clerkUserId);

    if (error) throw error;

    res.json({ message: "Item deleted" });
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
