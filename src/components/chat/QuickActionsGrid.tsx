import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { streamChatPrompt } from "@/redux/chatData/action";
import { Token, selectTokensByChain } from "@/redux/tokenData/reducer";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useChainId } from "wagmi";
import { getChainById } from "@/config/chains";

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
  const [src, setSrc] = useState(tokens[0].symbol || "");
  const [dst, setDst] = useState(tokens[1].symbol || "");
  const [val, setVal] = useState("1");
  const [time, setTime] = useState("10m");

  const handleSwap = () => {
    const temp = src;
    setSrc(dst);
    setDst(temp);
  };

  const handleSubmit = () => {
    if (!val) return;
    onCommit(`swap ${val} ${src} with ${dst} with time duration ${time}`);
  };

  // Filter options to prevent selecting the same token
  const srcOptions = tokens
    .filter((token) => token.symbol !== dst)
    .map((token) => token.symbol);
  const dstOptions = tokens
    .filter((token) => token.symbol !== src)
    .map((token) => token.symbol);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-2">
        <Select options={srcOptions} value={src} onChange={setSrc} />
        <button
          onClick={handleSwap}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          aria-label="Swap tokens"
        >
          <svg
            className="w-4 h-4 text-purple-400"
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
        </button>
        <Select options={dstOptions} value={dst} onChange={setDst} />
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

const SimulateForm = ({
  onCommit,
  tokens,
}: {
  onCommit: (s: string) => void;
  tokens: Token[];
}) => {
  const [token, setToken] = useState("ETH");
  const [strategy, setStrategy] = useState("DCA");
  const [frequency, setFrequency] = useState("weekly");
  const [period, setPeriod] = useState("30");
  const [investment, setInvestment] = useState("200");

  const handleSubmit = () => {
    if (!period || !investment) return;
    onCommit(
      `Simulate a ${frequency} dollar-cost averaging (DCA) strategy for ${token} over a ${period}-day period with a total investment of $${investment}.`
    );
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Token
          </label>
          <Select
            options={tokens.map((token) => token.symbol)}
            value={token}
            onChange={setToken}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Strategy
          </label>
          <Select
            options={["DCA"]}
            value={strategy}
            onChange={setStrategy}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Frequency
          </label>
          <Select
            options={["daily", "weekly", "monthly"]}
            value={frequency}
            onChange={setFrequency}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Period (days)
          </label>
          <Input
            type="number"
            placeholder="30"
            value={period}
            onChange={setPeriod}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
          Total Investment ($)
        </label>
        <Input
          type="number"
          placeholder="200"
          value={investment}
          onChange={setInvestment}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-1 w-full py-1.5 rounded text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
      >
        Simulate Strategy
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
          className="px-3 py-2 text-xs font-medium text-gray-300 transition-all border rounded border-white/20 hover:bg-purple-500/20 hover:border-purple-500 hover:text-purple-400"
        >
          {t}
        </button>
      ))}
    </div>
  );
};

const ExecuteStrategiesForm = ({
  onCommit,
  tokens,
}: {
  onCommit: (s: string) => void;
  tokens: Token[];
}) => {
  const orderTypes = [
    "Spot Market Order",
    "Spot Limit Order",
    "TWAP Market (DCA)",
    "TWAP Limit"
  ];

  const [orderType, setOrderType] = useState(orderTypes[0]);
  const [srcToken, setSrcToken] = useState(tokens[0]?.symbol || "USDC");
  const [dstToken, setDstToken] = useState(tokens[1]?.symbol || "SEI");
  const [totalAmount, setTotalAmount] = useState("");
  const [chunkAmount, setChunkAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [fillDelay, setFillDelay] = useState("10");
  const [delayUnit, setDelayUnit] = useState("minutes");

  const handleSubmit = () => {
    if (!totalAmount) return;

    let prompt = "";

    switch (orderType) {
      case "Spot Market Order":
        prompt = `Create a spot market order to swap ${totalAmount} ${srcToken} for ${dstToken} immediately at any price. Execute the entire amount in one transaction with srcAmount=${totalAmount}, srcBidAmount=${totalAmount}, dstMinAmount=1 (accept any price), and fillDelay=0.`;
        break;

      case "Spot Limit Order":
        if (!limitPrice) return;
        prompt = `Create a spot limit order to swap ${totalAmount} ${srcToken} for ${dstToken} only if I receive at least ${limitPrice} ${dstToken} per ${srcToken}. Execute the entire amount in one transaction with srcAmount=${totalAmount}, srcBidAmount=${totalAmount}, dstMinAmount=${limitPrice}, and fillDelay=0.`;
        break;

      case "TWAP Market (DCA)":
        if (!chunkAmount || !fillDelay) return;
        const delaySeconds = delayUnit === "minutes" ? parseInt(fillDelay) * 60 : parseInt(fillDelay) * 3600;
        prompt = `Create a TWAP market order (DCA) to swap a total of ${totalAmount} ${srcToken} for ${dstToken} in chunks of ${chunkAmount} ${srcToken} each, with ${fillDelay} ${delayUnit} between trades. Accept market price for each chunk with srcAmount=${totalAmount}, srcBidAmount=${chunkAmount}, dstMinAmount=1 (market price), and fillDelay=${delaySeconds} seconds.`;
        break;

      case "TWAP Limit":
        if (!chunkAmount || !limitPrice || !fillDelay) return;
        const delaySecondsLimit = delayUnit === "minutes" ? parseInt(fillDelay) * 60 : parseInt(fillDelay) * 3600;
        prompt = `Create a TWAP limit order to swap a total of ${totalAmount} ${srcToken} for ${dstToken} in chunks of ${chunkAmount} ${srcToken} each, with ${fillDelay} ${delayUnit} between trades. Only execute if each chunk receives at least ${limitPrice} ${dstToken} per ${srcToken}. Set srcAmount=${totalAmount}, srcBidAmount=${chunkAmount}, dstMinAmount=${limitPrice} per chunk, and fillDelay=${delaySecondsLimit} seconds.`;
        break;
    }

    onCommit(prompt);
  };

  const isTWAP = orderType.includes("TWAP");
  const isLimit = orderType.includes("Limit");

  return (
    <div className="flex flex-col w-full gap-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
          Order Type
        </label>
        <Select options={orderTypes} value={orderType} onChange={setOrderType} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            From
          </label>
          <Select
            options={tokens.map((t) => t.symbol)}
            value={srcToken}
            onChange={setSrcToken}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            To
          </label>
          <Select
            options={tokens.filter((t) => t.symbol !== srcToken).map((t) => t.symbol)}
            value={dstToken}
            onChange={setDstToken}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
          Total Amount
        </label>
        <Input
          type="number"
          placeholder="1000"
          value={totalAmount}
          onChange={setTotalAmount}
        />
      </div>

      {isTWAP && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Chunk Size
          </label>
          <Input
            type="number"
            placeholder="100"
            value={chunkAmount}
            onChange={setChunkAmount}
          />
        </div>
      )}

      {isLimit && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Min Output Per {isTWAP ? "Chunk" : "Trade"}
          </label>
          <Input
            type="number"
            placeholder={isTWAP ? "100" : "2000"}
            value={limitPrice}
            onChange={setLimitPrice}
          />
        </div>
      )}

      {isTWAP && (
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
              Delay Between Trades
            </label>
            <Input
              type="number"
              placeholder="10"
              value={fillDelay}
              onChange={setFillDelay}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
              Unit
            </label>
            <Select
              options={["minutes", "hours"]}
              value={delayUnit}
              onChange={setDelayUnit}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-1 w-full py-1.5 rounded text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
      >
        Execute Strategy
      </button>
    </div>
  );
};

// --- 3. The Main Card Component ---

const ActionCard = ({
  title,
  desc,
  icon,
  type,
  onAction,
  tokens,
  isHovered,
  onHover,
}: any) => {
  const isExpandable = type === "simulate" || type === "strategies";

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`group relative w-full rounded-xl border border-white/10 bg-white/5 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-purple-500/50 overflow-hidden ${
        isExpandable && isHovered ? "row-span-2 z-20" : "row-span-1"
      }`}
    >
      {/* State 1: Default View (Visible by default, hidden on hover) */}
      <div
        className={`absolute inset-0 flex flex-col items-start p-6 transition-opacity duration-[1000ms] ease-in-out ${
          isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="p-3 mb-4 text-white rounded-lg bg-black/20">{icon}</div>
        <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
      </div>

      {/* State 2: Hover View (Hidden by default, visible on hover) */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 transition-opacity duration-[1000ms] ease-in-out bg-black/80 backdrop-blur-sm ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h4 className="mb-3 text-sm font-bold tracking-wider text-white uppercase">
          {title}
        </h4>

        {type === "transfer" && (
          <TransferForm onCommit={onAction} tokens={tokens} />
        )}
        {type === "swap" && <SwapForm onCommit={onAction} tokens={tokens} />}
        {type === "simulate" && (
          <SimulateForm onCommit={onAction} tokens={tokens} />
        )}
        {type === "market" && <MarketForm onCommit={onAction} />}
        {type === "strategies" && (
          <ExecuteStrategiesForm onCommit={onAction} tokens={tokens} />
        )}
      </div>
    </motion.div>
  );
};

// --- 4. Main Grid Component ---

const QuickActionsGrid = () => {
  const dispatch = useAppDispatch();
  const chainId = useChainId();
  const {address} = useAccount();
  const network = getChainById(chainId);
  const tokenList = useAppSelector(selectTokensByChain(chainId));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleAction = (resultString: string) => {
    // TODO: Connect this to your chat input state
    // setInput(resultString);
    dispatch(streamChatPrompt({ prompt: resultString, address:address!, network: network?.id }));
  };

  const actions = [
    {
      type: "strategies",
      title: "Execute Strategies",
      desc: "Create market, limit, or DCA orders with precision.",
      icon: (
        <svg
          className="w-6 h-6 text-orange-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
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
      type: "simulate",
      title: "Simulate Strategies",
      desc: "Run strategy simulations and view projections.",
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

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2 auto-rows-[12rem] grid-flow-dense">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            {...action}
            onAction={handleAction}
            tokens={tokenList}
            isHovered={hoveredIndex === index}
            onHover={(hover: boolean) => setHoveredIndex(hover ? index : null)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
