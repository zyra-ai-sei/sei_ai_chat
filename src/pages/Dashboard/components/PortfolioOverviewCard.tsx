// PortfolioOverviewCard - Displays key portfolio metrics and chain distribution
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/dashboard.utils";
import { ChainBalance } from "@/redux/portfolioData/types";

interface PortfolioOverviewCardProps {
  totalBalance: number;
  percentageChange: number;
  isPositiveChange: boolean;
  chainBalances: ChainBalance[];
  totalChains: number;
}

const PortfolioOverviewCard = ({ 
  totalBalance, 
  percentageChange, 
  isPositiveChange,
  chainBalances,
  totalChains
}: PortfolioOverviewCardProps) => {
  // Find the chain with highest balance
  const topChain = chainBalances.length > 0 ? chainBalances.reduce((prev, current) => 
    (prev.totalUsdValue > current.totalUsdValue) ? prev : current
  ) : null;

  const CHAIN_ICONS: Record<number, string> = {
    1: "🔷", // Ethereum
    137: "🟣", // Polygon
    42161: "🔵", // Arbitrum
    8453: "🔵", // Base
    1329: "🔴", // SEI
  };

  return (
    <div className="flex-1 border border-white/30 rounded-2xl bg-gradient-to-r from-[#7cacf910] via-[#FFFFFF0A] to-[#FFFFFF0A] p-5 flex flex-col justify-between min-h-[168px]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-white/[0.08] border border-white/10 rounded-xl p-2 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <p className="text-base font-medium text-white">Portfolio Overview</p>
      </div>

      {/* Main Content */}
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-white to-white/60 bg-clip-text">
            {formatCurrency(totalBalance)}
          </p>
          <div className={`flex items-center gap-1 mt-1 ${
            isPositiveChange ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositiveChange ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="text-xs font-medium">
              {formatPercentage(Math.abs(percentageChange))}
            </span>
          </div>
        </div>
        <div className="text-xs leading-4 text-right text-white/60">
          <p>Portfolio Balance</p>
          <p className="mt-1">
            {totalChains} {totalChains === 1 ? 'chain' : 'chains'} active
          </p>
          {topChain && (
            <div className="flex items-center gap-1 justify-end mt-1">
              <span>{CHAIN_ICONS[topChain.chainId] || "⚪"}</span>
              <span>{topChain.chainName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chain Distribution Bar */}
      {chainBalances.length > 0 && (
        <div className="w-full">
          <div className="flex items-center gap-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
            {chainBalances.map((chain, index) => {
              const percentage = totalBalance > 0 ? (chain.totalUsdValue / totalBalance) * 100 : 0;
              const colors = ['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'];
              return (
                <div
                  key={chain.chainId}
                  className={`h-full ${colors[index % colors.length]}`}
                  style={{ width: `${percentage}%` }}
                  title={`${chain.chainName}: ${formatCurrency(chain.totalUsdValue)} (${percentage.toFixed(1)}%)`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioOverviewCard;