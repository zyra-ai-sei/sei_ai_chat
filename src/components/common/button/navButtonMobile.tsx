import { Link } from "react-router-dom";

function NavButtonMobile({
  className = "",
  isActive,
  title,

  isAnchor,
  to,

  Icon,
  isDisabled,
  ...otherProps
}: {
  title: string;
  className?: string;
  isActive?: boolean;

  to: string;
  isAnchor?: boolean;
  Icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  isDisabled?: boolean;
}) {
  if (isAnchor) {
    return (
      <div
        className={` ${className} min-w-[60px]  flex flex-col items-center justify-center gap-y-[4px]  py-[12px] ${isActive ? "text-primary-main-500" : "text-neutral-greys-500"} typo-c1-regular ${isDisabled ? "pointer-events-none" : ""}`}
        {...otherProps}
      >
        <Icon className="h-[24px] w-[24px] " />
        <span>{title}</span>
      </div>
    );
  } else {
    return (
      <Link
        to={to}
        className={` ${className} min-w-[60px]  flex flex-col items-center justify-center gap-y-[4px]  py-[12px] ${isActive ? "text-primary-main-500" : "text-neutral-greys-500"} typo-c1-regular  ${isDisabled ? "pointer-events-none" : ""}`}
        {...otherProps}
      >
        <Icon className="h-[24px] w-[24px] " />
        <span>{title}</span>
      </Link>
    );
  }
}

export default NavButtonMobile;
