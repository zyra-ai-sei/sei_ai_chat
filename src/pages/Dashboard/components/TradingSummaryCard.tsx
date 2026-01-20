import { useAppSelector } from "@/hooks/useRedux";
import {
  selectSummaryError,
  selectSummaryLoading,
  selectSummaryStats,
} from "@/redux/portfolioData";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const TradingSummaryCard = () => {
  const summaryStats = useAppSelector(selectSummaryStats);
  const summaryLoading = useAppSelector(selectSummaryLoading);
  const summaryError = useAppSelector(selectSummaryError);

  return (
    <motion.div
      custom={1}
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
      className="rounded-3xl group overflow-hidden bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-xl transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-3 bg-blue-500/20 w-fit rounded-2xl mb-4">
        <Activity size={20} className="text-blue-400" />
      </div>

      <p className="text-zinc-500 text-sm font-medium">Trading Summary</p>

      {summaryLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-white/20 border-t-[#2AF598] rounded-full animate-spin"></div>
          <span className="text-white/60">Loading...</span>
        </div>
      ) : summaryError ? (
        <span className="text-red-400">{summaryError}</span>
      ) : summaryStats.totalTrades > 0 ? (
        <>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold"> {summaryStats.totalTrades}</h2>
            <span className="text-zinc-500 text-sm">Trade</span>
          </div>
          <div className="mt-4 flex justify-between items-center border-t border-zinc-800 pt-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                P&L
              </p>
              <p
                className={`text-sm font-bold mt-1 ${
                  summaryStats.totalRealizedProfitUsd >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                ${" "}
                {summaryStats.totalRealizedProfitUsd.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Active Chains
              </p>
              <p className="text-zinc-300 font-bold text-sm">
                {summaryStats.chainCount}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center w-full gap-2">
          <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center">
            <span className="text-xl text-white/40">📈</span>
          </div>
          <span className="text-sm text-white/40">No trading data</span>
        </div>
      )}
    </motion.div>
  );
};

export default TradingSummaryCard;
