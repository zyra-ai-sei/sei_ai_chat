import React, { useState, useMemo } from "react";
import { DcaResponse, DcaBuyPoint } from "@/types/dca";
import DcaSummaryCard from "./DcaSummaryCard";
import DcaProjectionCard from "./DcaProjectionCard";
import DcaPriceChart from "./DcaPriceChart";
import DcaPortfolioChart from "./DcaPortfolioChart";

interface DcaSimulationPanelProps {
  data: DcaResponse;
  coinSymbol?: string;
  coinName?: string;
}

const DcaSimulationPanel: React.FC<DcaSimulationPanelProps> = ({
  data,
  coinSymbol = "Token",
  coinName = "Cryptocurrency",
}) => {
  const [showBuyPoints, setShowBuyPoints] = useState(false);

  // Transform raw buy points to display format
  const transformedBuyPoints = useMemo<DcaBuyPoint[]>(() => {
    return data.chartData.buy_points.map(([timestamp, price, tokens_bought]) => {
      const amount_invested = price * tokens_bought;
      return {
        timestamp,
        date: new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        price,
        tokens_bought,
        amount_invested,
      };
    });
  }, [data.chartData.buy_points]);

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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          DCA Strategy Simulation
        </h2>
        <p className="text-sm text-white/50">
          Dollar Cost Averaging analysis for {coinName}
        </p>
      </div>

      {/* Summary Card */}
      <DcaSummaryCard summary={data.summary} coinSymbol={coinSymbol} />

      {/* Projection Card */}
      <DcaProjectionCard projections={data.projections} />

      {/* Price Chart */}
      <DcaPriceChart
        prices={data.chartData.prices}
        buyPoints={data.chartData.buy_points}
      />

      {/* Portfolio Value Chart */}
      <DcaPortfolioChart
        portfolioValues={data.chartData.portfolio_values}
        totalInvestment={data.summary.total_investment}
      />

      {/* Buy Points Section */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(159,107,255,0.08),_transparent_70%)]" />
        <div className="relative z-10">
          {/* Header */}
          <div
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setShowBuyPoints(!showBuyPoints)}
          >
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Purchase History
              </p>
              <div className="px-2 py-0.5 rounded-full bg-[#7CABF9]/10 border border-[#7CABF9]/30">
                <span className="text-xs font-semibold text-[#7CABF9]">
                  {transformedBuyPoints.length} purchases
                </span>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-white/50 transition-transform ${
                showBuyPoints ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Buy Points Table */}
          {showBuyPoints && (
            <div className="border-t border-white/10">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#0A0B15] border-b border-white/10">
                    <tr>
                      <th className="text-left p-3 text-xs font-medium text-white/50 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-right p-3 text-xs font-medium text-white/50 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-right p-3 text-xs font-medium text-white/50 uppercase tracking-wider">
                        Invested
                      </th>
                      <th className="text-right p-3 text-xs font-medium text-white/50 uppercase tracking-wider">
                        Tokens
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transformedBuyPoints.map((point, index) => (
                      <tr
                        key={index}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3 text-sm text-white/80">
                          {point.date}
                        </td>
                        <td className="p-3 text-sm text-right text-white font-mono">
                          {formatPrice(point.price)}
                        </td>
                        <td className="p-3 text-sm text-right text-white/80">
                          {formatCurrency(point.amount_invested)}
                        </td>
                        <td className="p-3 text-sm text-right text-[#7CABF9] font-semibold">
                          {formatTokens(point.tokens_bought)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
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

export default DcaSimulationPanel;
