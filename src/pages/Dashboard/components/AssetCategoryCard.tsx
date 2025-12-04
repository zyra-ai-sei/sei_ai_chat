// AssetCategoryCard - Individual asset category card in the allocation section
import { AssetCategory } from "../types/dashboard.types";
import { formatCurrency, formatPercentage } from "../utils/dashboard.utils";

interface AssetCategoryCardProps {
  asset: AssetCategory; /* API data */
  variant?: "highlighted" | "default";
}

const AssetCategoryCard = ({
  asset,
  variant = "default",
}: AssetCategoryCardProps) => {
  const { shortName, name, tag, color, value, percentage, description } = asset;

  return (
    <div
      className={`flex-1 rounded-xl p-4 flex bg-[#212025] items-center gap-2 ${
        variant === "highlighted" ? "border border-white/[0.24]" : ""
      }`}
      // style={{background:'rgba(255, 255, 255, 0.04);'}}
    >
      {/* Color Badge */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      >
        <span className="text-xl font-semibold text-white">{shortName}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-white">{name}</span>
            <span className="px-2 py-1 rounded-full border border-white/30 bg-white/[0.04] text-white text-[10px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              {tag}
            </span>
          </div>
          <span className="text-sm font-semibold text-white">
            {formatCurrency(value)} {/* API: value */}
          </span>
        </div>

        {/* Description Row */}
        <div className="flex items-start justify-between text-xs text-white/60">
          <span className="pr-4 truncate">{description}</span>
          <span className="shrink-0">{formatPercentage(percentage)}</span> {/* API: percentage */}
        </div>
      </div>
    </div>
  );
};

export default AssetCategoryCard;
