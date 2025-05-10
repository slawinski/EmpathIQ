import { useRef, useEffect, useState } from "react";
import type { Message } from "../types/chat";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { ScrollToBottomButton } from "./ScrollToBottomButton";

interface MessageThreadProps {
  messages: Message[];
  streamingContent: string;
}

export const MessageThread = ({
  messages,
  streamingContent,
}: MessageThreadProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [debouncedShowScrollButton, setDebouncedShowScrollButton] =
    useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Debounce the scroll button visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedShowScrollButton(showScrollButton);
    }, 200); // 500ms delay

    return () => clearTimeout(timer);
  }, [showScrollButton]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Show button if we're scrolled up more than 100px from bottom
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex-1 h-full">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto px-4 sm:px-6 lg:px-24 xl:px-48 2xl:px-64 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 pb-24"
      >
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
      {debouncedShowScrollButton && (
        <ScrollToBottomButton onClick={scrollToBottom} />
      )}
    </div>
  );
};
