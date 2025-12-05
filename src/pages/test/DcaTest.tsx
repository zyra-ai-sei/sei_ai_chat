import React from "react";
import DcaSimulationPanel from "@/components/strategy/DcaSimulationPanel";
import { DcaResponse } from "@/types/dca";

const DcaTest: React.FC = () => {
  // Mock DCA data for testing
  const mockDcaData: DcaResponse = {
    summary: {
      total_investment: 300,
      buy_count: 5,
      average_buy_price: 0.1493,
      total_tokens: 2008.06,
      current_value: 278.11,
      return_pct: -0.07, // -7%
    },
    chartData: {
      prices: [
        [1704067200000, 0.15], // Jan 1, 2024
        [1704153600000, 0.148],
        [1704240000000, 0.152],
        [1704326400000, 0.145],
        [1704412800000, 0.138],
      ],
      buy_points: [
        [1704067200000, 0.15, 400.0],      // Jan 1, 2024
        [1704672000000, 0.148, 405.41],    // Jan 8, 2024
        [1705276800000, 0.152, 394.74],    // Jan 15, 2024
        [1705881600000, 0.145, 413.79],    // Jan 22, 2024
        [1706486400000, 0.138, 434.78],    // Jan 29, 2024
      ],
      portfolio_values: [
        [1704067200000, 60],
        [1704153600000, 119.6],
        [1704240000000, 182.4],
        [1704326400000, 238.5],
        [1704412800000, 278.11],
      ],
    },
    projections: {
      expected_annual_return: -0.02165, // -2.165%
      annual_volatility: 0.917, // 91.7%
      mc: {
        pct_10: 0.0035, // Bearish
        pct_50: 0.0104, // Median
        pct_90: 0.0356, // Bullish
      },
    },
  };

  // Mock data for a positive return scenario
  const mockPositiveDcaData: DcaResponse = {
    summary: {
      total_investment: 500,
      buy_count: 10,
      average_buy_price: 42.15,
      total_tokens: 11.86,
      current_value: 650.5,
      return_pct: 0.301, // +30.1%
    },
    chartData: {
      prices: [
        [1704067200000, 40],
        [1704153600000, 42],
        [1704240000000, 45],
        [1704326400000, 48],
        [1704412800000, 54.85],
      ],
      buy_points: [
        {
          date: "2024-01-01",
          price: 40.0,
          amount_invested: 50,
          tokens_bought: 1.25,
        },
        {
          date: "2024-01-03",
          price: 41.0,
          amount_invested: 50,
          tokens_bought: 1.22,
        },
        {
          date: "2024-01-05",
          price: 42.5,
          amount_invested: 50,
          tokens_bought: 1.18,
        },
        {
          date: "2024-01-07",
          price: 43.2,
          amount_invested: 50,
          tokens_bought: 1.16,
        },
        {
          date: "2024-01-09",
          price: 44.0,
          amount_invested: 50,
          tokens_bought: 1.14,
        },
        {
          date: "2024-01-11",
          price: 45.5,
          amount_invested: 50,
          tokens_bought: 1.1,
        },
        {
          date: "2024-01-13",
          price: 46.8,
          amount_invested: 50,
          tokens_bought: 1.07,
        },
        {
          date: "2024-01-15",
          price: 48.0,
          amount_invested: 50,
          tokens_bought: 1.04,
        },
        {
          date: "2024-01-17",
          price: 50.5,
          amount_invested: 50,
          tokens_bought: 0.99,
        },
        {
          date: "2024-01-19",
          price: 52.0,
          amount_invested: 50,
          tokens_bought: 0.96,
        },
      ],
      portfolio_values: [
        [1704067200000, 50],
        [1704153600000, 102],
        [1704240000000, 160],
        [1704326400000, 225],
        [1704412800000, 650.5],
      ],
    },
    projections: {
      expected_annual_return: 0.25, // +25%
      annual_volatility: 0.45, // 45%
      mc: {
        pct_10: 35.0,
        pct_50: 60.0,
        pct_90: 95.0,
      },
    },
  };

  const [selectedScenario, setSelectedScenario] = React.useState<
    "negative" | "positive"
  >("negative");

  return (
    <div className="min-h-screen bg-[#0D0C11] text-white">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#7CABF9] to-[#9F6BFF] bg-clip-text text-transparent">
            DCA Simulation Test Page
          </h1>
          <p className="text-white/60 mb-6">
            Test page for DCA (Dollar Cost Averaging) simulation components
          </p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setSelectedScenario("negative")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedScenario === "negative"
                  ? "bg-gradient-to-r from-[#7CABF9] to-[#9F6BFF] text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              Negative Return Scenario
            </button>
            <button
              onClick={() => setSelectedScenario("positive")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedScenario === "positive"
                  ? "bg-gradient-to-r from-[#2AF598] to-[#1DE087] text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              Positive Return Scenario
            </button>
          </div>
        </div>

        <div className="bg-[#121117] rounded-2xl border border-white/10 p-6">
          <DcaSimulationPanel
            data={
              selectedScenario === "negative"
                ? mockDcaData
                : mockPositiveDcaData
            }
            coinSymbol={selectedScenario === "negative" ? "SEI" : "BTC"}
            coinName={selectedScenario === "negative" ? "SEI Network" : "Bitcoin"}
          />
        </div>

        <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-bold mb-3">Test Information</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>
              <span className="text-[#7CABF9]">Negative Scenario:</span> -7%
              return with high volatility (91.7%)
            </p>
            <p>
              <span className="text-[#2AF598]">Positive Scenario:</span> +30.1%
              return with medium volatility (45%)
            </p>
            <p className="mt-4 text-xs text-white/50">
              This page demonstrates the DCA simulation UI components with mock
              data. In production, this data will come from the backend DCA
              simulation engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DcaTest;
