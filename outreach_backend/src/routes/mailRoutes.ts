import { Router } from "express";
import { sendMailUsingClerkToken } from "../controller/mailController.js";

const mailRoutes = Router();

mailRoutes.post("/send", sendMailUsingClerkToken);

export default mailRoutes;
