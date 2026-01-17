import { Request, Response, NextFunction } from "express";
import { getMessageById, updateMessage, deleteMessage as removeMessage, updateState } from "../service/messageService.js";
import { getAuth } from "@clerk/express";
import prisma from "../apis/prismaClient.js";
import { GenerateMailRequest } from "../types/GenerateMailRequest.js";
import { toMessageDTO } from "../mapper/messageDTOMapper.js";
import { mailService } from "../service/mailService.js";
import {
    linkToExternalThread,
    upgradeThreadStatus,
} from "../service/threadService.js";
import { generateAndSaveEmail } from "../service/emailService.js";
import { getUserCredits, updateCredits } from "../service/profileService.js";
import { log } from "console";
import { MessageRequest, MessageResponse, MessageTypeResponse, SendMailRequest } from "../schema/messageSchema.js";
import MessageType from "../types/MessageType.js";
import { MessageStatus } from "@prisma/client";
import { DraftMailResponse, GenerateMailBody } from "../schema/mailSchema.js";

export const editMessage = async (
    req: Request<any, {}, MessageRequest>,
    res: Response<MessageResponse | { error: string }>
) => {

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
        return res.status(200).json(toMessageDTO(updatedMessage));
    } catch (error) {
        console.error("Error updating message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessage = async (
    req: Request,
    res: Response<MessageResponse | { error: string }>
) => {
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

export const deleteMessage = async (
    req: Request,
    res: Response<MessageResponse | { error: string }>
) => {

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
        return res.status(200).json(toMessageDTO(deletedMessage));
    } catch (error: any) {
        console.error("Error deleting message:", error);
        if (error.message === "Message cannot be deleted unless it is in DRAFT state") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getEmailTypes = (
    req: Request,
    res: Response<MessageTypeResponse | { error: string; detail?: string }>
) => {
    try {
        const dto = Object.values(MessageType);

        return res.status(200).json(dto);
    } catch (error) {
        console.error("Error returning email types:", error);

        return res.status(500).json({
            error: "Internal server error",
            detail: (error as any).message,
        });
    }
};

export const generateNewMailTrail = async (
    req: Request<
        {},
        {},
        GenerateMailBody
    >,
    res: Response<DraftMailResponse | { error: string }>,
    next: NextFunction
) => {
    try {
        const { userId: clerkUserId } = getAuth(req);

        if (!clerkUserId) {
            log("Unauthorized access attempt to mail generator");
            return res.status(401).json({ error: "Unauthorized" });
        }

        const requestWithUser: GenerateMailRequest = { ...req.body, userId: clerkUserId };

        const profile = await getUserCredits(clerkUserId);
        if (!profile || profile.credits <= 0) {
            log("User has no credits");
            return res.status(429).json({ error: "No credits available" });
        }
        log("User has credits:", profile.credits);

        const result = await generateAndSaveEmail(clerkUserId, requestWithUser);

        await updateCredits(clerkUserId, 1);
        res.status(200).json(result);
    } catch (error: any) {
        console.error("Error generating email:", error);
        // Return 400 for bad requests (like invalid type), 500 otherwise
        const status = error.message.includes("No email strategy") ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
};

export const sendMailUsingClerkToken = async (
    req: Request<any, {}, SendMailRequest>,
    res: Response<any | { error: any }>
) => {
    try {

        const messageId = parseInt(req.params.messageId, 10);

        if (!messageId) {
            return res.status(400).json({ error: "Invalid message ID" });
        }

        const { userId } = getAuth(req);

        const mailData: SendMailRequest = req.body;

        const response = await mailService.sendMail(userId!, { ...mailData, messageId });
        console.log("Response from Gmail API:", response);

        await prisma.$transaction(async (tx) => {
            await linkToExternalThread(
                tx,
                req.body.threadId,
                response.threadId,
                response.id
            );
            console.log("Linked thread to external thread");
            await upgradeThreadStatus(tx, req.body.threadId, userId!);
            await updateState(tx, messageId, MessageStatus.SENT, userId!);
            console.log("Upgraded the thread status and updated message status to SENT");
        });

        return res.json({ success: true });
    } catch (error: any) {
        if (
            error.clerkError &&
            error.errors.length > 0 &&
            error.errors.some((e: any) => e.code === "oauth_missing_refresh_token")
        ) {
            return res
                .status(422)
                .json({ error: { code: "oauth_missing_refresh_token", message: "Please re-authenticate with Google" } });
        }
        log("Send email error:", error);
        const statusCode = error.message.includes("User not connected") ? 400 : 500;
        return res.status(statusCode).json({ error: error.message });
    }
};
