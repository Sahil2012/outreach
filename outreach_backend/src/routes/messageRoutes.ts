import { Router } from "express";
import { deleteMessage, editMessage, generateMessage, getMessage, getMessageTypes, sendMessageViaGmail } from "../controller/messageController.js";

import { schemaValidator } from "../middlleware/schemaValidator.js";
import { GenerateMailSchema } from "../schema/mailSchema.js";
import { MessageRequestSchema, SendMailSchema } from "../schema/messageSchema.js";

const messageRoutes = Router();

// NOTE: This is an LLM call also ambigious if we should have this here or not
messageRoutes.post("/", schemaValidator(GenerateMailSchema), generateMessage);
messageRoutes.get("/types", getMessageTypes);

// NOTE: This just sends the mail to the user via gmail and updates the status of the message to sent
messageRoutes.post("/:id/send", schemaValidator(SendMailSchema), sendMessageViaGmail);

messageRoutes.patch("/:id", schemaValidator(MessageRequestSchema), editMessage);
messageRoutes.get("/:id", getMessage);
messageRoutes.delete("/:id", deleteMessage);

export default messageRoutes;