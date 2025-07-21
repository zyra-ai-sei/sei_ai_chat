import FilterIcon from "@/assets/home/filter.svg?react";
import DownArrow from "@/assets/header/downArrow.svg?react";

function TeamsButton({
  className = "",
  onClick,
  isDropDownOpened,
  title,
}: {
  className?: string;
  onClick?: () => void;
  isDropDownOpened?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={`${className} flex items-center py-[14px] px-[18px] rounded-[90px] bg-neutral-greys-300 text-neutral-greys-950 typo-b3-regular `}
      onClick={() => onClick?.()}
    >
      <FilterIcon className="h-[18px] w-[18px]" />
      <span className="ml-[4px] pr-[8px]"> {title || "All"} </span>
      <DownArrow
        className={`h-[18px] w-[18px]  ${isDropDownOpened ? "rotate-180" : "rotate-0"}`}
      />
    </button>
  );
}

export default TeamsButton;
