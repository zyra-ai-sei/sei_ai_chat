import React from "react";
import { LumpSumProjections } from "@/types/lumpsum";

interface LumpSumProjectionCardProps {
  projections: LumpSumProjections;
}

const LumpSumProjectionCard: React.FC<LumpSumProjectionCardProps> = ({
  projections,
}) => {
  const formatPrice = (num: number) => {
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number) => {
    const pct = num * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
  };

  const getRiskLevel = (volatility: number) => {
    const volPct = volatility * 100;
    if (volPct > 70) return { level: "High Risk", color: "#FF5555" };
    if (volPct > 40) return { level: "Medium Risk", color: "#FFA500" };
    return { level: "Low Risk", color: "#2AF598" };
  };

  const risk = getRiskLevel(projections.annual_volatility);
  const isPositiveReturn = projections.expected_annual_return >= 0;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(122,171,249,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            1-Year Forecast
          </p>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full border"
            style={{
              backgroundColor: `${risk.color}15`,
              borderColor: `${risk.color}30`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: risk.color }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: risk.color }}
            >
              {risk.level}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-white/50 mb-4">Monte Carlo Simulation</p>

          <div className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400/70">
                    Bullish Scenario (90%)
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {formatPrice(projections.pct_90_value)}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-400/70">
                    Median Outcome (50%)
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {formatPrice(projections.pct_50_value)}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400/70">
                    Bearish Scenario (10%)
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {formatPrice(projections.pct_10_value)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

        <div className="space-y-4">
          <div className="rounded-xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50">Expected Annual Return</p>
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
            <p
              className={`text-2xl font-bold ${
                isPositiveReturn ? "text-[#2AF598]" : "text-[#FF5555]"
              }`}
            >
              {formatPercentage(projections.expected_annual_return)}
            </p>
            <p className="text-[10px] text-white/40 mt-1">Based on historical data</p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50">Annual Volatility</p>
              <svg
                className="w-4 h-4 text-[#FFA500]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatPercentage(projections.annual_volatility)}
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFA500] to-[#FF5555]"
                style={{
                  width: `${Math.min(projections.annual_volatility * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-white/40 mt-2">
              Price fluctuation indicator
            </p>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-[10px] text-white/40 leading-relaxed">
            Projections are based on Monte Carlo simulations using historical price data.
            Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LumpSumProjectionCard;
