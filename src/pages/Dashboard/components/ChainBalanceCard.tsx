// ChainBalanceCard - Displays native token balance for selected chain with dropdown
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChainBalance, CHAIN_NAMES } from "@/redux/portfolioData";
import { formatCurrency } from "../utils/dashboard.utils";
import { getChainById } from "@/config/chains";
import { motion } from "framer-motion";

interface ChainBalanceCardProps {
  chainBalances: ChainBalance[];
  isLoading?: boolean;
}

const ChainBalanceCard = ({
  chainBalances,
  isLoading = false,
}: ChainBalanceCardProps) => {
  const [selectedChainId, setSelectedChainId] = useState<number>(
    chainBalances[0]?.chainId || 1329
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedChain = chainBalances.find(
    (c) => c.chainId === selectedChainId
  );
  const nativeToken = selectedChain?.nativeToken;

  const handleChainSelect = (chainId: number) => {
    setSelectedChainId(chainId);
    setIsDropdownOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 border border-white/30 rounded-2xl p-5 flex flex-col  bg-gradient-to-r from-[#7cacf910] via-[#FFFFFF0A] to-[#FFFFFF0A] justify-between min-h-[168px]">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/60">Chain Balance</p>
        </div>
        <div className="animate-pulse">
          <div className="w-32 h-8 mb-2 rounded bg-white/10" />
          <div className="w-24 h-4 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      custom={2}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i: any) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
        }),
      }}
      className="rounded-3xl group overflow-hidden bg-zinc-900/40 border flex flex-col gap-4 border-zinc-800 p-6 backdrop-blur-xl"
    >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {" "}
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest">
          Chain Balance
        </p>

        {/* Chain Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors text-sm"
          >
            <img
              src={getChainById(selectedChainId)?.logo}
              className="h-4 w-4"
            />
            <span className="text-white">
              {CHAIN_NAMES[selectedChainId] || `Chain ${selectedChainId}`}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-white/60 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown List */}
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[180px] bg-[#0f1218] border border-white/20 rounded-xl overflow-hidden shadow-xl">
                {chainBalances.map((chain) => (
                  <button
                    key={chain.chainId}
                    onClick={() => handleChainSelect(chain.chainId)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.06] transition-colors ${
                      chain.chainId === selectedChainId ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <img
                      src={getChainById(chain.chainId)?.logo}
                      className="h-4 w-4"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {chain.chainName}
                      </p>
                      <p className="text-xs text-white/40">
                        {formatCurrency(chain.totalUsdValue)}
                      </p>
                    </div>
                    {chain.chainId === selectedChainId && (
                      <div className="w-2 h-2 rounded-full bg-[#2AF598]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Balance Display */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-[28px] font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">
            {nativeToken
              ? `${parseFloat(nativeToken.balance_formatted).toFixed(4)} ${nativeToken.symbol}`
              : "0.00"}
          </p>
          <p className="text-zinc-500 text-sm">
            {nativeToken ? formatCurrency(nativeToken.usd_value) : "$0.00"} USD
          </p>
        </div>

        <div className="text-xs leading-4 text-right text-white/60">
          {nativeToken && nativeToken.usd_price_24hr_percent_change !== 0 && (
            <p
              className={
                nativeToken.usd_price_24hr_percent_change >= 0
                  ? "text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md text-sm"
                  : "text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-md text-sm"
              }
            >
              {nativeToken.usd_price_24hr_percent_change >= 0 ? "+" : ""}
              {nativeToken.usd_price_24hr_percent_change.toFixed(2)}%
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center border-t border-zinc-800 pt-4">
        <p className="font-light tracking-wide text-zinc-500">
          Current <span className="text-zinc-400">{nativeToken?.symbol}</span> Price:{" "}
          <span className="text-emerald-400">
          {nativeToken ? formatCurrency(nativeToken.usd_price) : "$0.00"}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default ChainBalanceCard;
