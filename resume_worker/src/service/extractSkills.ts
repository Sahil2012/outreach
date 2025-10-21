import pdf from 'pdf-parse';
import { configDotenv } from "dotenv";
import { PromptTemplate } from "@langchain/core/prompts";
import { userDetailsSchema } from "../schema/schema.js";
import callLLM from "../apis/geminichat.js";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

configDotenv();

async function extractSkils(buffer : Buffer){
  //load the file
  const data = await pdf(buffer);

  const parser = StructuredOutputParser.fromZodSchema(userDetailsSchema);

  const extractPrompt = PromptTemplate.fromTemplate(`
        Extract the following information from the resume text below:
        - Full Name
        - Contact Number
        - Years of Experience
        - Technical Skills (languages, frameworks, databases, tools)
        - Education (college and degree)
        - Availability / Notice period(90 days if not given)
        - Any DSA / coding profile achievements

        The format should be :
        {outputformat}
        Resume:
        {resumeText}
  `);

  const res = await callLLM(
    await extractPrompt.format({
      resumeText: data.text,
      outputformat: parser.getFormatInstructions(),
    })
  );

  return await parser.parse(res);
}

export default extractSkils;
