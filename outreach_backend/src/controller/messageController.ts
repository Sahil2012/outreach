
import { Request, Response, NextFunction } from "express";
import { updateMessage } from "../service/messageService.js";
import { getAuth } from "@clerk/express";
import prisma from "../apis/prismaClient.js";
import { MessageDTO } from "../dto/request/MessageDTO.js";

export const editMessage = async (req: Request<any,{}, MessageDTO>, res: Response) => {
    
    const messageId = parseInt(req.params.messageId, 10);

    if (isNaN(messageId)) {
        return res.status(400).json({ error: "Invalid message ID" });
    }

    const { subject, body } = req.body;

    const {userId : clerkUserId} = getAuth(req);

    try {
        const updatedMessage = await updateMessage(prisma, messageId, clerkUserId!, subject!, body!);
        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }
        return res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error updating message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}