import React from "react";
import { TokenVisualizationData } from "@/redux/tokenVisualization/reducer";

interface SentimentCardProps {
  token: TokenVisualizationData;
}

const SentimentCard: React.FC<SentimentCardProps> = ({ token }) => {
  const formatWatchlist = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const getSentimentLabel = (positive: number) => {
    if (positive >= 80) return "Very Bullish";
    if (positive >= 60) return "Bullish";
    if (positive >= 40) return "Neutral";
    if (positive >= 20) return "Bearish";
    return "Very Bearish";
  };

  const getSentimentScore = (positive: number) => {
    return Math.round((positive / 100) * 5);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(110,178,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Sentiment
          </p>
          <div className="flex items-center gap-1">
            <svg
              className={`w-5 h-5 ${
                token.sentiment.positive_pct >= 50
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            <span
              className={`text-xs font-semibold ${
                token.sentiment.positive_pct >= 50
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {getSentimentLabel(token.sentiment.positive_pct)}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60">Community Sentiment</span>
            <span className="text-lg font-bold text-emerald-400">
              {token.sentiment.positive_pct.toFixed(0)}%
            </span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="absolute inset-0 flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                style={{ width: `${token.sentiment.positive_pct}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-rose-500"
                style={{ width: `${token.sentiment.negative_pct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-emerald-400 font-medium">
              Positive {token.sentiment.positive_pct.toFixed(2)}%
            </span>
            <span className="text-xs text-rose-400 font-medium">
              Negative {token.sentiment.negative_pct.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="rounded-xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-[#7CABF9]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Watching
              </p>
            </div>
            <p className="text-xl font-bold text-white">
              {formatWatchlist(token.sentiment.watchlist_count)}
            </p>
            <p className="text-xs text-white/50 mt-1">Active trackers</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-[#7CABF9]/10 to-[#9F6BFF]/10 border border-[#7CABF9]/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-[#7CABF9]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Confidence
              </p>
            </div>
            <p className="text-xl font-bold text-[#7CABF9]">
              {token.sentiment.positive_pct >= 70 ? "High" : token.sentiment.positive_pct >= 40 ? "Medium" : "Low"}
            </p>
            <p className="text-xs text-white/50 mt-1">Market confidence</p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">Sentiment Score</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i <= getSentimentScore(token.sentiment.positive_pct)
                        ? "bg-emerald-400"
                        : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-white/70">
                {getSentimentScore(token.sentiment.positive_pct)}/5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;
