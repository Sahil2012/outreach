import { Request, Response } from "express";
import { getAuthUrl, getTokens } from "../../apis/googleOAuth2Client.js";

export const sendAuthUrl = (req: Request, res: Response) => {
  try {
    const authUrl = getAuthUrl();
    res.send({ url: authUrl });
  } catch (error) {
    res.status(500).send({ error: "Failed to generate auth URL" });
  }
};

export const getAccessToken = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send({ error: "Authorization code is required" });
    }

    const tokens = await getTokens(code);

    // Store in DB or session as needed
    res.send({
      user: tokens?.user,
      tokens: { accessToken: tokens?.tokens.access_token },
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to generate auth URL" });
  }
};
