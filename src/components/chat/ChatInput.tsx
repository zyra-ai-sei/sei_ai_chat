import { useState, useRef } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="w-full border-t border-white/10 bg-[#0D0C11] px-6 py-4">
      <div className="max-w-[800px] mx-auto flex flex-col gap-2">
        {/* Input Field */}
        <div className="flex items-end gap-3 bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your blockchain transaction..."
            disabled={disabled}
            className="flex-1 bg-transparent text-white text-sm font-['Figtree',sans-serif] placeholder-white/40 outline-none resize-none min-h-[24px] max-h-[120px] scrollbar-thin scrollbar-thumb-white/10"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              message.trim() && !disabled
                ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                : "bg-white/10 cursor-not-allowed"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 10H17M17 10L12 5M17 10L12 15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-white/30 text-xs font-['Figtree',sans-serif] text-center">
          Zyra can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
