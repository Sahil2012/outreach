import { Router } from "express";
import { authWebhook, getMe } from "../controller/authController.js";
import { requireAuth } from "@clerk/express";

const authRoutes = Router();

authRoutes.post("/me", requireAuth(), getMe);
authRoutes.post("/webhook", requireAuth(), authWebhook);

export default authRoutes;
