import { clerkClient, getAuth } from "@clerk/express";
import { log } from "console";

export const getAccessToken = async (req: any) => {
  try {
    const {userId} = getAuth(req);
    log("User ID from Clerk:", userId);
    const refreshToken = await clerkClient.users.getUserOauthAccessToken(userId!, "google");
    log("Existing refresh token from Clerk:", refreshToken);

    // Store in DB or session as needed
    return refreshToken;
  } catch (error) {
    log("Error retrieving access token:", error);
    throw error;
  }
};
