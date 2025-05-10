import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface MessageFormProps {
  onSubmit: (data: MessageFormData) => Promise<void>;
  isLoading: boolean;
}

export const MessageForm = ({ onSubmit, isLoading }: MessageFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const handleFormSubmit = async (data: MessageFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="relative p-4 sm:p-6 border-t border-gray-100 bg-white shadow-sm flex gap-2 sm:gap-3"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          {...register("content")}
          className={`w-full p-3 sm:p-4 rounded-xl border ${
            errors.content ? "border-red-500" : "border-gray-200"
          } outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm sm:text-base font-normal transition-all`}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        {errors.content && (
          <div className="absolute left-0 top-full mt-1 flex items-center gap-2 text-red-700 text-sm">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errors.content.message}</span>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 border-2 border-blue-400 rounded-xl cursor-pointer disabled:opacity-50 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md font-normal flex items-center justify-center min-w-[80px] sm:min-w-[120px] text-sm sm:text-base"
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};
