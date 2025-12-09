import React, { useState } from "react";
import LumpSumSimulationPanel from "@/components/strategy/LumpSumSimulationPanel";
import { LumpSumResponse } from "@/types/lumpsum";

const LumpSumTest: React.FC = () => {
  const [scenario, setScenario] = useState<"negative" | "positive">("negative");

  const mockNegativeData: LumpSumResponse = {
    summary: {
      total_investment: 300,
      buy_price: 0.18,
      tokens_bought: 1666.67,
      current_value: 220.07,
      return_pct: -0.2664,
    },
    chartData: {
      prices: [
        [1640995200000, 0.18],
        [1641081600000, 0.175],
        [1641168000000, 0.17],
        [1641254400000, 0.165],
        [1641340800000, 0.16],
        [1641427200000, 0.155],
        [1641513600000, 0.15],
        [1641600000000, 0.145],
        [1641686400000, 0.14],
        [1641772800000, 0.135],
        [1641859200000, 0.132],
      ],
      buy_point: [[1640995200000, 0.18]],
      portfolio_values: [
        [1640995200000, 300],
        [1641081600000, 291.67],
        [1641168000000, 283.33],
        [1641254400000, 275],
        [1641340800000, 266.67],
        [1641427200000, 258.33],
        [1641513600000, 250],
        [1641600000000, 241.67],
        [1641686400000, 233.33],
        [1641772800000, 225],
        [1641859200000, 220.07],
      ],
    },
    projections: {
      expected_annual_return: -0.0376,
      annual_volatility: 0.83,
      pct_10_value: 45.12,
      pct_50_value: 130.44,
      pct_90_value: 389.11,
      paths: 1000,
      horizon_days: 365,
    },
  };

  const mockPositiveData: LumpSumResponse = {
    summary: {
      total_investment: 500,
      buy_price: 0.12,
      tokens_bought: 4166.67,
      current_value: 650.5,
      return_pct: 0.301,
    },
    chartData: {
      prices: [
        [1640995200000, 0.12],
        [1641081600000, 0.125],
        [1641168000000, 0.13],
        [1641254400000, 0.135],
        [1641340800000, 0.14],
        [1641427200000, 0.142],
        [1641513600000, 0.145],
        [1641600000000, 0.148],
        [1641686400000, 0.15],
        [1641772800000, 0.155],
        [1641859200000, 0.1562],
      ],
      buy_point: [[1640995200000, 0.12]],
      portfolio_values: [
        [1640995200000, 500],
        [1641081600000, 520.83],
        [1641168000000, 541.67],
        [1641254400000, 562.5],
        [1641340800000, 583.33],
        [1641427200000, 591.67],
        [1641513600000, 604.17],
        [1641600000000, 616.67],
        [1641686400000, 625],
        [1641772800000, 645.83],
        [1641859200000, 650.5],
      ],
    },
    projections: {
      expected_annual_return: 0.245,
      annual_volatility: 0.45,
      pct_10_value: 320.5,
      pct_50_value: 780.25,
      pct_90_value: 1840.75,
      paths: 1000,
      horizon_days: 365,
    },
  };

  const currentData = scenario === "negative" ? mockNegativeData : mockPositiveData;

  return (
    <div className="min-h-screen bg-[#0D0C11] flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white mb-4">
          Lump Sum Strategy Test Page
        </h1>
        <p className="text-white/60 mb-6">
          Test the Lump Sum simulation UI components with mock data
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setScenario("negative")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              scenario === "negative"
                ? "bg-[#FF5555] text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            Negative Return (-26.6%)
          </button>
          <button
            onClick={() => setScenario("positive")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              scenario === "positive"
                ? "bg-[#2AF598] text-[#0D0C11]"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            Positive Return (+30.1%)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <LumpSumSimulationPanel
          data={currentData}
          coinSymbol={scenario === "negative" ? "SEI" : "BTC"}
          coinName={scenario === "negative" ? "SEI Network" : "Bitcoin"}
        />
      </div>
    </div>
  );
};

export default LumpSumTest;
