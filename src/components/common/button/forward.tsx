import ForwardSlier from "@/assets/common/forwardSlider.svg?react";

function Forward({
  className = "",
  isDisabled,
  onClick,
}: {
  className?: string;
  isDisabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`${className} rounded-[90px]  px-[12px] py-[12px] flex items-center justify-center ${isDisabled ? "bg-neutral-greys-100 pointer-events-none" : "bg-neutral-greys-200"}`}
      disabled={isDisabled}
      onClick={() => onClick?.()}
    >
      <ForwardSlier className="h-[20px] w-[20px]" />
    </button>
  );
}

export default Forward;
