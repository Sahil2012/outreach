import { z } from "zod";
import { ThreadStatus } from "@prisma/client";

export const UpdateThreadSchema = z.object({
    status: z.nativeEnum(ThreadStatus).optional(),
    isAutomated: z.boolean().optional(),
}).refine(data => data.status !== undefined || data.isAutomated !== undefined, {
    message: "At least one of 'status' or 'isAutomated' must be provided",
});

export type UpdateThreadRequest = z.infer<typeof UpdateThreadSchema>;
