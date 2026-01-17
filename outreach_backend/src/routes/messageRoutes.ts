import { Router } from "express";
import { deleteMessage, editMessage, getMessage } from "../controller/messageController.js";
import { generateNewMailTrail, sendMailUsingClerkToken } from "../controller/mailController.js";
import { getEmailTypes } from "../controller/emailController.js";

import { schemaValidator } from "../middlleware/schemaValidator.js";
import { EditMessageSchema } from "../schema/messageSchema.js";
import { GenerateMailSchema, SendMailSchema } from "../schema/mailSchema.js";

const messageRoutes = Router();

// NOTE: This is an LLM call also ambigious if we should have this here or not
messageRoutes.post("/", schemaValidator(GenerateMailSchema), generateNewMailTrail);
messageRoutes.get("/types", getEmailTypes);

// NOTE: This just sends the mail to the user via gmail and updates the status of the message to sent
messageRoutes.post("/:id/send", schemaValidator(SendMailSchema), sendMailUsingClerkToken);

messageRoutes.patch("/:id", schemaValidator(EditMessageSchema), editMessage);
messageRoutes.get("/:id", getMessage);
messageRoutes.delete("/:id", deleteMessage);

export default messageRoutes;