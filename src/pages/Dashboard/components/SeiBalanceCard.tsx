// SeiBalanceCard - Displays SEI token balance with USD conversion
import StatCard from "./StatCard";
import { SeiBalance } from "../types/dashboard.types";
import { formatCurrency, formatTokenBalance } from "../utils/dashboard.utils";

interface SeiBalanceCardProps {
  data: SeiBalance; /* API data */
}

const SeiBalanceCard = ({ data }: SeiBalanceCardProps) => {
  const { balance, symbol, usdValue, price } = data;

  return (
    <StatCard title="SEI Balance">
      <p className="text-[32px] font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">
        {formatTokenBalance(balance, symbol)} {/* API: balance */}
      </p>
      <div className="text-xs text-white/60 text-right leading-4">
        <p>{formatCurrency(usdValue)} USD</p> {/* API: usdValue */}
        <p>Price: {formatCurrency(price)}</p> {/* API: price */}
      </div>
    </StatCard>
  );
};

export default SeiBalanceCard;
