import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Message, ChatSession } from "../types/chat";
import { saveChatSession, getChatSession } from "../utils/storage";
import { sendMessage } from "../services/chat";

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface ChatProps {
  sessionId: string;
}

export const Chat = ({ sessionId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  useEffect(() => {
    const session = getChatSession(sessionId);
    if (session) {
      setMessages(session.messages);
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data: MessageFormData) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: data.content,
      role: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    reset();
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, userMessage]);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        role: "assistant",
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      const session: ChatSession = {
        id: sessionId,
        messages: updatedMessages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveChatSession(session);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          type="text"
          {...register("content")}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
      {errors.content && (
        <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
      )}
    </div>
  );
};
