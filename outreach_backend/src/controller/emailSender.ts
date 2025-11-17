import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import EmailRequest from "../types/EmailRequest.js";
import { getUserFromToken } from "../apis/googleOAuth2Client.js";
import { sendEmail as sendEmailService } from "../service/sendEmail.js";

configDotenv();

const sendEmail = async (
  req: Request<{}, {}, EmailRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { to, subject, text, attachment } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password instead of actual password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: attachment
        ? [{ filename: attachment.filename, path: attachment.path }]
        : undefined,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    next(err);
  }
};

export const sendEmailV2 = async (
  req: Request<{}, {}, EmailRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { to, subject, text, attachment } = req.body;
    const { token } = (req as any).token;

    const user = await getUserFromToken(token);
    const emailDetails = { to, subject, text, attachment };

    await sendEmailService(user, emailDetails);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    next(err);
  }
};

export default sendEmail;
