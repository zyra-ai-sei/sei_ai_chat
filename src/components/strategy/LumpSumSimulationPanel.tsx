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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const buyPointInfo = useMemo(() => {
    if (!data.chartData.buy_point || data.chartData.buy_point.length !== 3) {
      return null;
    }
    const [timestamp, price, tokens] = data.chartData.buy_point;
    return {
      date: new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      price,
      tokens,
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

  const formatPercentage = (num: number) => {
    const pct = num * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
  };

  const isPositiveReturn = data.summary.return_pct >= 0;

  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0B0F1A] p-6 transition-all hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px] transition-all group-hover:bg-blue-600/20" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-600/10 blur-[80px] transition-all group-hover:bg-purple-600/20" />
        
        <div className="relative z-10 space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 blur-lg transition-all group-hover:opacity-40" />
                <div className="relative h-16 w-16 rounded-full border border-white/10 bg-[#161B2D] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                  {coinName} Lump Sum
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    STRATEGY REPORT
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-2xl font-black font-mono transition-all ${isPositiveReturn ? 'text-[#2AF598]' : 'text-[#FF5555]'}`}>
                {formatPercentage(data.summary.return_pct)}
              </div>
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                Single Entry
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-5">
            <div className="space-y-1 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total Invested</p>
              <p className="text-sm font-black text-white/90">{formatCurrency(data.summary.total_investment)}</p>
            </div>
            <div className="space-y-1 border-l border-white/5 px-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Value Now</p>
              <p className="text-sm font-black text-[#7CABF9]">{formatCurrency(data.summary.current_value)}</p>
            </div>
          </div>

          {/* New Interactive Trigger */}
          <div className="flex items-center justify-center gap-2 pt-2 transition-all">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-purple-400">
              Deep Dive Analysis
            </span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 transition-all group-hover:translate-x-1 group-hover:bg-purple-500/20">
              <svg className="h-3 w-3 text-white/40 group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Lump Sum Strategy Simulation
          </h2>
          <p className="text-sm text-white/50">
            Single investment analysis for {coinName}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 rounded-full hover:bg-white/5 text-white/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
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
                  {formatTokens(buyPointInfo.tokens)} {coinSymbol}
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
