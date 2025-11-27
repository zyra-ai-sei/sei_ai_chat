import React from "react";
import { TokenVisualizationData } from "@/redux/tokenVisualization/reducer";

interface DeveloperActivityCardProps {
  token: TokenVisualizationData;
}

const DeveloperActivityCard: React.FC<DeveloperActivityCardProps> = ({
  token,
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(110,178,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Developer Activity
          </p>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Stars
              </p>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(token.developer_activity.stars)}
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-[#7CABF9]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Forks
              </p>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(token.developer_activity.forks)}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-[#7CABF9]/10 to-[#9F6BFF]/10 border border-[#7CABF9]/20 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/50">Commits (4 weeks)</p>
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {token.developer_activity.commit_count_4_weeks}
            </span>
            <span className="text-sm text-white/50">commits</span>
          </div>
          <div className="flex gap-1 mt-3">
            {[...Array(28)].map((_, i) => {
              const intensity =
                i % 4 === 0 ? "bg-emerald-400/60" : i % 3 === 0 ? "bg-emerald-400/40" : "bg-white/10";
              return (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded ${intensity}`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 border border-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              PRs Merged
            </p>
            <p className="text-lg font-bold text-white">
              {formatNumber(token.developer_activity.pull_requests_merged)}
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              Contributors
            </p>
            <p className="text-lg font-bold text-white">
              {formatNumber(token.developer_activity.contributors)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub repository actively maintained</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperActivityCard;
