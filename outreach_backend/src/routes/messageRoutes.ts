import { Router } from "express";
import { deleteMessage, editMessage, getMessage } from "../controller/messageController.js";

const messageRoutes = Router();

messageRoutes.patch("/edit/:messageId", editMessage);
messageRoutes.get("/:messageId", getMessage);
messageRoutes.delete("/:messageId", deleteMessage);

export default messageRoutes;