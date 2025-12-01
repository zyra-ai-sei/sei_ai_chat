// PortfolioValueCard - Displays total portfolio value with performance score
import { TrendingDown, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import { PortfolioStats } from "../types/dashboard.types";
import { formatCurrency, formatPercentage } from "../utils/dashboard.utils";

interface PortfolioValueCardProps {
  data: PortfolioStats; /* API data */
}

const PortfolioValueCard = ({ data }: PortfolioValueCardProps) => {
  const { totalValue, performanceScore, isPerformancePositive } = data;

  return (
    <StatCard title="Total portfolio value">
      <p className="text-[32px] font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">
        {formatCurrency(totalValue)} {/* API: totalValue */}
      </p>
      <div
        className={`flex items-center gap-2 px-2 pr-2.5 py-1 rounded-full border ${
          isPerformancePositive
            ? "border-green-500/30"
            : "border-red-500/30"
        }`}
      >
        {isPerformancePositive ? (
          <TrendingUp className="w-4 h-4 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400 drop-shadow-[0_0_8px_rgba(202,43,44,0.4)]" />
        )}
        <span
          className={`text-[10px] ${
            isPerformancePositive ? "text-green-400" : "text-[#c94546]"
          } drop-shadow-[0_0_8px_rgba(202,43,44,0.4)]`}
        >
          Performance Score : {formatPercentage(performanceScore)} {/* API: performanceScore */}
        </span>
      </div>
    </StatCard>
  );
};

export default PortfolioValueCard;
