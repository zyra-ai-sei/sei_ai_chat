import { DefiChainSummary, DefiProtocol, DefiToken } from "@/redux/portfolioData/defiTypes";
import { AssetCategory } from "../types/dashboard.types";

// Generate AssetCategory[] for asset allocation donut from DeFi chain summary
export function defiToAssetCategories(summary: DefiChainSummary): AssetCategory[] {
  // Aggregate tokens by symbol for the chain
  const tokenMap = new Map<string, { value: number; name: string; color: string; symbol: string; description: string }>();
  let total = 0;
  summary.protocols.forEach((protocol) => {
    protocol.position?.tokens?.forEach((token) => {
      if (typeof token.usd_value === "number" && token.usd_value > 0) {
        total += token.usd_value;
        const key = token.symbol;
        if (!tokenMap.has(key)) {
          tokenMap.set(key, {
            value: token.usd_value,
            name: token.name,
            color: stringToColor(token.symbol),
            symbol: token.symbol,
            description: protocol.protocol_name,
          });
        } else {
          const entry = tokenMap.get(key)!;
          entry.value += token.usd_value;
        }
      }
    });
  });
  // Convert to AssetCategory[]
  return Array.from(tokenMap.values()).map((entry) => ({
    id: entry.symbol,
    shortName: entry.symbol.slice(0, 2).toUpperCase(),
    name: entry.name,
    tag: entry.symbol,
    color: entry.color,
    value: entry.value,
    percentage: total > 0 ? (entry.value / total) * 100 : 0,
    description: entry.description,
  }));
}

// Utility: deterministic color from string
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}
