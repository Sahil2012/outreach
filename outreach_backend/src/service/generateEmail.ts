import { PromptTemplate } from "@langchain/core/prompts";
import callLLM from "../apis/geminichat.js";
import { emailSchema } from "../schema/schema.js";
import { StructuredOutputParser } from "langchain/output_parsers";
import { log } from "console";

async function generateEmail(userDetails : any) {
  log(userDetails)
  const referralPrompt = PromptTemplate.fromTemplate(
    `
        You are an expert writing a email asking for referral.

        Candidate Information:
        - Name: {name}
        - Skills: {skills}(Take only relevant skills and make sure don't repeat them also categories them into Tools, Languages, Framework, Framework)
        - Experience: {experiences}(Make use of experience to get the earliest start date so that we can calculate the total experience)
        {achievements}(If available you can use one of the achievement relevent to the role)

        Job Information:
        - Job ID: {jobId}
        - HR Name: {hrName}
        - Company: {companyName}
	      - Role Type : {roleType}
	      - Role Description : {roleDescription}

        Generate:
            1. A professional subject line.
            2. A short, polite email addressed to the HR requesting a referral.
            Ensure the tone is confident but respectful, and avoid redundancy if any fields are empty and write in terms of pointer so that it is an easy read. Make sure that the email is crisp and to the point. Avoid using fancy words keep it simple and more humane
	  

        The format should be:
        {emailSchema}
        `
  );

  const parser = StructuredOutputParser.fromZodSchema(emailSchema);

  const res = await callLLM(
    await referralPrompt.format({
      ...userDetails,
      emailSchema: parser.getFormatInstructions(),
    })
  );

  return await parser.parse(res);
}

export default generateEmail;
