import { Request, Response } from "express";
import { getThreadById, getThreadPreview } from "../service/threadService.js";
import prisma from "../apis/prismaClient.js";
import { getAuth } from "@clerk/express";
import { ThreadPreviewDTO } from "../dto/reponse/ThreadPreviewDTO.js";
import { toThreadPreviewDTO } from "../mapper/threadPreviewMapper.js";
import { log } from "console";
import { toThreadDTO } from "../mapper/threadDTOMapper.js";

export const previewThread = async (req: Request, res: Response<ThreadPreviewDTO | {error : string}>) => {

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
        const threadPreviewDTO = toThreadPreviewDTO(threadPreview);
        log("Fetched thread preview DTO:", threadPreview);
        return res.status(200).json(threadPreviewDTO);
    } catch (error) {
        console.error("Error fetching thread preview:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getThread = async (req: Request, res: Response) => {

    const threadId = parseInt(req.params.threadId, 10);

    if (isNaN(threadId)) {
        return res.status(400).json({ error: "Invalid thread ID" });
    }

    const {userId : clerkUserId} = getAuth(req);

    try {
        const thread = await getThreadById(prisma, clerkUserId!, threadId);
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        return res.status(200).json(toThreadDTO(thread));
    } catch (error) {
        console.error("Error fetching thread:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}