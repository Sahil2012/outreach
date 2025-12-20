import { Router } from "express";
import { extractStats } from "../controller/statsController.js";

const statsRoutes = Router();

statsRoutes.get("/", extractStats);

export default statsRoutes;