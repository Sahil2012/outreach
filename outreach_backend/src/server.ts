import { configDotenv } from "dotenv";
import express, { ErrorRequestHandler, NextFunction } from "express";
import emailSender from "./controller/emailSender.js";
import cors from 'cors';
import profileRouter from "./routes/profileRoutes.js";
import { requireAuth } from "./middlleware/requireAuth.js";
import authRoutes from "./routes/authRoutes.js";
import mailGeneratorController from "./controller/mailGeneratorController.js";

configDotenv();

const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post("/generateMail", requireAuth, mailGeneratorController);

app.post("/sendEmail", emailSender);

app.use("/auth",authRoutes);
app.use("/profile", profileRouter);

const errorHandler : ErrorRequestHandler = (err, req, res , next) => {    
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message});
}
// Global error handler
app.use(errorHandler);

app.listen(PORT, (error) => {
  if (error) {
    console.log("We ran into an error");
  } else {
    console.log(`Running on ${PORT}`);
  }
});
