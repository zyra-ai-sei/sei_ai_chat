import { FixTypeLater } from "@/interface/common.interface";
import SpinnerIcon from "@/assets/profile/spinner.svg?react";

function SecondaryButton({
  className,
  title,
  RightIcon,
  isLoading,
  isDisabled,
  onClick,
}: {
  className?: string;
  title: string | React.ReactNode;
  RightIcon?:
    | React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & {
          title?: string | undefined;
        }
      >
    | FixTypeLater;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`${className}  px-[11px] py-[12px]  flex items-center justify-center gap-x-[4px]  rounded-[90px] typo-b3-semiBold hover:bg-neutral-greys-400 ${
        isLoading ? "!bg-neutral-greys-200" : ""
      } ${
        isDisabled
          ? " text-neutral-greys-900 pointer-events-none bg-neutral-greys-200 opacity-70"
          : "bg-neutral-greys-300 text-neutral-greys-950 "
      } `}
      disabled={isDisabled || isLoading}
      onClick={() => onClick?.()}
    >
      {isLoading && (
        <SpinnerIcon className="h-[24px] w-[24px] animate-spin ml-[10px]" />
      )}
      <span className=""> {title}</span>
      {RightIcon && (
        <span>
          <RightIcon />
        </span>
      )}
    </button>
  );
}

export default SecondaryButton;
