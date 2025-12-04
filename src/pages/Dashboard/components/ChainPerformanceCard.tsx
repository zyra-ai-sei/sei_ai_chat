// ChainPerformanceCard - Performance comparison across chains
import { PortfolioSummaryItem } from "@/redux/portfolioData/summaryTypes";
import { CHAIN_NAMES } from "@/redux/portfolioData/types";
import { formatCurrency, formatPercentage } from "../utils/dashboard.utils";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface ChainPerformanceCardProps {
  summaryData: PortfolioSummaryItem[];
}

const ChainPerformanceCard = ({ summaryData }: ChainPerformanceCardProps) => {
  if (summaryData.length === 0) {
    return (
      <div className="bg-white/[0.02] rounded-2xl border border-white/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#2AF598]" />
          <h3 className="text-white font-semibold">Chain Performance</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-white/40" />
          </div>
          <span className="text-white/40 text-sm">No chain data available</span>
        </div>
      </div>
    );
  }

  const CHAIN_ICONS: Record<number, string> = {
    1: "🔷", // Ethereum
    137: "🟣", // Polygon
    42161: "🔵", // Arbitrum
    8453: "🔵", // Base
    1329: "🔴", // SEI
  };

  // Sort chains by total realized profit (descending)
  const sortedChains = [...summaryData].sort(
    (a, b) => Number(b.total_realized_profit_usd) - Number(a.total_realized_profit_usd)
  );

  const topPerformer = sortedChains[0];

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-[#2AF598]" />
        <h3 className="text-white font-semibold">Chain Performance</h3>
      </div>

      {/* Top Performer Highlight */}
      {topPerformer && (
        <div className="bg-gradient-to-r from-[#2AF598]/10 to-[#009EFD]/10 rounded-xl p-4 border border-[#2AF598]/20 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{CHAIN_ICONS[topPerformer.chainId] || "⚪"}</span>
              <span className="font-medium text-white">
                {CHAIN_NAMES[topPerformer.chainId] || `Chain ${topPerformer.chainId}`}
              </span>
              <div className="px-2 py-0.5 bg-[#2AF598]/20 text-[#2AF598] text-xs font-medium rounded-full">
                Top Performer
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/60 mb-1">Profit</div>
              <div className={`font-semibold ${
                Number(topPerformer.total_realized_profit_usd) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(Number(topPerformer.total_realized_profit_usd))}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">Trades</div>
              <div className="font-semibold text-white">
                {topPerformer.total_count_of_trades}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chain List */}
      <div className="space-y-3">
        {sortedChains.map((chain) => {
          const isProfit = Number(chain.total_realized_profit_usd) >= 0;
          const winRate = chain.total_count_of_trades > 0 
            ? ((chain.total_buys || 0) / chain.total_count_of_trades) * 100 
            : 0;

          return (
            <div
              key={chain.chainId}
              className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">{CHAIN_ICONS[chain.chainId] || "⚪"}</span>
                <div>
                  <div className="font-medium text-white text-sm">
                    {CHAIN_NAMES[chain.chainId] || `Chain ${chain.chainId}`}
                  </div>
                  <div className="text-xs text-white/60">
                    {chain.total_count_of_trades} trades • {winRate.toFixed(1)}% buys
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold text-sm ${isProfit ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                  {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {formatCurrency(Number(chain.total_realized_profit_usd))}
                </div>
                {chain.profit_percentage !== undefined && (
                  <div className={`text-xs ${isProfit ? 'text-green-400/60' : 'text-red-400/60'}`}>
                    {formatPercentage(chain.profit_percentage)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">
              {sortedChains.reduce((sum, chain) => sum + chain.total_count_of_trades, 0)}
            </div>
            <div className="text-xs text-white/60">Total Trades</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {sortedChains.reduce((sum, chain) => sum + (chain.total_buys || 0), 0)}
            </div>
            <div className="text-xs text-white/60">Total Buys</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {sortedChains.reduce((sum, chain) => sum + (chain.total_sells || 0), 0)}
            </div>
            <div className="text-xs text-white/60">Total Sells</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainPerformanceCard;