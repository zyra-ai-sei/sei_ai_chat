import CupIcon from "@/assets/button/cup.svg?react";
import RightIcon from "@/assets/button/rightArrow.svg?react";

function LeaderBoardButton({
  className,
  onCLick,
  rank,
  isStarted = false,
  title,
  isCupIconDisplay,
  isRightIconDisplay,
}: {
  title: string;
  className?: string;
  onCLick?: () => void;
  rank?: number;
  isStarted?: boolean;
  isCupIconDisplay?: boolean;
  isRightIconDisplay?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${className} py-[10px] md:px-[12px] px-[12px] flex items-center ${isRightIconDisplay ? "justify-between" : "justify-center"}  md:min-w-[249px] text-neutral-greys-900 bg-neutral-greys-300 rounded-[90px] `}
      onClick={() => onCLick?.()}
    >
      <div className="flex items-center md:gap-[8px] gap-[4px]">
        {isCupIconDisplay && (
          <CupIcon className="md:h-[24px] md:w-[24px] h-[20px] w-[20px]" />
        )}
        <div className="">
          <p className="typo-b3-semiBold  text-start">{title}</p>
          {rank || rank === 0 ? (
            <p className="typo-c1-regular text-start">
              Your Rank: {isStarted ? rank : "-"}
            </p>
          ) : null}
        </div>
      </div>
      {isRightIconDisplay && <RightIcon className="h-[24px] w-[24px]" />}
    </button>
  );
}

export default LeaderBoardButton;
