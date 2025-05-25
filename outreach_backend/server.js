import { configDotenv } from "dotenv";
import extractSkils from "./service/extractSkills.js";
import generateEmail from "./service/generateEmail.js";
import express from "express";

configDotenv();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.post("/generateMail", async (req, res) => {
  const body = req.body;
  
  
  const userSpecificDetails = await extractSkils(body.resumeLink);
  userSpecificDetails.jobId = body.jobId;
  userSpecificDetails.hrName = body.hrName;
  userSpecificDetails.companyName = body.companyName;

  const email = await generateEmail(userSpecificDetails);

  res.send(email);
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("We ran into an error");
  } else {
    console.log(`Running on ${PORT}`);
  }
});
