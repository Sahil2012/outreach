import { PromptTemplate } from "@langchain/core/prompts";
import prisma from "../../../apis/prismaClient.js";
import { ThankYouEmailRequest } from "../../../types/GenerateMailRequest.js";
import { getThreadById } from "../../threadService.js";
import { thankyouPromptTemplate } from "../../../utils/prompts/thankYouPromptTemplate.js";
import { error, log } from "console";
import callLLM from "../../../apis/geminichat.js";
import { StructuredOutputParser } from "langchain/output_parsers";
import { emailSchema } from "../../../schema/schema.js";

export const thankyouEmailStrategy = async (emailRequest: ThankYouEmailRequest) => {

    // Get thread by id and extract the last message
    const thread = await getThreadById(prisma, emailRequest.userId, emailRequest.threadId);

    if (!thread) {
        error("Thread not found");
        throw new Error("Thread not found");
    }
    const lastMessage = thread?.Message.at(-1);
    if (!lastMessage) {
        error("Last message not found");
        throw new Error("Last message not found");
    }

    log("Initiating thankyou email strategy for thread", emailRequest.threadId);

    // prepare the prompt template
    const promptTemplate = PromptTemplate.fromTemplate(thankyouPromptTemplate);

    const outputFormat = StructuredOutputParser.fromZodSchema(emailSchema);

    // generate the email
    const email = await callLLM(
        await promptTemplate.format({
            previousMessage: lastMessage.body,
            emailSchema: outputFormat.getFormatInstructions(),
        })
    );

    log("RAW email", email);

    return outputFormat.parse(email);
}