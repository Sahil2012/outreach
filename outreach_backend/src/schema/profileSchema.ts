import { z } from "zod";

const EducationSchema = z.object({
    school: z.string().optional(),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
});

const SkillSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
});

const ExperienceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
});

export const UpdateProfileSchema = z.object({
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
    education: z.array(EducationSchema).optional().nullable(),
    skills: z.array(SkillSchema).optional(),
    experiences: z.array(ExperienceSchema).optional(),
    status: z.string().optional().nullable(),
    resumeUrl: z.string().optional().nullable(),
    credits: z.number().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;

export const RechargeCreditsSchema = z.object({
    amount: z.number().int().positive("Amount must be a positive integer"),
});

export type RechargeCreditsRequest = z.infer<typeof RechargeCreditsSchema>;
