import coinIcon from "@/assets/header/coin.png";
import { useAppSelector } from "@/hooks/useRedux";

import DashboardDownArrow from "@/assets/header/dashboardDownArrow.svg?react";
import { chaquenPointsFormat } from "@/utility/stringFormat";

function CoinButton() {
  const chaquenPointsData = useAppSelector(
    (state) => state?.chaquenPointsData?.data
  );

  return (
    <button
      className="flex rounded-[90px] border-[1px] border-solid border-neutral-greys-300 px-[12px] py-[11px] typo-b3-regular text-neutral-greys-950  items-center gap-x-[8px]"
      type="button"
    >
      <img className="h-[24px] w-[24px]" alt="" src={coinIcon} />
      <p>{chaquenPointsFormat(chaquenPointsData?.totalBalance)}</p>
      <DashboardDownArrow
        className="h-[24px] w-[24px]
      "
      />
    </button>
  );
}

export default CoinButton;
