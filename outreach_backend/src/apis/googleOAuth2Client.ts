import { configDotenv } from "dotenv";
import { google } from "googleapis";
import { Auth } from "googleapis";

const clientMap: Record<string, Auth.OAuth2Client> = {};

configDotenv();

const credentials = {
  web: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [process.env.REDIRECT_URI],
  },
};
// The web object contains your client ID, secret, and redirect URIs
const { client_id, client_secret, redirect_uris } = credentials.web;

// Initialize the client
const getClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  return oauth2Client;
};

export const getAuthUrl = () => {
  const oauth2Client = getClient();
  const scopes = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};

export const getUserFromToken = async (token: string) => {
  const oauth2Client = getClient();
  oauth2Client.setCredentials({ access_token: token });

  const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
  const userInfoResponse = await oauth2.userinfo.get();
  return userInfoResponse.data;
};

export const getTokens = async (code: string) => {
  try {
    const oauth2Client = getClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userInfoResponse = await oauth2.userinfo.get();
    const userProfile = userInfoResponse.data;

    if (!userProfile.id) {
      throw new Error("Failed to retrieve user ID from Google");
    }

    clientMap[userProfile.id] = oauth2Client;
    return {
      user: userProfile,
      tokens: tokens,
    };
  } catch (error: any) {
    console.error("Error exchanging code for tokens:", error.message);
  }
};
