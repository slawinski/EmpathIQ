import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import type { Message, ChatSession } from "../types/chat";
import { saveChatSession, getChatSession } from "../utils/storage";
import { streamMessage } from "../services/chat";

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
  const [streamingContent, setStreamingContent] = useState("");
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
  }, [messages, streamingContent]);

  const onSubmit = async (data: MessageFormData) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: data.content,
      role: "user",
      timestamp: Date.now(),
    };

    setIsLoading(true);
    setStreamingContent("");
    reset();

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
    <div className="h-full flex flex-col max-w-full mx-auto bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] min-w-[200px] p-4 rounded-2xl text-left text-base font-medium shadow-sm ${
                message.role === "user"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-white text-gray-700 border border-gray-100"
              }`}
            >
              {message.role === "assistant" &&
              message.id === messages[messages.length - 1]?.id ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>
                    {streamingContent || message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 border-t border-gray-100 bg-white shadow-sm flex gap-3"
      >
        <input
          type="text"
          {...register("content")}
          className="flex-1 p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base font-medium transition-all"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-400 rounded-xl cursor-pointer disabled:opacity-50 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md font-medium flex items-center justify-center min-w-[120px]"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
      {errors.content && (
        <p className="text-red-500 text-sm mx-6 my-2">
          {errors.content.message}
        </p>
      )}
    </div>
  );
};
