import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import externalMailService from "../service/externalMailService.js"

export const testController = async (request: Request, response: Response) => {
    try {
        const { userId: clerkUserId } = getAuth(request);
        const { threadId } = request.body;
        const result = await externalMailService.getThreadMessage(threadId, clerkUserId!);
        response.json(result);
    } catch (error: any) {
        console.error("Test controller error:", error);
        response.status(500).json({ error: error.message });
    }
};