import { Router } from "express";
import { getThread, previewThread } from "../controller/threadController.js";

const threadRoutes = Router();

threadRoutes.get("/preview/:threadId", previewThread);
threadRoutes.get("/:threadId", getThread);

export default threadRoutes;