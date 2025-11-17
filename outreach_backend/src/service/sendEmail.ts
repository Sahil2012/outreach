import { oauth2_v2 } from "googleapis";
import { google } from "googleapis";

const gmail = google.gmail("v1");

interface EmailDetails {
  to: string;
  subject: string;
  text: string;
  attachment?: {
    filename: string;
    path: string;
  };
}

export const sendEmail = async (
  user: oauth2_v2.Schema$Userinfo,
  emailDetails: EmailDetails
) => {
  // You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  // const subject = "🤘 Hello 🤘";
  // const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const { to, subject, text, attachment } = emailDetails;

  const messageParts = [
    `From: ${user.name} <${user.email}>`,
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    `${text}`,
  ];
  const message = messageParts.join("\n");

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log(res.data);
  return res.data;
};
