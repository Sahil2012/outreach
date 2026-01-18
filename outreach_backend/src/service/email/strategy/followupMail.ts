import { PromptTemplate } from "@langchain/core/prompts";
import { FollowupEmailRequest } from "../../../types/GenerateMailRequest.js";
import { followUpPromptTemplate } from "../../../utils/prompts/followUpPromptTemplate.js";
import { log } from "console";
import { getThreadById } from "../../threadService.js";
import prisma from "../../../apis/prismaClient.js";
import { StructuredOutputParser } from "langchain/output_parsers";
import { emailSchema } from "../../../schema/schema.js";
import callLLM from "../../../apis/geminichat.js";

export const followupEmailStrategy = async (followupRequest: FollowupEmailRequest) => {
    log("Generating followup email for threadId: ", followupRequest.threadId);

    if (!followupRequest.threadId || !followupRequest.userId) {
        throw new Error("Missing threadId or userId in followup request");
    }

    try {
        log("Fetching messages for threadId: ", followupRequest.threadId);
        const thread = await getThreadById(prisma, followupRequest.userId, followupRequest.threadId);

        if (!thread) {
            throw new Error(`Thread not found for id: ${followupRequest.threadId}`);
        }

        log("Fetched thread with messages count: ", thread.messages.length);

        const prompt = PromptTemplate.fromTemplate(followUpPromptTemplate);
        const outputParser = StructuredOutputParser.fromZodSchema(emailSchema);

        const followUpEmail = await callLLM(
            await prompt.format({
                email_thread: JSON.stringify(thread.messages.map(m => ({
                    sender: m.authUserId === followupRequest.userId ? "Me" : "Contact",
                    body: m.body,
                    subject: m.subject
                }))),
                user_name: "Sahil Gupta", // TODO: Fetch from user profile
                contact_name: thread.employee?.name || 'Recruiter',
                follow_up_reason: 'Checking on update',
                emailSchema: outputParser.getFormatInstructions()
            })
        );

        log("AI response received for followup email");
        return outputParser.parse(followUpEmail);
    } catch (error) {
        log("Error generating followup email:", error);
        throw error;
    }
}