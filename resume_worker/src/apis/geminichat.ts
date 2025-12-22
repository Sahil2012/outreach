import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function callLLM(prompt: string): Promise<string> {

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
        temperature: 0.9,
    });

    const res = await model.invoke(prompt);

    return res.content as string;
}

export default callLLM;