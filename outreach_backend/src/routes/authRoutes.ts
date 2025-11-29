import { Router } from "express";
import { getMe } from "../controller/authController.js";
import { requireAuth } from "@clerk/express";
import { ensureAppUser } from "../middlleware/ensureAppUser.js";

const authRoutes = Router();

authRoutes.post("/me", requireAuth(), ensureAppUser, getMe);

export default authRoutes;
