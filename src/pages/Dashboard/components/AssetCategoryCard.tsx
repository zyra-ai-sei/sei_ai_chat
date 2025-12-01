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
      className={`flex-1 bg-white/[0.04] rounded-xl p-4 flex items-center gap-2 ${
        variant === "highlighted" ? "border border-white/[0.24]" : ""
      }`}
    >
      {/* Color Badge */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: color }}
      >
        <span className="text-white font-semibold text-xl">{shortName}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-base">{name}</span>
            <span className="px-2 py-1 rounded-full border border-white/30 bg-white/[0.04] text-white text-[10px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              {tag}
            </span>
          </div>
          <span className="text-white font-semibold text-sm">
            {formatCurrency(value)} {/* API: value */}
          </span>
        </div>

        {/* Description Row */}
        <div className="flex items-start justify-between text-xs text-white/60">
          <span className="truncate pr-4">{description}</span>
          <span className="shrink-0">{formatPercentage(percentage)}</span> {/* API: percentage */}
        </div>
      </div>
    </div>
  );
};

export default AssetCategoryCard;
