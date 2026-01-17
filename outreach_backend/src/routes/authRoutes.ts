import express, { Router } from "express";
import { getMe, handleClerkWebhook } from "../controller/authController.js";
import { requireAuth } from "../middlleware/requireAuth.js";
import { ensureProfileCreated } from "../middlleware/ensureProfileCreated.js";

const authRoutes = Router();

authRoutes.get("/me", requireAuth, ensureProfileCreated, getMe);
authRoutes.post(
    "/webhook/clerk",
    express.json({ type: 'application/json', verify: (req: any, res, buf) => { req.rawBody = buf.toString() } }),
    handleClerkWebhook
);

export default authRoutes;
