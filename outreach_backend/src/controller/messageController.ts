import { Request, Response, NextFunction } from "express";
import { getMessageById, updateMessage, deleteMessage as removeMessage } from "../service/messageService.js";
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
import { addCredits, deductCredits } from "../service/profileService.js";
import { MessageResponse, MessageTypeResponse, SendMailRequest, MessageRequest } from "../schema/messageSchema.js";
import MessageType from "../types/MessageType.js";
import { MessageStatus } from "@prisma/client";
import { DraftMailResponse, GenerateMailBody } from "../schema/mailSchema.js";
import { logger } from "../utils/logger.js";

//PATCH /messages/:id
export const editMessage = async (
    req: Request<any, {}, MessageRequest>,
    res: Response<MessageResponse | { error: string }>
) => {

    const messageId = parseInt(req.params.id, 10);

    if (isNaN(messageId)) {
        logger.error(`Invalid message ID ${messageId}`);
        return res.status(400).json({ error: "Invalid message ID" });
    }

    const { userId: clerkUserId } = getAuth(req);

    try {
        const updatedMessage = await updateMessage(prisma, messageId, clerkUserId!, req.body);
        if (!updatedMessage) {
            logger.error(`Message not found for user ${clerkUserId} and message ID ${messageId}`);
            return res.status(404).json({ error: "Message not found" });
        }
        logger.info(`Message updated for user ${clerkUserId} and message ID ${messageId}`);
        return res.status(200).json(toMessageDTO(updatedMessage));
    } catch (error) {
        logger.error(`Error updating message for user ${clerkUserId} and message ID ${messageId}`, error);
        if (error instanceof Error && error.message === "No valid fields provided to update") {
            return res.status(400).json({ error: "No valid fields provided to update." });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}

// GET /messages/:id
export const getMessage = async (
    req: Request,
    res: Response<MessageResponse | { error: string }>
) => {
    const messageId = parseInt(req.params.id as string, 10);

    if (isNaN(messageId)) {
        logger.error(`Invalid message ID ${messageId}`);
        return res.status(400).json({ error: "Invalid message ID" });
    }

    const { userId: clerkUserId } = getAuth(req);

    try {
        const message = await getMessageById(prisma, messageId, clerkUserId!);
        if (!message) {
            logger.error(`Message not found for user ${clerkUserId} and message ID ${messageId}`);
            return res.status(404).json({ error: "Message not found" });
        }
        logger.info(`Message retrieved for user ${clerkUserId} and message ID ${messageId}`);
        return res.status(200).json(toMessageDTO(message));
    } catch (error) {
        logger.error(`Error retrieving message for user ${clerkUserId} and message ID ${messageId}`, error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// DELETE /messages/:id
export const deleteMessage = async (
    req: Request,
    res: Response<MessageResponse | { error: string }>
) => {

    const messageId = parseInt(req.params.id as string, 10);

    if (isNaN(messageId)) {
        logger.error(`Invalid message ID ${messageId}`);
        return res.status(400).json({ error: "Invalid message ID" });
    }

    const { userId: clerkUserId } = getAuth(req);

    try {
        const deletedMessage = await removeMessage(prisma, messageId, clerkUserId!);
        if (!deletedMessage) {
            logger.error(`Message not found for user ${clerkUserId} and message ID ${messageId}`);
            return res.status(404).json({ error: "Message not found" });
        }
        logger.info(`Message deleted for user ${clerkUserId} and message ID ${messageId}`);
        return res.status(200).json(toMessageDTO(deletedMessage));
    } catch (error: any) {
        logger.error(`Error deleting message for user ${clerkUserId} and message ID ${messageId}`, error);
        if (error.message === "Message cannot be deleted unless it is in DRAFT state") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}

// GET /messages/types
export const getMessageTypes = (
    req: Request,
    res: Response<MessageTypeResponse | { error: string; detail?: string }>
) => {
    try {
        const dto = Object.values(MessageType);
        logger.info("Email types retrieved");
        return res.status(200).json(dto);
    } catch (error) {
        logger.error("Error returning email types:", error);
        return res.status(500).json({
            error: "Internal server error",
            detail: (error as any).message,
        });
    }
};

// POST /messages
export const generateMessage = async (
    req: Request<
        {},
        {},
        GenerateMailBody
    >,
    res: Response<DraftMailResponse | { error: string }>,
    next: NextFunction
) => {
    const { userId: clerkUserId } = getAuth(req);
    let creditsDeducted = false;

    try {
        const requestWithUser: GenerateMailRequest = { ...req.body, userId: clerkUserId! };
        const profile = await deductCredits(clerkUserId!, 1);
        creditsDeducted = true;
        logger.info(`User ${clerkUserId} has ${profile.credits} credits`);

        const result = await generateAndSaveEmail(clerkUserId!, requestWithUser);

        logger.info(`User ${clerkUserId} generated email ${result.id}`);
        res.status(200).json(result);
    } catch (error: any) {
        if (creditsDeducted) {
            await addCredits(clerkUserId!, 1).catch(e => logger.error("CRITICAL: Failed to refund credit!", e));
            logger.info(`Refunded credit for user ${clerkUserId}`);
        } else {
            if (error.code === 'P2025' || error.message?.includes("Record to update not found")) {
                logger.info(`User ${clerkUserId} has no credits`);
                return res.status(429).json({ error: "Insufficient credits" });
            }
        }
        // Return 400 for bad requests (like invalid type), 500 otherwise
        const status = error.message.includes("No email strategy") ? 400 : 500;
        logger.error(`Error generating email for user ${clerkUserId}`, error);
        res.status(status).json({ error: error.message });
    }
};

// POST /messages/:id/send
export const sendMessageViaGmail = async (
    req: Request<any, {}, SendMailRequest>,
    res: Response<any | { error: any }>
) => {
    try {

        const messageId = parseInt(req.params.id, 10);

        if (!messageId) {
            logger.error(`Invalid message ID ${messageId}`);
            return res.status(400).json({ error: "Invalid message ID" });
        }

        const { userId } = getAuth(req);

        const mailData: SendMailRequest = req.body;

        const response = await mailService.sendMail(userId!, { ...mailData, messageId });
        logger.info("Response from Gmail API:", response);

        await prisma.$transaction(async (tx) => {
            await linkToExternalThread(
                tx,
                req.body.threadId,
                response.threadId,
                response.id
            );
            logger.info("Linked thread to external thread");
            await upgradeThreadStatus(tx, req.body.threadId, userId!);
            await updateMessage(tx, messageId, userId!, { status: MessageStatus.SENT });
            logger.info("Upgraded the thread status and updated message status to SENT");
        });

        return res.json({ success: true });
    } catch (error: any) {
        if (
            error.clerkError &&
            error.errors.length > 0 &&
            error.errors.some((e: any) => e.code === "oauth_missing_refresh_token")
        ) {
            logger.error(`User has no refresh token`);
            return res
                .status(422)
                .json({ error: { code: "oauth_missing_refresh_token", message: "Please re-authenticate with Google" } });
        }
        logger.error(`Send email error:`, error);
        const statusCode = error.message.includes("User not connected") ? 400 : 500;
        return res.status(statusCode).json({ error: error.message });
    }
};
