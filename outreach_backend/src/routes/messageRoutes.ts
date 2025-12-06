import { Router } from "express";
import { editMessage } from "../controller/messageController.js";

const messageRoutes = Router();

messageRoutes.patch("/edit/:messageId", editMessage);

export default messageRoutes;