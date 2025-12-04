import { DefiChainSummary } from "@/redux/portfolioData/defiTypes";
import { AssetCategory } from "../types/dashboard.types";

// Generate AssetCategory[] for asset allocation donut from DeFi chain summary
export function defiToAssetCategories(summary: DefiChainSummary): AssetCategory[] {
  // Color palette - exactly 4 colors as specified
  const colorPalette = ['#D570F4', '#6182FB', '#8A5BF1', '#33EC8A'];
  
  // Aggregate tokens by symbol for the chain
  const tokenMap = new Map<string, { value: number; name: string; symbol: string; description: string }>();
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
  
  // Convert to array and sort by value (descending)
  const allAssets = Array.from(tokenMap.values()).map((entry) => ({
    id: entry.symbol,
    shortName: entry.symbol.slice(0, 2).toUpperCase(),
    name: entry.name,
    tag: entry.symbol,
    color: '', // Will be assigned below
    value: entry.value,
    percentage: total > 0 ? (entry.value / total) * 100 : 0,
    description: entry.description,
  })).sort((a, b) => b.value - a.value);

  // Take top 3 assets
  const topAssets = allAssets.slice(0, 3);
  const otherAssets = allAssets.slice(3);
  
  // Create "Others" category if there are more than 3 assets
  const categories: AssetCategory[] = [...topAssets];
  
  if (otherAssets.length > 0) {
    const othersValue = otherAssets.reduce((sum, asset) => sum + asset.value, 0);
    categories.push({
      id: 'others',
      shortName: 'OT',
      name: 'Others',
      tag: 'OTHERS',
      color: '', // Will be assigned below
      value: othersValue,
      percentage: total > 0 ? (othersValue / total) * 100 : 0,
      description: `${otherAssets.length} other assets combined`,
    });
  }

  // Assign colors to the final 4 (or fewer) categories
  return categories.map((category, index) => ({
    ...category,
    color: colorPalette[index % colorPalette.length],
  }));
}


