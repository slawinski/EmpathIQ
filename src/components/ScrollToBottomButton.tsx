import type { FC } from "react";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  className?: string;
}

export const ScrollToBottomButton: FC<ScrollToBottomButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-24 pointer-events-none opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
      <button
        onClick={onClick}
        className={`absolute left-1/2 -translate-x-1/2 bottom-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 pointer-events-auto flex items-center gap-2 ${className}`}
        aria-label="Scroll to bottom"
      >
        <span className="text-sm font-medium">Scroll to bottom</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </div>
  );
};
