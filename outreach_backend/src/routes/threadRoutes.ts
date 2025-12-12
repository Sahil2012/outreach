import { Router } from "express";
import { getThread, getThreadMeta, previewThread } from "../controller/threadController.js";

const threadRoutes = Router();

threadRoutes.get("/preview/:threadId", previewThread);
threadRoutes.get("/meta", getThreadMeta);
threadRoutes.get("/:threadId", getThread);

export default threadRoutes;