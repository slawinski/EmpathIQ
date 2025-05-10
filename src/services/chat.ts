import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "../types/chat";
import { SYSTEM_MESSAGE } from "../constants/systemMessage";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "VITE_GEMINI_API_KEY is not set. Please check your .env file."
  );
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
  },
});

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function* streamMessage(
  messages: Message[]
): AsyncGenerator<string> {
  try {
    const chat = model.startChat({
      systemInstruction: { role: "user", parts: [{ text: SYSTEM_MESSAGE }] },
      history: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessageStream(
      messages[messages.length - 1].content
    );

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
        // Add a longer delay between chunks for a more natural reading pace
        await delay(500); // 100ms delay between chunks
      }
    }
  } catch (error) {
    console.error("Error streaming message from Gemini:", error);
    throw error;
  }
}

// Keep the original sendMessage for non-streaming use cases
export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const chat = model.startChat({
      systemInstruction: { role: "user", parts: [{ text: SYSTEM_MESSAGE }] },
      history: messages.map((msg) => ({
        role: msg.role === "user" ? "model" : "model",
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
}
