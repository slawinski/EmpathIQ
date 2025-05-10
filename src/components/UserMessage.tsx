import ReactMarkdown from "react-markdown";
import type { Message } from "../types/chat";

interface UserMessageProps {
  message: Message;
}

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[85%] sm:max-w-[80%] min-w-[120px] sm:min-w-[200px] p-3 sm:p-4 rounded-2xl text-left text-sm sm:text-base font-normal shadow-sm bg-blue-200 text-blue-800">
        <div className="prose prose-base max-w-none dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
