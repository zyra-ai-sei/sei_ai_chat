import { FixTypeLater } from "@/interface/common.interface";
import SpinnerIcon from "@/assets/profile/spinner.svg?react";

function Button({
  className,
  title,
  RightIcon,
  isLoading,
  isDisabled,
  onClick,
  isPrimaryBgDisabled,
  isShimmerLoaderREquired,
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
  isPrimaryBgDisabled?: boolean;
  isShimmerLoaderREquired?: boolean;
}) {
  if (isShimmerLoaderREquired && isLoading) {
    return null;
  } else {
    return (
      <button
        type="button"
        className={`${className}  px-[12px] py-[12px] min-w-[100px] flex items-center justify-center gap-x-[4px]  rounded-[90px] typo-b3-semiBold hover:bg-primary-main-600 ${
          isLoading ? "!bg-primary-main-200" : ""
        } ${
          isDisabled
            ? " text-neutral-greys-0 pointer-events-none"
            : "bg-primary-main-500 text-neutral-greys-0 "
        }  ${isDisabled && isPrimaryBgDisabled ? "bg-primary-main-500 opacity-30" : "bg-neutral-greys-200"}`}
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
}

export default Button;
