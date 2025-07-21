function ViewContestButton({
  className = "",
  isFullWidth,
}: {
  className?: string;
  isFullWidth?: boolean;
}) {
  return (
    <button
      className={`px-[20px] py-[12px] rounded-[90px] ${className} ${
        isFullWidth ? "w-full" : ""
      }  border-[1px] border-solid border-primary-main-500 typo-b2-semiBold text-primary-main-500`}
    >
      Play Now
    </button>
  );
}

export default ViewContestButton;
