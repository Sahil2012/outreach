import { Router } from "express";
import { previewThread } from "../controller/threadController.js";

const threadRoutes = Router();

threadRoutes.get("/preview/:threadId", previewThread);

export default threadRoutes;