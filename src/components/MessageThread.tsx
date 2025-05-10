import { useRef, useEffect } from "react";
import type { Message } from "../types/chat";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";

interface MessageThreadProps {
  messages: Message[];
  streamingContent: string;
}

export const MessageThread = ({
  messages,
  streamingContent,
}: MessageThreadProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-24 xl:px-48 2xl:px-64 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AssistantMessage
            key={message.id}
            message={message}
            isLastMessage={message.id === messages[messages.length - 1]?.id}
            streamingContent={streamingContent}
          />
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
