import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "../types/chat";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
  },
});

export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(
      messages[messages.length - 1].content
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
