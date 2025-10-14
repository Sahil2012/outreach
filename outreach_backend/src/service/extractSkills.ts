import convertGoogleDriveUrl from "../utils/convertDriveUrl.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import downloadPDF from "./downloadPDF.js";
import { configDotenv } from "dotenv";
import { PromptTemplate } from "@langchain/core/prompts";
import callLLM from "./geminichat.js";
import { StructuredOutputParser } from "langchain/output_parsers";
import { userDetailsSchema } from "../schema/schema.js";

configDotenv();

async function extractSkils(url : string){
  let dowloadUrl = convertGoogleDriveUrl(url);

  await downloadPDF(dowloadUrl);

  //load the file
  let loader = new PDFLoader("./resume.pdf");
  let docs = await loader.load();

  // convert to text to provide it as context
  const fullResumeText = docs.map((doc) => doc.pageContent).join("\n\n");

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
      resumeText: fullResumeText,
      outputformat: parser.getFormatInstructions(),
    })
  );

  return await parser.parse(res);
}

export default extractSkils;
