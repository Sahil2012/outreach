import { z } from "zod";



const experiencesSchema = z.array(z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
}));

export const ProfileSchema = z.object({
    summary: z.string().nullable(),
    education: z.any().nullable(),
    skills: z.array(z.object({
        name: z.string(),
    })),
    experiences: experiencesSchema,
    status: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    resumeUrl: z.string().nullable().optional(),
    credits: z.number().optional(),
});

export const RechargeCreditsRequestSchema = z.object({
    amount: z.number().int().positive(),
});

export const RechargeCreditsResponseSchema = z.object({
    message: z.string(),
});

export const StatsResponseSchema = z.object({
    reffered: z.number(),
    reachedOut: z.number(),
    followUps: z.number(),
    absonded: z.number(),
});

export type ProfileResponse = z.infer<typeof ProfileSchema>;

export type ProfileRequest = z.infer<typeof ProfileSchema>;

export type RechargeCreditsRequest = z.infer<typeof RechargeCreditsRequestSchema>;

export type StatsResponse = z.infer<typeof StatsResponseSchema>;

