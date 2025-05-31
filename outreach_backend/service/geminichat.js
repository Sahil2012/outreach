import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function callLLM(prompt) {

    const model = new ChatGoogleGenerativeAI({
        model : 'gemini-2.5-flash-preview-05-20',
        apiKey : process.env.GEMINI_API_KEY,
        temperature : 0.9,
    });

    const res = await model.invoke(prompt);
    
    return res.content;
}

export default callLLM;