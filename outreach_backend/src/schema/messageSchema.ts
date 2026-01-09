import { z } from "zod";

export const EditMessageSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    body: z.string().min(1, "Body is required"),
});

export type EditMessageRequest = z.infer<typeof EditMessageSchema>;

export const MarkMessageAsSentSchema = z.object({
    threadId: z.number().int().positive("Thread ID must be a positive integer"),
});

export type MarkMessageAsSentRequest = z.infer<typeof MarkMessageAsSentSchema>;
