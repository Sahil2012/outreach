import { configDotenv } from 'dotenv';
import nodemailer from 'nodemailer';

configDotenv();

const sendEmail = async (req, res, next) => {
  try {
    const { to, subject, text, attachment } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
    };

    // Only add attachment if provided
    if (attachment) {
      mailOptions.attachments = [
        {
          filename: attachment.filename,
          path: attachment.path,
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    next(err);
  }
};


export default sendEmail;