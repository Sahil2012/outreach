import { Router } from "express";
import { getThread, getThreadMeta, previewThread, updateThread } from "../controller/threadController.js";

import { schemaValidator } from "../middlleware/schemaValidator.js";
import { UpdateThreadSchema } from "../schema/threadSchema.js";

const threadRoutes = Router();

threadRoutes.get("/preview/:threadId", previewThread);
threadRoutes.get("/meta", getThreadMeta);
threadRoutes.get("/:threadId", getThread);
threadRoutes.patch("/:threadId", schemaValidator(UpdateThreadSchema), updateThread);

export default threadRoutes;