import { log } from "console";
import { ColdEmailRequest } from "../../../types/GenerateMailRequest.js";
import { getCandidateProfile } from "../../extractCandidateProfile.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { coldPromptTemplate } from "../../../utils/prompts/coldPromptTemplate.js";
import { StructuredOutputParser } from "langchain/output_parsers";
import { emailSchema } from "../../../schema/schema.js";
import callLLM from "../../../apis/geminichat.js";

export const coldEmailStrategy = async (emailRequest : ColdEmailRequest) => {

    const userId = emailRequest.userId;
    let template;

    if(!emailRequest.templateId) {
        log("No template provided for cold email strategy.");
    } else {
        log("Using provided template for cold email strategy.");
        // fetch and use the template
    }     

    const profileDetails = await getCandidateProfile(userId || "");

    const coldEmailPrompt = PromptTemplate.fromTemplate(coldPromptTemplate);
    
    const parser = StructuredOutputParser.fromZodSchema(emailSchema);

    const emailContent = await callLLM(
        await coldEmailPrompt.format({
            skills: profileDetails.skills,
            experience: profileDetails.experiences,
            education: profileDetails.education,
            template: template || "No template provided",
            emailSchema: parser.getFormatInstructions(),
        })
    );

    log("RAW LLM response:", emailContent);

    return await parser.parse(emailContent);
}