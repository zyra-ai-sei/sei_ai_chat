import React from "react";
import PriceCard from "./PriceCard";
import MarketStrengthCard from "./MarketStrengthCard";
import SentimentCard from "./SentimentCard";
import FundamentalsCard from "./FundamentalsCard";
import LiquidityCard from "./LiquidityCard";

interface TokenVisualizationProps {
  data?: any; // Token data from chat.response.data_output
  chatIndex: number;
}

const TokenVisualization: React.FC<TokenVisualizationProps> = ({
  data,
  chatIndex,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Use prop data if provided, otherwise fall back to Redux
  const tokenData = data;
  const loading = data ? false : true;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full ">
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const priceChange = tokenData.market?.price_change_24h || 0;
  const isPositive = priceChange >= 0;

  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0B0F1A] p-6 transition-all hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px] transition-all group-hover:bg-blue-600/20" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-600/10 blur-[80px] transition-all group-hover:bg-purple-600/20" />
        
        <div className="relative z-10 space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 blur-lg transition-all group-hover:opacity-40" />
                <img 
                  src={tokenData.image?.large} 
                  alt={tokenData.name} 
                  className="relative h-16 w-16 rounded-full border border-white/10 bg-[#0B0F1A] p-1 shadow-2xl transition-transform group-hover:scale-110"
                />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#161B2D] shadow-xl">
                  <span className="text-[10px] font-black text-blue-400">#{tokenData.market?.market_cap_rank}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                  {tokenData.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {tokenData.symbol?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-white font-mono">
                {formatPrice(tokenData.market?.price_usd)}
              </div>
              <div className={`flex items-center justify-end gap-1.5 text-sm font-bold ${isPositive ? 'text-[#2AF598]' : 'text-[#FF5555]'}`}>
                <div className={`h-2 w-2 rounded-full ${isPositive ? 'bg-[#2AF598] shadow-[0_0_8px_#2AF598]' : 'bg-[#FF5555] shadow-[0_0_8px_#FF5555]'}`} />
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-5">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Mkt Cap</p>
              <p className="text-sm font-black text-white/90">{formatLargeNumber(tokenData.market?.market_cap)}</p>
            </div>
            <div className="space-y-1 border-x border-white/5 px-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Volume 24h</p>
              <p className="text-sm font-black text-white/90">{formatLargeNumber(tokenData.market?.volume_24h)}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Liquidity</p>
              <p className="text-sm font-black text-[#7CABF9]">{tokenData.liquidity?.top_exchange}</p>
            </div>
          </div>

          {/* New Interactive Trigger */}
          <div className="flex items-center justify-center gap-2 pt-2 transition-all">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-blue-400">
              Deep Dive Analysis
            </span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 transition-all group-hover:translate-x-1 group-hover:bg-blue-500/20">
              <svg className="h-3 w-3 text-white/40 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E1222]/50 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full" />
              <img 
                src={tokenData.image?.large} 
                alt={tokenData.name} 
                className="relative w-16 h-16 rounded-full border-2 border-white/10 shadow-2xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                  {tokenData.name}
                </h2>
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[10px] font-bold text-blue-400">RANK #{tokenData.market?.market_cap_rank}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  {tokenData.symbol?.toUpperCase()}
                </span>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-medium text-white/20 font-mono">
                  {tokenData.id}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="group relative h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
          >
            <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Price Card */}
      <PriceCard tokenData={tokenData} chatIndex={chatIndex}/>
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
