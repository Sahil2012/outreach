import { Router } from "express";
import { getMe } from "../controller/authController.js";
import { requireAuth } from "../middlleware/requireAuth.js";
import { ensureProfileCreated } from "../middlleware/ensureProfileCreated.js";

const authRoutes = Router();

authRoutes.post("/me", requireAuth, ensureProfileCreated, getMe);

export default authRoutes;
