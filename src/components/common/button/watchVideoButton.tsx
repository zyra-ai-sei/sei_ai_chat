import PlayIcon from "@/assets/home/playButton.svg?react";
function WatchVideoButton({ classname }: { classname?: string }) {
  return (
    <button
      type="button"
      className={`${classname} rounded-[90px] bg-neutral-greys-950 px-[20px] py-[12px] flex items-center gap-x-[8px] text-neutral-greys-0 typo-b2-semiBold`}
    >
      <span>Watch video</span>
      <PlayIcon className="h-[20px] w-[20px]" />
    </button>
  );
}

export default WatchVideoButton;
