function StepProgressbar({ fillNumber }: { fillNumber: number }) {
  return (
    <div className="flex items-center gap-x-[10px]">
      <span
        className={`w-[26px] h-[8px] rounded-[900px] ${fillNumber > 0 ? "bg-primary-main-500" : "bg-neutral-greys-300"}`}
      />
      <span
        className={`w-[26px] h-[8px] rounded-[900px] ${fillNumber > 1 ? "bg-primary-main-500" : "bg-neutral-greys-300"}`}
      />

      <span
        className={`w-[26px] h-[8px] rounded-[900px] ${fillNumber > 2 ? "bg-primary-main-500" : "bg-neutral-greys-300"}`}
      />
    </div>
  );
}

export default StepProgressbar;
