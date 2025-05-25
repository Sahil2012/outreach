import { PromptTemplate } from "@langchain/core/prompts";
import callLLM from "./geminichat.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { emailSchema } from "../schema/schema.js";
import { StructuredOutputParser } from "langchain/output_parsers";

async function generateEmail(userDetails) {
  const referralPrompt = PromptTemplate.fromTemplate(
    `
        You are an expert writing a email asking for refferal.

        Candidate Information:
        - Name: {name}
        - Skills: {skills}
        - Experience: {experience}
        {noticePeriod}
        {achievements}

        Job Information:
        - Job ID: {jobId}
        - HR Name: {hrName}
        - Company: {companyName}

        Generate:
            1. A professional subject line.
            2. A short, polite email addressed to the HR requesting a referral.
            Ensure the tone is confident but respectful, and avoid redundancy if any fields are empty and write in terms of pointer so that it is an easy read.

        The format should be:
        {emailSchema}
        `
  );

    const parser = StructuredOutputParser.fromZodSchema(emailSchema);
    

    const res = await callLLM(await referralPrompt.format({
        ...userDetails,
        emailSchema : parser.getFormatInstructions(),
    }));

    return await parser.parse(res);

}

export default generateEmail;