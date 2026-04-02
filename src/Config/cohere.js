import { GoogleGenerativeAI } from "@google/generative-ai";
import { LOCALCOLLAB_CONTEXT } from "../Context/startbridgeContext.js"; 

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const runGeminiPrompt = async (userPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const contextualPrompt = `
${LOCALCOLLAB_CONTEXT}

User: ${userPrompt}

Respond as Comrade AI (LocalCollab assistant).
Be clear, sharp, and founder-level.
Keep it concise.
`;

    const result = await model.generateContent(contextualPrompt);
    return result?.response?.text() || "No response";
  } catch (error) {
    console.error(error);
    return "Error fetching AI response";
  }
};