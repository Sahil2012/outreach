import { Router } from "express";
import { getThread, getThreads, patchThread } from "../controller/threadController.js";

import { bodyValidator, queryValidator } from "../middlleware/schemaValidator.js";
import { ThreadMetaParamsSchema, UpdateThreadSchema } from "../schema/threadSchema.js";

const threadRoutes = Router();

threadRoutes.get("/", queryValidator(ThreadMetaParamsSchema), getThreads);
threadRoutes.get("/:id", getThread);
threadRoutes.patch("/:id", bodyValidator(UpdateThreadSchema), patchThread);

export default threadRoutes;