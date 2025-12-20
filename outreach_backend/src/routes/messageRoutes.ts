import { Router } from "express";
import { editMessage, getMessage } from "../controller/messageController.js";

const messageRoutes = Router();

messageRoutes.patch("/edit/:messageId", editMessage);
messageRoutes.get("/:messageId", getMessage);

export default messageRoutes;