import { configDotenv } from "dotenv";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import profileRouter from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { clerkMiddleware } from "@clerk/express"
import threadRoutes from "./routes/threadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
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

// Routers
app.use("/auth", authRoutes);
app.use("/profile", requireAuth, profileRouter);
app.use("/threads", requireAuth, threadRoutes);
app.use("/messages", requireAuth, messageRoutes);

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
