// PortfolioValueCard - Displays total portfolio value with performance score
import { Wallet } from "lucide-react";
import { PortfolioStats } from "../types/dashboard.types";
import { formatCurrency, formatPercentage } from "../utils/dashboard.utils";
import { motion } from "framer-motion";

interface PortfolioValueCardProps {
  data: PortfolioStats /* API data */;
}

const PortfolioValueCard = ({ data }: PortfolioValueCardProps) => {
  const { totalValue, performanceScore, isPerformancePositive } = data;

  return (
   

    <motion.div
      custom={0}
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
      className="relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-purple-500/20 rounded-2xl">
          <Wallet size={20} className="text-purple-400" />
        </div>
        <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>
      <p className="text-zinc-500 text-sm font-medium">Total Portfolio Value</p>
      <h2 className="text-3xl font-bold mt-1 tracking-tight">
        {formatCurrency(totalValue)}
      </h2>

      <span
        className={`text-[10px] ${
          isPerformancePositive ? "text-green-400/60" : "text-[#c94546]/70"
        } drop-shadow-[0_0_8px_rgba(202,43,44,0.4)] font-light text-sm `}
      >
        Performance Score : {formatPercentage(performanceScore)}{" "}
        {/* API: performanceScore */}
      </span>
 
    </motion.div>
  );
};

export default PortfolioValueCard;
