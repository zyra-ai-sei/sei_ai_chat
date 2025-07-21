import DownIcon from "@/assets/header/downArrow.svg?react";

function SportSelectButton() {
  return (
    <button
      className="rounded-[90px] bg-neutral-greys-200 flex items-center py-[14px] px-[16px] typo-b2-semiBold gap-x-[8px]"
      type="button"
    >
      <p>
        <span className="text-neutral-greys-500">Sport/ </span>{" "}
        <span className="text-neutral-greys-950">Cricket</span>
      </p>
      <DownIcon className="text-neutral-greys-950" />
    </button>
  );
}

export default SportSelectButton;
