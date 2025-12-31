import { Router } from "express";
import { getThread, getThreadMeta, previewThread, updateThread } from "../controller/threadController.js";

const threadRoutes = Router();

threadRoutes.get("/preview/:threadId", previewThread);
threadRoutes.get("/meta", getThreadMeta);
threadRoutes.get("/:threadId", getThread);
threadRoutes.patch("/:threadId", updateThread);

export default threadRoutes;