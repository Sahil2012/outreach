import { Request, Response } from "express";
import { getThreadPreview } from "../service/threadService.js";
import prisma from "../apis/prismaClient.js";
import { getAuth } from "@clerk/express";

export const previewThread = async (req: Request, res: Response) => {

    const threadId = parseInt(req.params.threadId, 10);

    if (isNaN(threadId)) {
        return res.status(400).json({ error: "Invalid thread ID" });
    }

    const {userId : clerkUserId} = getAuth(req);

    try {
        const threadPreview = await getThreadPreview(prisma, clerkUserId!, threadId);
        if (!threadPreview) {
            return res.status(404).json({ error: "Thread not found" });
        }
        return res.status(200).json(threadPreview);
    } catch (error) {
        console.error("Error fetching thread preview:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}