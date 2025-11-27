import React from "react";
import { TokenVisualizationData } from "@/redux/tokenVisualization/reducer";

interface MarketStrengthCardProps {
  token: TokenVisualizationData;
}

const MarketStrengthCard: React.FC<MarketStrengthCardProps> = ({ token }) => {
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const volumeToMCapRatio =
    ((token.market.volume_24h / token.market.market_cap) * 100).toFixed(2);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(159,107,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Market Strength
          </p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#7CABF9]/10 border border-[#7CABF9]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7CABF9]" />
            <span className="text-xs font-semibold text-[#7CABF9]">
              Rank #{token.market.market_cap_rank}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-white/50 mb-2">Market Cap</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {formatLargeNumber(token.market.market_cap)}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            {token.name} market dominance
          </p>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/50">24h Volume</p>
            <svg
              className="w-4 h-4 text-[#7CABF9]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {formatLargeNumber(token.market.volume_24h)}
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7CABF9] to-[#9F6BFF]"
              style={{ width: `${Math.min(parseFloat(volumeToMCapRatio) * 50, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-white/40 mt-2">
            Volume/MCap ratio: {volumeToMCapRatio}%
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 mb-1">
              Circulating
            </p>
            <p className="text-sm font-bold text-white">
              {formatSupply(token.market.circulating_supply)}
            </p>
            <p className="text-[10px] text-white/40 mt-1">
              {(token.market.supply_pct_mined * 100).toFixed(1)}% mined
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400/70 mb-1">
              Max Supply
            </p>
            <p className="text-sm font-bold text-white">
              {formatSupply(token.market.max_supply)}
            </p>
            <p className="text-[10px] text-white/40 mt-1">Fixed cap</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStrengthCard;
