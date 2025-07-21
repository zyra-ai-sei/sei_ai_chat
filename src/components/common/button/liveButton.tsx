function LiveButton({
  className,
  title,
  timer,
}: {
  className?: string;
  title: string;
  timer?: string;
}) {
  return (
    <button
      type="button"
      className={`rounded-[90px] border-[1px] border-solid border-system-success-500 bg-system-success-50 py-[12px] px-[16px] flex items-center gap-x-[8px] text-neutral-greys-700 text-[12px] font-[400]  ${className}`}
    >
      <span className="h-[8px] w-[8px] rounded-[50%] bg-system-success-500 animate-pulse" />{" "}
      <span>{title}</span>
      {timer && (
        <span className="text-system-success-500 text-[14px] font-[600]">
          {timer}
        </span>
      )}
    </button>
  );
}

export default LiveButton;
