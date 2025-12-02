import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import PriceCard from "./PriceCard";
import MarketStrengthCard from "./MarketStrengthCard";
import SentimentCard from "./SentimentCard";
import FundamentalsCard from "./FundamentalsCard";
import LiquidityCard from "./LiquidityCard";

interface TokenVisualizationProps {
  data?: any; // Token data from chat.response.data_output
}

const TokenVisualization: React.FC<TokenVisualizationProps> = ({ data }) => {
  const { currentToken, isLoading } = useAppSelector(
    (state) => state.tokenVisualization
  );

  // Use prop data if provided, otherwise fall back to Redux
  const tokenData = data || currentToken;
  const loading = data ? false : isLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7CABF9]/30 border-t-[#7CABF9] rounded-full animate-spin" />
          <p className="text-sm text-white/50">Loading token data...</p>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Price Card */}
      <PriceCard token={tokenData} />
      {/* Market Strength Card */}
      <MarketStrengthCard token={tokenData} />
      {/* Sentiment Card */}
      <SentimentCard token={tokenData} />
      {/* Fundamentals Card */}
      <FundamentalsCard token={tokenData} />
      {/* Liquidity Card */}
      <LiquidityCard token={tokenData} />
    </div>
  );
};

export default TokenVisualization;
