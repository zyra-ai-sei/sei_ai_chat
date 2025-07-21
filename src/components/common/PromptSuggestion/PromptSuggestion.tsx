import React from 'react';
import ChatIcon from '@/assets/common/icon.svg?react'
const suggestions = [
  "What is the chainId of Sei blockchain?",
  "Show me the balance of 0x...",
  "Fetch info for tx hash: 0x1d14b3d41156d640de2d6e167f6b6cc95db3ae354cb51879dc26d91d7b5c2295",
  "How do I bridge assets to Sei?",
  "List the latest blocks on Sei network.",
  "What tokens are held by 0x... on Sei?",
  "Show me recent transactions for my wallet.",
  "What is the current gas price on Sei?"
];

const PromptSuggestion = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-xl gap-4 p-6 mx-auto mt-10 border shadow-lg rounded-3xl bg-white/10 backdrop-blur-xl border-white/20 animate-fade-in">
      <div className="flex flex-col items-center gap-1">
        <div className='w-[60px] h-[60px] rounded-full bg-[#1E293B] flex items-center justify-center'>
        <ChatIcon className='w-[28px] h-[28px] '/>
        </div>
        <span className="flex items-center gap-2 text-3xl font-bold text-white">
          👋 Welcome to Sei AI Chat
        </span>
        <span className="max-w-md text-base text-center text-white/70">
          Ask anything about the Sei blockchain, wallets, tokens, or transactions. Try one of these prompts to get started:
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="px-4 py-2 text-sm font-medium transition-all duration-150 border rounded-full shadow-sm cursor-pointer bg-gradient-to-r from-white/10 to-white/5 text-white/90 border-white/20 hover:bg-white/20"
          >
            💡 {suggestion}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        <div className="max-w-xs px-3 py-2 text-xs text-center text-yellow-300 border bg-yellow-900/30 rounded-xl border-yellow-400/20">
          ⚠️ For your privacy, do not share sensitive information. Responses are for informational purposes only and not financial advice.
        </div>
      </div>
    </div>
  );
};

export default PromptSuggestion;