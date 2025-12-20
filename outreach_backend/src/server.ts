import { configDotenv } from "dotenv";
import express, { ErrorRequestHandler, NextFunction } from "express";
import emailSender from "./controller/emailSender.js";
import cors from "cors";
import profileRouter from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import mailGeneratorController from "./controller/generatorController.js";
import { clerkMiddleware, requireAuth } from "@clerk/express"
import { ensureProfileCreated } from "./middlleware/ensureProfileCreated.js";
import { getEmailTypes } from "./controller/emailController.js";
import { getAccessToken } from "./controller/auth/google.js";
import { sendMailUsingClerkToken } from "./controller/test.js";
import threadRoutes from "./routes/threadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
configDotenv();

const PORT = process.env.PORT;
const app = express();

// Use Middlewares
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    
  })
);
app.use(express.json());

// Routers
app.post("/generateMail", requireAuth(), ensureProfileCreated, mailGeneratorController);
app.post("/sendEmail", emailSender);
app.post("/sendEmailV2", requireAuth(), ensureProfileCreated, emailSender);
app.use("/auth", authRoutes);
app.use("/profile", profileRouter);
app.get("/email/type", getEmailTypes);
app.post("/test",requireAuth(), sendMailUsingClerkToken);
app.get("/test", getAccessToken);
app.use("/thread", requireAuth(), threadRoutes);
app.use("/message", requireAuth(),  messageRoutes);
app.use("/stats", requireAuth(), statsRoutes);

// Global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message });
};
app.use(errorHandler);

// Start the server
app.listen(PORT, (error) => {
  if (error) {
    console.log("We ran into an error");
  } else {
    console.log(`Running on ${PORT}`);
  }
});
