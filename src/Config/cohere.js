import { CohereClientV2 } from "cohere-ai";
import { LOCALCOLLAB_CONTEXT } from "../Context/startbridgeContext.js"; 

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

const cohere = new CohereClientV2({
  token: COHERE_API_KEY,
});

export const runGeminiPrompt = async (userPrompt) => {
  try {
    const response = await cohere.chat({
      // Use the model version from the 2026 documentation
      model: "command-a-03-2025", 
      messages: [
        {
          role: "system",
          content: `${LOCALCOLLAB_CONTEXT}\nRespond as Comrade AI (LocalCollab assistant). Be clear, sharp, and founder-level. Keep it concise.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
    });

    // Access the text from the message content array
    return response.message.content[0].text || "No response";

  } catch (error) {
    console.error("Cohere API Error:", error);
    return "Error fetching AI response";
  }
};