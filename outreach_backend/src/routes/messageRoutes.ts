import { Router } from "express";
import { deleteMessage, editMessage, getMessage, markMessageAsSent } from "../controller/messageController.js";

import { schemaValidator } from "../middlleware/schemaValidator.js";
import { EditMessageSchema, MarkMessageAsSentSchema } from "../schema/messageSchema.js";

const messageRoutes = Router();

messageRoutes.patch("/edit/:messageId", schemaValidator(EditMessageSchema), editMessage);
messageRoutes.get("/:messageId", getMessage);
messageRoutes.delete("/:messageId", deleteMessage);
messageRoutes.patch("/markAsSent/:messageId", schemaValidator(MarkMessageAsSentSchema), markMessageAsSent);

export default messageRoutes;