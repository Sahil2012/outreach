
import { Request, Response, NextFunction } from "express";
import { getMessageById, updateMessage, deleteMessage as removeMessage } from "../service/messageService.js";
import { getAuth } from "@clerk/express";
import prisma from "../apis/prismaClient.js";
import { MessageRequestDTO } from "../dto/request/MessageRequestDTO.js";
import { MessageDTO } from "../dto/reponse/MessageDTO.js";
import { toMessageDTO } from "../mapper/messageDTOMapper.js";

export const editMessage = async (req: Request<any, {}, MessageRequestDTO>, res: Response) => {

    const messageId = parseInt(req.params.messageId, 10);

    if (isNaN(messageId)) {
        return res.status(400).json({ error: "Invalid message ID" });
    }

    const { subject, body } = req.body;

    const { userId: clerkUserId } = getAuth(req);

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

export const getMessage = async (req: Request, res: Response<MessageDTO | { error: string }>) => {
    const messageId = parseInt(req.params.messageId, 10);

    if (isNaN(messageId)) {
        return res.status(400).json({ error: "Invalid message ID" });
    }

    const { userId: clerkUserId } = getAuth(req);

    try {
        const message = await getMessageById(prisma, messageId, clerkUserId!);

        return res.status(200).json(toMessageDTO(message));
    } catch (error) {
        console.error("Error retrieving message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteMessage = async (req: Request, res: Response) => {

    const messageId = parseInt(req.params.messageId, 10);

    if (isNaN(messageId)) {
        return res.status(400).json({ error: "Invalid message ID" });
    }

    const { userId: clerkUserId } = getAuth(req);

    try {
        const deletedMessage = await removeMessage(prisma, messageId, clerkUserId!);
        if (!deletedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }
        return res.status(200).json(deletedMessage);
    } catch (error: any) {
        console.error("Error deleting message:", error);
        if (error.message === "Message cannot be deleted unless it is in DRAFT state") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}