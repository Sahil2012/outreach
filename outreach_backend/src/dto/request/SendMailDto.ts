import { z } from "zod";

export const SendMailSchema = z.object({
    threadId: z.number().int().positive(),
    messageId: z.number().int().positive(),
});

export type SendMailDto = z.infer<typeof SendMailSchema>;
