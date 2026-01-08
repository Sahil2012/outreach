import { configDotenv } from "dotenv";
import express, { ErrorRequestHandler } from "express";
import emailSender from "./controller/emailSender.js";
import cors from "cors";
import profileRouter from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import mailGeneratorController from "./controller/generatorController.js";
import { clerkMiddleware } from "@clerk/express"
import { ensureProfileCreated } from "./middlleware/ensureProfileCreated.js";
import { getEmailTypes } from "./controller/emailController.js";
import threadRoutes from "./routes/threadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";
import { testController } from "./controller/test.js";
import { requireAuth } from "./middlleware/requireAuth.js";
configDotenv();

const PORT = process.env.PORT;
const app = express();

// Use Middlewares
app.use(clerkMiddleware({ debug: process.env.NODE_ENV === "development" }));
app.use(express.urlencoded({ extended: true }));

// TODO : update cors 
app.use(
  cors({

  })
);
app.use(express.json());

// Routers
app.post("/generateMail", requireAuth, ensureProfileCreated, mailGeneratorController);
app.post("/sendEmail", emailSender);
app.post("/sendEmailV2", requireAuth, ensureProfileCreated, emailSender);
app.use("/auth", authRoutes);
app.use("/profile", requireAuth, profileRouter);
app.get("/email/type", getEmailTypes);
app.use("/thread", requireAuth, threadRoutes);
app.use("/message", requireAuth, messageRoutes);
app.use("/stats", requireAuth, statsRoutes);
app.use("/mail", requireAuth, mailRoutes);
app.post("/test", requireAuth, testController);

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
