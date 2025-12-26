import { google } from "googleapis";
import prisma from "../apis/prismaClient.js";
import { clerkClient } from "@clerk/express";
import { log } from "console";
import { parseBase64DataUrl } from "@langchain/core/messages";
import { populateMessagesForThread } from "./messageService.js";


export class ExternalMailService {

    constructor() {

    }

    async getThreadMessage(threadId: number, clerkUserId: string) {

        const accessToken = await this.getGoogleAccessToken(clerkUserId);

        const thread = await prisma.thread.findUnique({
            where: {
                id: threadId
            }
        });
        if (!thread) {
            throw new Error("Thread not found");
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const gmail = google.gmail({
            version: "v1",
            auth: auth
        });
        const t = await gmail.users.threads.get({
            userId: "me",
            id: thread?.externalThreadId || ''
        });

        if (!t.data.messages) return [];

        const result = t.data.messages.map((message) => {
            const a = this.extractMessageBody(message.payload);
            const fromUser = message.labelIds?.includes("SENT") || false;
            return { id: message.id, threadId: message.threadId, body: a, fromUser };
        });

        return result;
    }

    private extractMessageBody(payload: any): string {
        if (!payload) return "";
        console.log("Extracting body from payload MIME type:", payload.mimeType);

        // 1. If there is body data directly (usually text/plain or text/html non-multipart)
        if (payload.body && payload.body.data) {
            console.log("Found body data directly");
            return Buffer.from(payload.body.data, 'base64').toString('utf-8');
        }

        // 2. If there are parts (multipart)
        if (payload.parts && payload.parts.length > 0) {
            console.log("Found parts:", payload.parts.length);
            // Find HTML part
            let part = payload.parts.find((p: any) => p.mimeType === 'text/html');
            // Fallback to plain text
            if (!part) {
                part = payload.parts.find((p: any) => p.mimeType === 'text/plain');
            }

            // If still no part found (maybe nested multipart/related or mixed), just take the first part?
            // Or recurse on the first part if it has parts
            if (!part) {
                // Try to find a part that has parts
                part = payload.parts.find((p: any) => p.parts && p.parts.length > 0);
            }

            if (part) {
                return this.extractMessageBody(part);
            }
        }
        return "";
    }

    private async getGoogleAccessToken(userId: string): Promise<string> {
        const tokens = await clerkClient.users.getUserOauthAccessToken(userId, "google");
        log("Tokens from Clerk:", JSON.stringify(tokens));

        if (!tokens || tokens.data.length === 0) {
            throw new Error("User not connected with Google");
        }
        return tokens.data[0].token;
    }
}

export default new ExternalMailService();