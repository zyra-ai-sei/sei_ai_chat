// PortfolioPerformanceSection - Enhanced trading performance with chain switching
import { useState } from "react";
import { PortfolioSummaryItem } from "@/redux/portfolioData/summaryTypes";
import { CHAIN_NAMES } from "@/redux/portfolioData/types";
import { formatCurrency, formatPercentage } from "../utils/dashboard.utils";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PortfolioPerformanceSectionProps {
  summaryData: PortfolioSummaryItem[];
  isWalletConnected?: boolean;
}

const PortfolioPerformanceSection = ({
  summaryData,
  isWalletConnected = false,
}: PortfolioPerformanceSectionProps) => {
  const [selectedChainId, setSelectedChainId] = useState<number>(() =>
    summaryData.length > 0 ? summaryData[0].chainId : 1
  );

  const selectedChainData = summaryData.find(
    (item) => item.chainId === selectedChainId
  );

  const CHAIN_ICONS: Record<number, string> = {
    1: "🔷", // Ethereum
    137: "🟣", // Polygon
    42161: "🔵", // Arbitrum
    8453: "🔵", // Base
    1329: "🔴", // SEI
  };

  const isPositive = selectedChainData && Number(selectedChainData.total_realized_profit_usd) >= 0;

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>
        
        {/* Chain Selector */}
        {summaryData.length > 0 && (
          <div className="relative">
            <select
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-white text-sm appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#2AF598]/30 transition-all hover:bg-white/[0.06]"
              value={selectedChainId}
              onChange={(e) => setSelectedChainId(Number(e.target.value))}
            >
              {summaryData.map((item) => (
                <option key={item.chainId} value={item.chainId} className="bg-[#1a1d24] text-white">
                  {CHAIN_ICONS[item.chainId] || "⚪"} {CHAIN_NAMES[item.chainId] || `Chain ${item.chainId}`}
                </option>
              ))}
            </select>
            <span className="absolute text-xs -translate-y-1/2 pointer-events-none right-3 top-1/2 text-white/60">▼</span>
          </div>
        )}
      </div>

      {!isWalletConnected || summaryData.length === 0 ? (
        // Not connected state
        <div className="h-[240px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white/40" />
            </div>
            <span className="text-sm text-white/40">Connect wallet to view performance</span>
          </div>
        </div>
      ) : selectedChainData ? (
        // Enhanced performance display
        <div className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Realized Profit */}
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs font-medium tracking-wider uppercase text-white/60">
                  Total Realized Profit
                </span>
              </div>
              <div className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(Number(selectedChainData.total_realized_profit_usd))}
              </div>
              {selectedChainData.profit_percentage !== undefined && (
                <div className={`text-sm flex items-center gap-1 mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatPercentage(selectedChainData.profit_percentage)}
                </div>
              )}
            </div>

            {/* Total Trades */}
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-[#2AF598] to-[#009EFD]"></div>
                <span className="flex items-center justify-between w-full text-xs font-medium tracking-wider uppercase text-white/60">
                  Total Trades   <span className=" text-[10px] text-white/60">
                Across {CHAIN_NAMES[selectedChainData.chainId]}
              </span>
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {selectedChainData.total_count_of_trades.toLocaleString()}
              </div>
            
            </div>
          </div>

          {/* Buy/Sell Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Buys */}
            <div className="p-4 border bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium tracking-wider text-green-400 uppercase">
                  Total Buys
                </span>
              </div>
              <div className="text-xl font-bold text-green-400">
                {(selectedChainData.total_buys || 0).toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-green-400/60">
                {selectedChainData.total_count_of_trades > 0 
                  ? `${(((selectedChainData.total_buys || 0) / selectedChainData.total_count_of_trades) * 100).toFixed(1)}% of trades`
                  : 'No trades yet'
                }
              </div>
            </div>

            {/* Total Sells */}
            <div className="p-4 border bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl border-red-500/20">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium tracking-wider text-red-400 uppercase">
                  Total Sells
                </span>
              </div>
              <div className="text-xl font-bold text-red-400">
                {(selectedChainData.total_sells || 0).toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-red-400/60">
                {selectedChainData.total_count_of_trades > 0 
                  ? `${(((selectedChainData.total_sells || 0) / selectedChainData.total_count_of_trades) * 100).toFixed(1)}% of trades`
                  : 'No trades yet'
                }
              </div>
            </div>
          </div>
       
        </div>
      ) : (
        <div className="h-[240px] flex items-center justify-center">
          <span className="text-sm text-white/40">No data available for selected chain</span>
        </div>
      )}
    </div>
  );
};

export default PortfolioPerformanceSection;
