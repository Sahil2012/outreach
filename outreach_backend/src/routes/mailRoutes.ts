import { Router } from "express";
import { generateNewMailTrail, sendMailUsingClerkToken } from "../controller/mailController.js";

import { schemaValidator } from "../middlleware/schemaValidator.js";
import { GenerateMailSchema, SendMailSchema } from "../schema/mailSchema.js";

const mailRoutes = Router();

mailRoutes.post("/send", schemaValidator(SendMailSchema), sendMailUsingClerkToken);
mailRoutes.post("/generate", schemaValidator(GenerateMailSchema), generateNewMailTrail);

export default mailRoutes;
