import React from "react";
import { DcaSummary } from "@/types/dca";

interface DcaSummaryCardProps {
  summary: DcaSummary;
  coinSymbol?: string;
}

const DcaSummaryCard: React.FC<DcaSummaryCardProps> = ({
  summary,
  coinSymbol = "Token",
}) => {
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  const formatCurrency = (num: number) => {
    return `$${formatNumber(num, 2)}`;
  };

  const formatPercentage = (num: number) => {
    const pct = num * 100;
    return `${pct >= 0 ? "+" : ""}${formatNumber(pct, 2)}%`;
  };

  const isPositiveReturn = summary.return_pct >= 0;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(159,107,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            DCA Summary
          </p>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
              isPositiveReturn
                ? "bg-[#2AF598]/10 border-[#2AF598]/30"
                : "bg-[#FF5555]/10 border-[#FF5555]/30"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPositiveReturn ? "bg-[#2AF598]" : "bg-[#FF5555]"
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                isPositiveReturn ? "text-[#2AF598]" : "text-[#FF5555]"
              }`}
            >
              {formatPercentage(summary.return_pct)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-white/50 mb-2">Total Investment</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {formatCurrency(summary.total_investment)}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Across {summary.buy_count} purchases
          </p>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/50">Current Value</p>
            <svg
              className={`w-4 h-4 ${
                isPositiveReturn ? "text-[#2AF598]" : "text-[#FF5555]"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPositiveReturn ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              )}
            </svg>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {formatCurrency(summary.current_value)}
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isPositiveReturn
                  ? "bg-gradient-to-r from-[#2AF598] to-[#1DE087]"
                  : "bg-gradient-to-r from-[#FF5555] to-[#FF3333]"
              }`}
              style={{
                width: `${Math.min(
                  Math.max(
                    (summary.current_value / summary.total_investment) * 100,
                    0
                  ),
                  100
                )}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-white/40 mt-2">
            {isPositiveReturn ? "Profit" : "Loss"}: {formatCurrency(summary.current_value - summary.total_investment)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400/70 mb-1">
              Avg Buy Price
            </p>
            <p className="text-sm font-bold text-white">
              ${formatNumber(summary.average_buy_price, 4)}
            </p>
            <p className="text-[10px] text-white/40 mt-1">Per token</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-purple-400/70 mb-1">
              Total Tokens
            </p>
            <p className="text-sm font-bold text-white">
              {formatNumber(summary.total_tokens, 2)}
            </p>
            <p className="text-[10px] text-white/40 mt-1">{coinSymbol}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DcaSummaryCard;
