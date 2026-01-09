import { z } from "zod";
import EmailType from "../types/EmailType.js";

// Common Contact Info Schema
const ContactInfoSchema = z.object({
    contactName: z.string().min(1, "Contact name is required"),
    contactEmail: z.string().email("Invalid email format").optional(),
    companyName: z.string().min(1, "Company name is required"),
    role: z.string().optional(),
});

// Base parts
const EmailRequestBaseSchema = z.object({
    type: z.nativeEnum(EmailType),
});

// Tailored Email Schema
const TailoredEmailSchema = EmailRequestBaseSchema.merge(ContactInfoSchema).extend({
    type: z.literal(EmailType.TAILORED),
    jobs: z.array(z.string()).min(1, "At least one job is required"),
    jobDescription: z.string().min(1, "Job description is required"),
});

// Cold Email Schema
const ColdEmailSchema = EmailRequestBaseSchema.merge(ContactInfoSchema).extend({
    type: z.literal(EmailType.COLD),
    templateId: z.string().optional(),
});

// Followup Email Schema
const FollowupEmailSchema = EmailRequestBaseSchema.extend({
    type: z.literal(EmailType.FOLLOWUP),
    threadId: z.number().int().positive("Thread ID must be a positive integer"),
});

// Thank You Email Schema
const ThankYouEmailSchema = EmailRequestBaseSchema.extend({
    type: z.literal(EmailType.THANKYOU),
    threadId: z.number().int().positive("Thread ID must be a positive integer"),
});

// Discriminated Union for GenerateMailBody
export const GenerateMailSchema = z.discriminatedUnion("type", [
    TailoredEmailSchema,
    ColdEmailSchema,
    FollowupEmailSchema,
    ThankYouEmailSchema,
]);

export type GenerateMailBody = z.infer<typeof GenerateMailSchema>;
export type TailoredEmailBody = z.infer<typeof TailoredEmailSchema>;
export type ColdEmailBody = z.infer<typeof ColdEmailSchema>;
export type FollowupEmailBody = z.infer<typeof FollowupEmailSchema>;
export type ThankYouEmailBody = z.infer<typeof ThankYouEmailSchema>;

export const SendMailSchema = z.object({
    threadId: z.number().int().positive(),
    messageId: z.number().int().positive(),
    attachResume: z.boolean().optional(),
});

export type SendMailDto = z.infer<typeof SendMailSchema>;
