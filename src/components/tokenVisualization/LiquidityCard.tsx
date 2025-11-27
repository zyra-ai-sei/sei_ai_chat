import React from "react";
import { TokenVisualizationData } from "@/redux/tokenVisualization/reducer";

interface LiquidityCardProps {
  token: TokenVisualizationData;
}

const LiquidityCard: React.FC<LiquidityCardProps> = ({ token }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatVolume = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const tradingPairs = ["BTC/USDT", "BTC/USD", "BTC/EUR", "BTC/ETH"];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(159,107,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Liquidity
          </p>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">High</span>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-[#7CABF9]/10 to-[#9F6BFF]/10 border border-[#7CABF9]/20 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/50">Top Exchange</p>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/10">
              <svg
                className="w-3 h-3 text-[#7CABF9]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-xs font-semibold text-white/80">
                {token.liquidity.top_exchange}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-white">
              {formatPrice(token.liquidity.last_traded_price)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                Volume
              </p>
              <p className="text-sm font-semibold text-white/80">
                {formatVolume(token.liquidity.volume_on_top_exchange)}{" "}
                {token.symbol.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                Spread
              </p>
              <p className="text-sm font-semibold text-emerald-400">
                {token.liquidity.spread_pct.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
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
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Liquidity
              </p>
            </div>
            <p className="text-xl font-bold text-white">Deep</p>
            <p className="text-xs text-white/50 mt-1">Order books</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Trust Score
              </p>
            </div>
            <p className="text-xl font-bold text-emerald-400 capitalize">
              {token.liquidity.trust_score}
            </p>
            <p className="text-xs text-white/50 mt-1">Verified</p>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/5 p-4">
          <p className="text-xs text-white/50 mb-3">Trading Pairs Available</p>
          <div className="flex flex-wrap gap-2">
            {tradingPairs.map((pair) => (
              <span
                key={pair}
                className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70"
              >
                {pair}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">Market Depth</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  style={{ width: "95%" }}
                />
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                Excellent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityCard;
