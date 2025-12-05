import { configDotenv } from "dotenv";
import express, { ErrorRequestHandler, NextFunction } from "express";
import emailSender from "./controller/emailSender.js";
import cors from "cors";
import profileRouter from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import mailGeneratorController from "./controller/mailGeneratorController.js";
import { clerkMiddleware, requireAuth } from "@clerk/express"
import { ensureAppUser } from "./middlleware/ensureAppUser.js";
import { getEmailTypes } from "./controller/emailController.js";
configDotenv();

const PORT = process.env.PORT;
const app = express();

// Use Middlewares
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "", "http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Routers
app.post("/generateMail", requireAuth(), ensureAppUser, mailGeneratorController);
app.post("/sendEmail", emailSender);
app.post("/sendEmailV2", requireAuth(), ensureAppUser, emailSender);
app.use("/auth", authRoutes);
app.use("/profile", profileRouter);
app.get("/email/type", getEmailTypes);

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
