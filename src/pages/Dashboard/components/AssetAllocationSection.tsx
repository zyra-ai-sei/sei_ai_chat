// AssetAllocationSection - Asset allocation section with donut chart and category cards
import { AssetCategory } from "../types/dashboard.types";
import DonutChart from "./DonutChart";
import AssetCategoryCard from "./AssetCategoryCard";

interface AssetAllocationSectionProps {
  assets: AssetCategory[]; /* API data */
  totalValue: number; /* API: Total portfolio value */
}

const AssetAllocationSection = ({
  assets,
  totalValue,
}: AssetAllocationSectionProps) => {
  // Find highlighted asset (like the staked one)
  const stakedAsset = assets.find((a) => a.tag === "Staked");
  const otherAssets = assets.filter((a) => a.tag !== "Staked");

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">Asset Allocation</h2>
        <button className="text-white/60 hover:text-white transition-colors">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="4" r="1.5" fill="currentColor" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            <circle cx="10" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <DonutChart
            data={assets}
            totalValue={totalValue}
            size={200}
            strokeWidth={24}
          />
        </div>

        {/* Asset Categories Grid */}
        <div className="flex-1 flex flex-col gap-3">
          {/* First row - 3 items */}
          <div className="flex gap-3">
            {otherAssets.slice(0, 3).map((asset) => (
              <AssetCategoryCard key={asset.shortName} asset={asset} />
            ))}
          </div>

          {/* Second row - 2 items + staked */}
          <div className="flex gap-3">
            {stakedAsset && (
              <AssetCategoryCard
                asset={stakedAsset}
                variant="highlighted"
              />
            )}
            {otherAssets.slice(3, 5).map((asset) => (
              <AssetCategoryCard key={asset.shortName} asset={asset} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationSection;
