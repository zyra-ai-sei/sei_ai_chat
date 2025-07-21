import StarsIcon from "@/assets/button/stars.svg?react";
function InsightsButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      className={`${className || ""} rounded-[90px] bg-neutral-greys-300 border-[1px] border-solid border-[#8148F9] min-w-[101px]  items-center justify-center gap-x-[2px] py-[6px] hidden`}
    >
      <StarsIcon className="h-[14px] w-[11px]" />
      <span className="text-neutral-greys-950 ml-[2px]">Insights</span>{" "}
      <span className="text-neutral-greys-700 text-[9px] font-[600]">AI</span>
    </button>
  );
}

export default InsightsButton;
