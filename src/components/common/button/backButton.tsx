import LeftArrowIcon from "@/assets/header/leftArrow.svg?react";

function BackButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`rounded-[90px] py-[4px] md:py-[8px] px-[12px] bg-neutral-greys-300 ${className}`}
      onClick={() => onClick?.()}
    >
      <LeftArrowIcon className="h-[24px] w-[24px] text-neutral-greys-950" />
    </button>
  );
}

export default BackButton;
