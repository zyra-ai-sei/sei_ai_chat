// PortfolioOverviewCard - Displays key portfolio metrics and chain distribution
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/dashboard.utils";
import { ChainBalance } from "@/redux/portfolioData/types";
import { motion } from "framer-motion";
import { getChainById } from "@/config/chains";

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
  totalChains,
}: PortfolioOverviewCardProps) => {
  return (
    <motion.div
      custom={3}
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
      className="rounded-3xl group overflow-hidden bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-xl"
    >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {" "}
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <PieChart size={18} className="text-purple-400" />
        <p className="text-zinc-200 font-bold">Portfolio Overview</p>
      </div>
      {/* Main Content */}
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-white to-white/60 bg-clip-text">
            {formatCurrency(totalBalance)}
          </p>
          <div
            className={`flex items-center gap-1 mt-1 ${
              isPositiveChange ? "text-green-400" : "text-red-400"
            }`}
          >
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
            {totalChains} {totalChains === 1 ? "chain" : "chains"} active
          </p>
       
        </div>
      </div>
      {/* Chain Distribution Bar */}
      {chainBalances.length > 0 && (
        <div className="w-full mt-6 space-y-4">
          <div className="h-2.5 w-full bg-zinc-800/50 rounded-full flex overflow-hidden ring-1 ring-white/5">
            {chainBalances.map((chain, index) => {
              const percentage =
                totalBalance > 0
                  ? (chain.totalUsdValue / totalBalance) * 100
                  : 0;

              const colors = [
                "bg-blue-500",
                "bg-purple-500",
                "bg-emerald-500",
                "bg-amber-500",
                "bg-rose-500",
              ];

              return (
                <motion.div
                  key={chain.chainId}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={colors[index % colors.length]}
                  title={`${chain.chainName}: ${formatCurrency(
                    chain.totalUsdValue
                  )} (${percentage.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {chainBalances.map((chain) => {
              const percentage =
                totalBalance > 0
                  ? (chain.totalUsdValue / totalBalance) * 100
                  : 0;

              return (
                <div key={chain.chainId} className="flex items-center gap-1.5">
                  <img src={getChainById(chain.chainId)?.logo} className="w-3 h-3 rounded-full"/>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">
                    {chain.chainName.slice(0, 3)} {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioOverviewCard;
