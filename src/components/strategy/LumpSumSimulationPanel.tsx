import React, { useMemo } from "react";
import { LumpSumResponse } from "@/types/lumpsum";
import LumpSumSummaryCard from "./LumpSumSummaryCard";
import LumpSumProjectionCard from "./LumpSumProjectionCard";
import LumpSumPriceChart from "./LumpSumPriceChart";
import LumpSumPortfolioChart from "./LumpSumPortfolioChart";

interface LumpSumSimulationPanelProps {
  data: LumpSumResponse;
  coinSymbol?: string;
  coinName?: string;
}

const LumpSumSimulationPanel: React.FC<LumpSumSimulationPanelProps> = ({
  data,
  coinSymbol = "Token",
  coinName = "Cryptocurrency",
}) => {
  const buyPointInfo = useMemo(() => {
    if (!data.chartData.buy_point || data.chartData.buy_point.length === 0) {
      return null;
    }
    const [timestamp, price] = data.chartData.buy_point[0];
    return {
      date: new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      price,
    };
  }, [data.chartData.buy_point]);

  const formatPrice = (num: number) => {
    return `$${num.toFixed(4)}`;
  };

  const formatCurrency = (num: number) => {
    return `$${num.toFixed(2)}`;
  };

  const formatTokens = (num: number) => {
    return num.toFixed(2);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Lump Sum Strategy Simulation
        </h2>
        <p className="text-sm text-white/50">
          Single investment analysis for {coinName}
        </p>
      </div>

      <LumpSumSummaryCard summary={data.summary} coinSymbol={coinSymbol} />

      <LumpSumProjectionCard projections={data.projections} />

      <LumpSumPriceChart
        prices={data.chartData.prices}
        buyPoint={data.chartData.buy_point}
      />

      <LumpSumPortfolioChart
        portfolioValues={data.chartData.portfolio_values}
        totalInvestment={data.summary.total_investment}
      />

      {buyPointInfo && (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(159,107,255,0.08),_transparent_70%)]" />
          <div className="relative z-10 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
              Investment Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                <p className="text-xs text-white/50 mb-2">Purchase Date</p>
                <p className="text-sm font-semibold text-white">{buyPointInfo.date}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                <p className="text-xs text-white/50 mb-2">Buy Price</p>
                <p className="text-sm font-semibold text-white font-mono">
                  {formatPrice(buyPointInfo.price)}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                <p className="text-xs text-white/50 mb-2">Amount Invested</p>
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(data.summary.total_investment)}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                <p className="text-xs text-white/50 mb-2">Tokens Acquired</p>
                <p className="text-sm font-semibold text-[#7CABF9]">
                  {formatTokens(data.summary.tokens_bought)} {coinSymbol}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-[#FFA500] flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold text-white mb-1">
              Important Notice
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              This simulation is for educational purposes only and does not constitute
              financial advice. Cryptocurrency investments carry significant risks.
              Always conduct your own research and consult with a financial advisor
              before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumpSumSimulationPanel;
