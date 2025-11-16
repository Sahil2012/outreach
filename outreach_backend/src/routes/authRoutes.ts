import { Router } from "express";
import { requireAuth } from "../middlleware/requireAuth.js";
import { authWebhook, getMe } from "../controller/authController.js";

const authRoutes = Router();

authRoutes.post("/me",requireAuth, getMe);
authRoutes.post("/webhook", requireAuth, authWebhook);

export default authRoutes;
