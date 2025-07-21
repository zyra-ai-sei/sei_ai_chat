import ExternalIcon from "@/assets/button/external.svg?react";
import { Link } from "react-router-dom";

function ExternalButton({
  className,
  title,
  to,
}: {
  className?: string;
  title?: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className={`${className} bg-transparent flex items-center gap-x-[8px] typo-b2-semibold hover:opacity-75 text-primary-main-500`}
      type="button"
    >
      <span>{title}</span>
      <ExternalIcon className="h-[20px] w-[20px]" />
    </Link>
  );
}

export default ExternalButton;
