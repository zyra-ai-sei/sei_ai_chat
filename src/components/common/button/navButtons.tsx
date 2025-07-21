import { Link } from "react-router-dom";

function NavButtons({
  className = "",
  isActive,
  title,
  isDisabled,
  isAnchor,
  to,
  ...otherProps
}: {
  title: string;
  className?: string;
  isActive?: boolean;

  isDisabled?: boolean;
  to: string;
  isAnchor?: boolean;
}) {
  if (isAnchor) {
    return (
      <div
        className={` ${className}   py-[16px] ${
          isActive
            ? "bg-primary-main-500 text0-neutral-greys-0 typo-b1-semiBold rounded-[180px] px-[32px]"
            : "bg-neutral-greys-0 text-neutral-greys-500 typo-b1-regular"
        }`}
        {...otherProps}
      >
        <span>{title}</span>
        {isDisabled && !isActive && (
          <span className="rounded-[120px] bg-primary-mian-200 px-[4px] py-[4px] text-neutral-greys-950 text-[10px] font-[400] bg-primary-main-200 ml-[4px]">
            Coming soon
          </span>
        )}
      </div>
    );
  } else {
    return (
      <Link
        to={to}
        className={` ${className}   py-[16px] ${
          isActive
            ? "bg-primary-main-500 text0-neutral-greys-0 typo-b1-semiBold rounded-[180px] px-[32px]"
            : "bg-neutral-greys-0 text-neutral-greys-500 typo-b1-regular"
        }`}
        {...otherProps}
      >
        <span>{title}</span>
        {isDisabled && !isActive && (
          <span className="rounded-[120px] bg-primary-mian-200 px-[4px] py-[4px] text-neutral-greys-950 text-[10px] font-[400] bg-primary-main-200 ml-[4px]">
            Coming soon
          </span>
        )}
      </Link>
    );
  }
}

export default NavButtons;
