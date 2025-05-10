import { useState, useEffect } from "react";
import type { Message, ChatSession } from "../types/chat";
import { saveChatSession, getChatSession } from "../utils/storage";
import { streamMessage } from "../services/chat";
import { MessageForm } from "./MessageForm";
import { MessageThread } from "./MessageThread";

interface ChatProps {
  sessionId: string;
}

export const Chat = ({ sessionId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  useEffect(() => {
    const session = getChatSession(sessionId);
    if (session) {
      setMessages(session.messages);
    }
  }, [sessionId]);

  const onSubmit = async (data: { content: string }) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: data.content,
      role: "user",
      timestamp: Date.now(),
    };

    setIsLoading(true);
    setStreamingContent("");

    try {
      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);

      // Create a temporary assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: "",
        role: "assistant",
        timestamp: Date.now(),
      };

      // Add the empty assistant message
      setMessages((prev) => [...prev, assistantMessage]);

      // Stream the response
      let fullResponse = "";
      for await (const chunk of streamMessage([...messages, userMessage])) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      // Update the assistant message with the full response
      const updatedAssistantMessage = {
        ...assistantMessage,
        content: fullResponse,
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? updatedAssistantMessage : msg
        )
      );

      // Save the session
      const session: ChatSession = {
        id: sessionId,
        messages: [...messages, userMessage, updatedAssistantMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveChatSession(session);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  return (
    <div className="h-full flex flex-col w-full mx-auto bg-gray-50">
      <MessageThread messages={messages} streamingContent={streamingContent} />
      <MessageForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};
