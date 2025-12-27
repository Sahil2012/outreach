import { Router } from "express";
import { generateNewMailTrail, sendMailUsingClerkToken } from "../controller/mailController.js";

const mailRoutes = Router();

mailRoutes.post("/send", sendMailUsingClerkToken);
mailRoutes.post("/generate", generateNewMailTrail);

export default mailRoutes;
