import { configDotenv } from "dotenv";
import express from "express";
import emailSender from "./controller/emailSender.js";
import generateMail from "./controller/generateMail.js";
import cors from 'cors';

configDotenv();

const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());


app.post("/generateMail", generateMail);

app.post("/sendEmail", emailSender);


// Global error handler
app.use((err, req, res, next) => {    
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message});
});


app.listen(PORT, (error) => {
  if (error) {
    console.log("We ran into an error");
  } else {
    console.log(`Running on ${PORT}`);
  }
});
