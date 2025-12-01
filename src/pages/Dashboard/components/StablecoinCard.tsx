// StablecoinCard - Displays stablecoin balance with claim option
import StatCard from "./StatCard";
import { StablecoinBalance } from "../types/dashboard.types";
import { formatCurrency } from "../utils/dashboard.utils";

interface StablecoinCardProps {
  data: StablecoinBalance; /* API data */
  onClaim?: () => void;
}

const StablecoinCard = ({ data, onClaim }: StablecoinCardProps) => {
  const { balance, canClaim, claimAmount } = data;

  return (
    <StatCard title="Total portfolio value">
      <div className="flex flex-col gap-0.5">
        <p className="text-[32px] font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">
          {formatCurrency(balance)} {/* API: balance */}
        </p>
        <p className="text-xs text-white/60 drop-shadow-[0_0_8px_rgba(202,43,44,0.4)]">
          Stablecoin Balance
        </p>
      </div>
      {canClaim && ( /* API: canClaim */
        <button
          onClick={onClaim}
          className="flex items-center gap-2 px-2 pr-2.5 py-1 rounded-full border border-white/30 bg-white/[0.04] text-white text-xs drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:bg-white/[0.08] transition-colors"
        >
          Claim {claimAmount} USDC {/* API: claimAmount */}
        </button>
      )}
    </StatCard>
  );
};

export default StablecoinCard;
