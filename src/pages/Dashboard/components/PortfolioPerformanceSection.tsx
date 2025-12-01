// PortfolioPerformanceSection - Portfolio performance chart with time period toggle
import { useState } from "react";
import { TimePeriod, PerformanceDataPoint } from "../types/dashboard.types";
import TimePeriodToggle from "./TimePeriodToggle";

interface PortfolioPerformanceSectionProps {
  data?: PerformanceDataPoint[]; /* API data - undefined means not connected */
  isWalletConnected?: boolean; /* API: Wallet connection status */
}

const PortfolioPerformanceSection = ({
  data,
  isWalletConnected = false,
}: PortfolioPerformanceSectionProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M");

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">Portfolio Performance</h2>
        <TimePeriodToggle
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>

      {/* Chart Area */}
      <div className="h-[200px] flex items-center justify-center">
        {!isWalletConnected || !data ? (
          // Not connected state
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
                  fill="currentColor"
                  className="text-white/40"
                />
              </svg>
            </div>
            <span className="text-white/40 text-sm">Connect wallet to view</span>
          </div>
        ) : (
          // Chart visualization - placeholder for actual chart library
          <div className="w-full h-full flex items-end gap-1">
            {data.map((point, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-[#2AF598] to-[#009EFD] rounded-t opacity-60 hover:opacity-100 transition-opacity"
                style={{
                  height: `${(point.value / Math.max(...data.map((d) => d.value))) * 100}%`,
                }}
                title={`${point.date}: $${point.value.toLocaleString()}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* X-axis labels - only show when data is available */}
      {isWalletConnected && data && data.length > 0 && (
        <div className="flex justify-between mt-4 text-xs text-white/40">
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      )}
    </div>
  );
};

export default PortfolioPerformanceSection;
