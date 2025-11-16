import { ReferralEmailRequest } from "../../../types/GenerateMailRequest.js";
import { getCandidateProfile } from "../../extractCandidateProfile.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { referralEmailPrompt } from "../../../utils/prompts/referralPromptTemplate.js";
import { StructuredOutputParser } from "langchain/output_parsers";
import { emailSchema } from "../../../schema/schema.js";
import callLLM from "../../../apis/geminichat.js";
import { log } from "console";

export const referralEmailStrategy = async (
  emailRequest: ReferralEmailRequest
) => {
  const userId = emailRequest.userId;
  const jobDescription = emailRequest.jobDescription;

  // extract user profile details using userId
  const profileDetails = await getCandidateProfile(userId || "");

  log("Profile Details:", profileDetails);

  const referralPrompt = PromptTemplate.fromTemplate(referralEmailPrompt);

  const parser = StructuredOutputParser.fromZodSchema(emailSchema);

  // call the llm with formatted prompt
  const res = await callLLM(
    await referralPrompt.format({
      jobDescription: jobDescription,
      jobIds: emailRequest.jobId,
      skills: profileDetails.skills,
      experience: profileDetails.experiences,
      education: profileDetails.education,
      userName: profileDetails.userName,
      contactName: emailRequest.contactName,
      emailSchema: parser.getFormatInstructions(),
    })
  );
  log("RAW LLM response:", res);
  return await parser.parse(res);
};
