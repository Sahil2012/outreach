import pdf from "pdf-parse";
import { configDotenv } from "dotenv";
import { PromptTemplate } from "@langchain/core/prompts";
import { userDetailsSchema } from "../schema/schema.js";
import callLLM from "../apis/geminichat.js";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { log } from "console";

configDotenv();

async function extractDataFromResume(buffer: Buffer) {
  //load the file
  const data = await pdf(buffer);

  const parser = StructuredOutputParser.fromZodSchema(userDetailsSchema);

  const extractPrompt = PromptTemplate.fromTemplate(`
    You are an AI resume parser that converts resume text into structured candidate information 
    for automated user profile creation in a recruitment platform.

    Analyze the resume and extract only the information that is explicitly stated or strongly implied. 
    Do not guess or fabricate missing details. Use concise strings and standardized formatting.

    You must extract:
    - Full Name
    - Email
    - Contact Number
    - Total Work Experience and earliest job start date (if available)
    - Key Technical Skills (languages, frameworks, databases, tools)
    - Major Projects or initiatives mentioned
    - Education (degrees, universities, certifications)
    - Availability or Notice Period (default to "90 days" if not given)
    - Achievements (coding profiles, awards, recognitions, competitions)

    Return the final result in **valid JSON** that matches the schema below.

    {outputformat}

    Resume Text:
    {resumeText}
  `);
  log("Resume Text: ", data.text);
  const res = await callLLM(
    await extractPrompt.format({
      resumeText: data.text,
      outputformat: parser.getFormatInstructions(),
    })
  );

  log("Response from LLM: ", res);

  return await parser.parse(res);
}

export default extractDataFromResume;
