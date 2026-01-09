import { google } from "googleapis";
import { log } from "console";
import nodemailer from "nodemailer";
import { SendMailDto } from "../dto/request/SendMailDto.js";
import prisma from "../apis/prismaClient.js";
import { getThreadById } from "./threadService.js";

import { storageService } from "./storageService.js";
import { Readable } from "stream";
import { getGoogleAccessToken } from "../apis/googleOAuth2Client.js";

export class MailService {
  async sendMail(userId: string, mailData: SendMailDto) {
    const { threadId, messageId, attachResume } = mailData;

    // 1. Fetch & Validate Data
    const thread = await prisma.thread.findUnique({
      where: { id: threadId, authUserId: userId },
      include: {
        Message: {
          where: { id: messageId },
        },
        Employee: true,
      },
    });

    if (!thread || !thread.Employee) {
      throw new Error("Thread not found or Employee details missing");
    }

    const message = thread.Message[0];
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
      await this.getResumeStream(userId, attachments);
    }

    // 3. Get User Info (From address)
    const fromEmail = (await prisma.userProfileData.findUnique({
      where: { authUserId: userId },
      select: { email: true },
    }))?.email;

    if (!fromEmail) {
      throw new Error("User email not found");
    }

    // 4. Construct MIME Stream using Nodemailer
    const mimeStream = await this.getMimeStream({
      from: fromEmail,
      to,
      subject,
      html: text.replace(/\n/g, "<br>"), // Preserve formatting
      attachments
    });

    // 5. Send via Gmail Media Upload
    return this.sendViaGmail(userId, mimeStream);
  }

  private async getResumeStream(userId: string, attachments: any[]) {
    const userProfile = await prisma.userProfileData.findUnique({
      where: { authUserId: userId },
      select: { resumeUrl: true },
    });

    if (userProfile?.resumeUrl) {
      try {
        const stream = await storageService.getFileStream(userProfile.resumeUrl);
        attachments.push({
          filename: "Resume.pdf",
          content: stream,
        });
        log("Resume attachment stream prepared successfully");
      } catch (error) {
        log("Failed to prepare resume stream:", error);
      }
    } else {
      log("Attach resume requested but no resume URL found for user");
    }
  }

  private async getMimeStream(mailOptions: any): Promise<Readable> {
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: false // Disable buffering
    });

    const info = await transporter.sendMail(mailOptions);
    return info.message as Readable;
  }

  private async sendViaGmail(userId: string, mimeStream: Readable): Promise<any> {

    const accessToken = await getGoogleAccessToken(userId);
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });
    try {
      const response = await gmail.users.messages.send({
        userId: "me",
        media: {
          mimeType: 'message/rfc822',
          body: mimeStream
        }
      });
      return response.data;
    } catch (error: any) {
      log("Gmail API Error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

export const mailService = new MailService();
