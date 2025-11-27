import React from "react";
import { TokenVisualizationData } from "@/redux/tokenVisualization/reducer";

interface FundamentalsCardProps {
  token: TokenVisualizationData;
}

const FundamentalsCard: React.FC<FundamentalsCardProps> = ({ token }) => {
  const formatSupply = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(159,107,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Fundamentals
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <img
            src={token.image.large}
            alt={token.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-2xl font-bold text-white">{token.name}</h3>
            <p className="text-sm text-white/50">
              {token.symbol.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {token.categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#7CABF9]/10 border border-[#7CABF9]/30 text-[#7CABF9]"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-sm text-white/60">Circulating Supply</span>
            <span className="text-sm font-semibold text-white">
              {formatSupply(token.market.circulating_supply)}{" "}
              {token.symbol.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-sm text-white/60">Max Supply</span>
            <span className="text-sm font-semibold text-white">
              {formatSupply(token.market.max_supply)}{" "}
              {token.symbol.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-sm text-white/60">Supply Mined</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7CABF9] to-[#9F6BFF]"
                  style={{
                    width: `${token.market.supply_pct_mined * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-emerald-400">
                {(token.market.supply_pct_mined * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-[#7CABF9]/10 to-[#9F6BFF]/10 border border-[#7CABF9]/20 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#7CABF9] mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-xs text-white/70 leading-relaxed">
                {token.name} uses a {token.market.max_supply > 0 ? "deflationary" : "inflationary"} model{" "}
                {token.market.max_supply > 0 && `with a fixed ${formatSupply(token.market.max_supply)} supply cap`}.
                {(token.market.supply_pct_mined * 100).toFixed(1)}% of the total supply is currently in circulation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundamentalsCard;
