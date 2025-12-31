import { clerkClient } from "@clerk/express";
import { google } from "googleapis";
import { log } from "console";
import nodemailer from "nodemailer";
import { SendMailDto } from "../dto/request/SendMailDto.js";
import prisma from "../apis/prismaClient.js";
import { getThreadById } from "./threadService.js";
import { supabase } from "../apis/supabaseClient.js";

export class MailService {
  async sendMail(userId: string, mailData: SendMailDto) {
    const { threadId, messageId, attachResume } = mailData;

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

    // 2. Fetch Resume if requested
    let attachments: any[] = [];
    if (attachResume) {
      await this.getResume(userId, attachments);
    }

    // 3. Authenticate & Setup
    const accessToken = await this.getGoogleAccessToken(userId);
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    // 4. Get User Info (From address)
    const fromEmail = await this.getGmailAddress(auth);

    // 5. Construct MIME Message using Nodemailer
    const rawMessage = await this.generateRawMimeMessage({
      from: fromEmail,
      to,
      subject,
      html: text.replace(/\n/g, "<br>"), // Preserve formatting
      attachments
    });

    // 6. Send
    return this.sendViaGmail(auth, rawMessage);
  }

  private async getResume(userId: string, attachments: any[]) {
    const userProfile = await prisma.userProfileData.findUnique({
      where: { authUserId: userId },
      select: { resumeUrl: true },
    });

    if (userProfile?.resumeUrl) {
      try {
        const { data, error } = await supabase.storage
          .from("resumes")
          .download(userProfile.resumeUrl);

        if (error) throw error;

        const buffer = Buffer.from(await data.arrayBuffer());
        attachments.push({
          filename: "Resume.pdf",
          content: buffer,
        });
        log("Resume attached successfully");
      } catch (error) {
        log("Failed to download resume:", error);
      }
    } else {
      log("Attach resume requested but no resume URL found for user");
    }
  }

  private async generateRawMimeMessage(mailOptions: any): Promise<string> {
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });

    const info = await transporter.sendMail(mailOptions);
    // info.message is the Buffer of the raw message
    return info.message.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
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
