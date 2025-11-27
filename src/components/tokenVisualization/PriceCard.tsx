import React from "react";
import { TokenVisualizationData } from "@/redux/tokenVisualization/reducer";
import PriceChart from "./PriceChart";

interface PriceCardProps {
  token: TokenVisualizationData;
}

const PriceCard: React.FC<PriceCardProps> = ({ token }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative h-full rounded-2xl scrollbar-none border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(110,178,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Price
          </p>
          <div className="flex items-center gap-2">
            <img
              src={token.image.thumb}
              alt={token.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-semibold text-white/70">
              {token.symbol.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold text-white">
              {formatPrice(token.market.price_usd)}
            </span>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                token.market.price_change_24h >= 0
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-rose-500/10 border border-rose-500/30"
              }`}
            >
              <svg
                className={`w-3 h-3 ${
                  token.market.price_change_24h >= 0
                    ? "text-emerald-400"
                    : "text-rose-400 rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span
                className={`text-sm font-semibold ${
                  token.market.price_change_24h >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {token.market.price_change_24h >= 0 ? "+" : ""}
                {token.market.price_change_24h.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-white/50 mb-3">24h change</p>

          {/* Price Chart */}
          {token.chart?.prices && token.chart.prices.length > 0 && (
            <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-2 h-[400px]">
              <PriceChart
                data={token.chart.prices}
                change24h={token.market.price_change_24h}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-white/5 border border-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              1H
            </p>
            <p
              className={`text-sm font-semibold ${
                token.market.price_change_1h >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {token.market.price_change_1h >= 0 ? "+" : ""}
              {token.market.price_change_1h.toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              7D
            </p>
            <p
              className={`text-sm font-semibold ${
                token.market.price_change_7d >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {token.market.price_change_7d >= 0 ? "+" : ""}
              {token.market.price_change_7d.toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              30D
            </p>
            <p
              className={`text-sm font-semibold ${
                token.market.price_change_30d >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {token.market.price_change_30d >= 0 ? "+" : ""}
              {token.market.price_change_30d.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="text-xs text-white/50 mb-1">24h High</p>
            <p className="text-sm font-semibold text-white/80">
              {formatPrice(token.market.high_24h)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50 mb-1">24h Low</p>
            <p className="text-sm font-semibold text-white/80">
              {formatPrice(token.market.low_24h)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50 mb-1">ATH</p>
              <p className="text-sm font-semibold text-white/80">
                {formatPrice(token.market.ath_usd)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 mb-1">From ATH</p>
              <p
                className={`text-sm font-semibold ${
                  token.market.ath_change_pct >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {token.market.ath_change_pct.toFixed(2)}%
              </p>
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-2">
            Reached on {formatDate(token.market.ath_date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
