import React from "react";
import { CHAIN_NAMES } from "@/redux/portfolioData/defiTypes";

interface ChainDropdownProps {
  chainIds: number[];
  selectedChainId: number;
  onSelect: (chainId: number) => void;
  className?: string;
}

const CHAIN_ICONS: Record<number, string> = {
  1: "🔷", // Ethereum
  137: "🟣", // Polygon
  42161: "🔵", // Arbitrum
  8453: "🔵", // Base
  1329: "🔴", // SEI
};

const ChainDropdown: React.FC<ChainDropdownProps> = ({
  chainIds,
  selectedChainId,
  onSelect,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm appearance-none pr-8 focus:outline-none"
        value={selectedChainId}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        {chainIds.map((chainId) => (
          <option key={chainId} value={chainId}>
            {CHAIN_ICONS[chainId] || "⚪"} {CHAIN_NAMES[chainId] || `Chain ${chainId}`}
          </option>
        ))}
      </select>
      <span className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-white/60">▼</span>
    </div>
  );
};

export default ChainDropdown;
