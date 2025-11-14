import ChatIcon from "@/assets/icon.svg?react";
const suggestions = [
  "gm, how can I help you?",
  "Send 15 SEI to 0x0000000000000000000",
  "How do I bridge assets to Sei?",
  "Place limit for for USDC",
];

const PromptSuggestion = () => {
  return (
    <div className="flex flex-col justify-center h-full gap-3 p-3">
      <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center">
        <ChatIcon className="w-full h-full" />
      </div>{" "}
      <div className="flex flex-col gap-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="self-start p-4 text-white bg-[#0F172A] rounded-tl-sm rounded-2xl w-fit max-w-[80%] text-wrap break-words whitespace-pre-line"
          >
            {suggestion}
          </div>
        ))}
      </div>
      <div className="flex gap-3 px-3 py-2 text-xs text-center border bg-yellow-900/30 rounded-xl border-yellow-400/20">
        <p>⚠️</p>
        <p className="text-left text-[#F9C016]">
          For your privacy, do not share sensitive information. Responses are
          for informational purposes only and not financial advice.
        </p>
      </div>
    </div>
  );
};

export default PromptSuggestion;
