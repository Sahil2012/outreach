import { Router } from "express";
import { getMe } from "../controller/authController.js";

const authRoutes = Router();

authRoutes.post("/me", getMe);

export default authRoutes;
