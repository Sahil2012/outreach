import { clerkClient } from "@clerk/express";
import { google } from "googleapis";
import { log } from "console";
import { SendMailDto } from "../dto/request/SendMailDto.js";
import prisma from "../apis/prismaClient.js";
import { getThreadById } from "./threadService.js";

export class MailService {

    async sendMail(userId: string, mailData: SendMailDto) {
        const { threadId, messageId } = mailData;

        // 1. Fetch & Validate Data
        const thread = await getThreadById(prisma, userId, threadId);
        if (!thread || !thread.Employee) {
            throw new Error("Thread not found or Employee details missing");
        }

        const message = thread.Message.find((message) => message.id === messageId);
        if (!message) {
            throw new Error("Message not found");
        }

        const to = thread.Employee.email;
        const { subject, body: text } = message;

        if (!to || !subject || !text) {
            throw new Error("Incomplete email data (missing recipient, subject, or body)");
        }

        // 2. Authenticate & Setup
        const accessToken = await this.getGoogleAccessToken(userId);
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        // 3. Get User Info
        const fromEmail = await this.getGmailAddress(auth);

        // 4. Construct & Send
        const encodedMessage = this.createMimeMessage(to, fromEmail, subject, text);
        return this.sendViaGmail(auth, encodedMessage);
    }

    private async getGoogleAccessToken(userId: string): Promise<string> {
        const tokens = await clerkClient.users.getUserOauthAccessToken(userId, "google");
        log("Tokens from Clerk:", JSON.stringify(tokens));

        if (!tokens || tokens.data.length === 0) {
            throw new Error("User not connected with Google");
        }
        return tokens.data[0].token;
    }

    private async getGmailAddress(auth: any): Promise<string> {
        const oauth2Client = google.oauth2({ version: "v2", auth });
        const { data: userInfo } = await oauth2Client.userinfo.get();
        const email = userInfo.email;
        log("User Email:", email);

        if (!email) {
            throw new Error("Could not retrieve user email from Google");
        }
        return email;
    }

    private createMimeMessage(to: string, from: string, subject: string, text: string): string {
        const rawMessage = [
            `From: ${from}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=utf-8",
            "",
            text
        ].join("\n");

        return Buffer.from(rawMessage)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    private async sendViaGmail(auth: any, encodedMessage: string): Promise<any> {
        const gmail = google.gmail({ version: "v1", auth });
        try {
            const response = await gmail.users.messages.send({
                userId: "me",
                requestBody: { raw: encodedMessage }
            });
            return response.data;
        } catch (error: any) {
            log("Gmail API Error:", error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

export const mailService = new MailService();
