import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import PriceCard from "./PriceCard";
import MarketStrengthCard from "./MarketStrengthCard";
import SentimentCard from "./SentimentCard";
import FundamentalsCard from "./FundamentalsCard";
import DeveloperActivityCard from "./DeveloperActivityCard";
import LiquidityCard from "./LiquidityCard";

const TokenVisualization: React.FC = () => {
  const { currentToken, isLoading } = useAppSelector(
    (state) => state.tokenVisualization
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7CABF9]/30 border-t-[#7CABF9] rounded-full animate-spin" />
          <p className="text-sm text-white/50">Loading token data...</p>
        </div>
      </div>
    );
  }

  if (!currentToken) {
    return null;
  }

  return (
    <div className="w-full h-full space-y-6">
      {/* Price Card takes full height */}
      {/* Other cards below - accessible by scrolling */}
        <PriceCard token={currentToken} />
      <MarketStrengthCard token={currentToken} />
      <SentimentCard token={currentToken} />
      <FundamentalsCard token={currentToken} />
      <DeveloperActivityCard token={currentToken} />
      <LiquidityCard token={currentToken} />
    </div>
  );
};

export default TokenVisualization;
