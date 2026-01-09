import { Router } from "express";
import { deleteMessage, editMessage, getMessage, markMessageAsSent } from "../controller/messageController.js";

const messageRoutes = Router();

messageRoutes.patch("/edit/:messageId", editMessage);
messageRoutes.get("/:messageId", getMessage);
messageRoutes.delete("/:messageId", deleteMessage);
messageRoutes.patch("/markAsSent/:messageId", markMessageAsSent);

export default messageRoutes;