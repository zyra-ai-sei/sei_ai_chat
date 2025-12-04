import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { streamChatPrompt } from "@/redux/chatData/action";
import { Token } from "@/redux/tokenData/reducer";
import React, { useState } from "react";

// --- 1. Reusable UI Helpers (Inputs/Selects) ---
const Input = ({ placeholder, value, onChange, type = "text" }: any) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2 text-xs text-white placeholder-gray-500 border rounded-md bg-black/40 border-white/10 focus:outline-none focus:border-purple-500"
  />
);

const Select = ({ value, onChange, options }: any) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-2 py-2 text-xs text-white border rounded-md appearance-none cursor-pointer bg-black/40 border-white/10 focus:outline-none focus:border-purple-500"
  >
    {options.map((opt: string) => (
      <option key={opt} value={opt} className="text-white bg-gray-900">
        {opt}
      </option>
    ))}
  </select>
);

// --- 2. Specific Form Components ---

const TransferForm = ({
  onCommit,
  tokens,
}: {
  onCommit: (s: string) => void;
  tokens: Token[];
}) => {
  const [toAddr, setToAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");

  const handleSubmit = () => {
    if (!toAddr || !amount) return;
    onCommit(`transfer ${amount} ${token} to ${toAddr}`);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <Input placeholder="0x... Address" value={toAddr} onChange={setToAddr} />
      <div className="flex gap-2">
        <div className="w-2/3">
          <Input
            type="number"
            placeholder="Value"
            value={amount}
            onChange={setAmount}
          />
        </div>
        <div className="w-1/3">
          <Select
            options={tokens.map((token) => token.symbol)}
            value={token}
            onChange={setToken}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-1 w-full py-1.5 rounded text-xs font-semibold  bg-purple-600 hover:bg-purple-500 text-white transition-colors"
      >
        Send Funds
      </button>
    </div>
  );
};

const SwapForm = ({
  onCommit,
  tokens,
}: {
  onCommit: (s: string) => void;
  tokens: Token[];
}) => {
  const [src, setSrc] = useState("");
  const [dst, setDst] = useState("");
  const [val, setVal] = useState("");
  const [time, setTime] = useState("10m");

  const handleSubmit = () => {
    if (!val) return;
    onCommit(`swap ${val} ${src} with ${dst} with time duration ${time}`);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-2">
        <Select
          options={tokens.map((token) => token.symbol)}
          value={src}
          onChange={setSrc}
        />
        <span className="text-xs text-gray-400">to</span>
        <Select
          options={tokens.map((token) => token.symbol)}
          value={dst}
          onChange={setDst}
        />
      </div>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Amount"
          value={val}
          onChange={setVal}
        />
        <Select options={["5m", "10m", "1h"]} value={time} onChange={setTime} />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-1 w-full py-1.5  bg-purple-600 hover:bg-purple-500 rounded text-xs font-semibold text-white transition-colors"
      >
        Execute Swap
      </button>
    </div>
  );
};

const MarketForm = ({ onCommit }: { onCommit: (s: string) => void }) => {
  const tokens = ["BTC", "ETH", "USDT", "USDC"];

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {tokens.map((t) => (
        <button
          key={t}
          onClick={() => onCommit(`I want detailed market analysis of ${t}`)}
          className="px-3 py-2 text-xs font-medium text-gray-300 transition-all border rounded border-white/20 hover:bg-green-500/20 hover:border-green-500 hover:text-green-400"
        >
          {t}
        </button>
      ))}
    </div>
  );
};

// --- 3. The Main Card Component ---

const ActionCard = ({ title, desc, icon, type, onAction, tokens }: any) => {
  // We use CSS group-hover for the visibility toggle, but we keep the logical structure here
  return (
    <div className="group relative h-48 w-full rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-purple-500/50 overflow-hidden">
      {/* State 1: Default View (Visible by default, hidden on hover) */}
      <div className="absolute inset-0 flex flex-col items-start p-6 transition-opacity duration-300 opacity-100 pointer-events-none group-hover:opacity-0 group-hover:pointer-events-none">
        <div className="p-3 mb-4 text-white rounded-lg bg-black/20">{icon}</div>
        <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
      </div>

      {/* State 2: Hover View (Hidden by default, visible on hover) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 transition-opacity duration-300 opacity-0 bg-black/80 backdrop-blur-sm group-hover:opacity-100">
        <h4 className="mb-3 text-sm font-bold tracking-wider text-white uppercase">
          {title}
        </h4>

        {type === "transfer" && (
          <TransferForm onCommit={onAction} tokens={tokens} />
        )}
        {type === "swap" && <SwapForm onCommit={onAction} tokens={tokens} />}
        {type === "market" && <MarketForm onCommit={onAction} />}

        {/* Fallback for Bridge or others without special forms */}
        {type === "simple" && (
          <button
            onClick={() => onAction(title)}
            className="px-4 py-2 text-sm text-white rounded-md bg-white/10 hover:bg-white/20"
          >
            Click to Initialize
          </button>
        )}
      </div>
    </div>
  );
};

// --- 4. Main Grid Component ---

const QuickActionsGrid = () => {
  const dispatch = useAppDispatch();
  const tokenList = useAppSelector((state) => state.tokenData.list);

  const handleAction = (resultString: string) => {
    console.log(`OUTPUT FOR LLM: ${resultString}`);
    // TODO: Connect this to your chat input state
    // setInput(resultString);
    dispatch(streamChatPrompt({ prompt: resultString }));
  };

  const actions = [
    {
      type: "swap",
      title: "Swap Tokens",
      desc: "Exchange assets across chains effortlessly.",
      icon: (
        <svg
          className="w-6 h-6 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      type: "simple", // Keeping Bridge simple for now as requested
      title: "Bridge Assets",
      desc: "Move funds between Ethereum and Sei.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      type: "market",
      title: "Market Analysis",
      desc: "View charts, volume, and RSI indicators.",
      icon: (
        <svg
          className="w-6 h-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
    },
    {
      type: "transfer",
      title: "Transfer Funds",
      desc: "Send crypto securely to another wallet.",
      icon: (
        <svg
          className="w-6 h-6 text-pink-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          Welcome to Zyra
        </h2>
        <p className="text-gray-400">
          Select an action or describe your intent in the chat.
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            {...action}
            onAction={handleAction}
            tokens={tokenList}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
