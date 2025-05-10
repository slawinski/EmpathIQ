import ReactMarkdown from "react-markdown";
import type { Message } from "../types/chat";

interface AssistantMessageProps {
  message: Message;
  isLastMessage: boolean;
  streamingContent: string;
}

export const AssistantMessage = ({
  message,
  isLastMessage,
  streamingContent,
}: AssistantMessageProps) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[85%] sm:max-w-[80%] min-w-[120px] sm:min-w-[200px] p-3 sm:p-4 rounded-2xl text-left text-sm sm:text-base font-normal shadow-sm bg-white text-gray-700 border border-gray-100">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>
            {isLastMessage
              ? streamingContent || message.content
              : message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
