const TextInput = ({
  title,
  val,
  onChange,
  disabled = false,
  className = "",
}: {
  title: string;
  val: string;
  onChange: any;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <div className={`flex w-full flex-col gap-2 p-3 ${className}`}>
      <label className="text-[11px] uppercase tracking-[0.35em] text-white/40">
        {title}
      </label>
      <div className="relative w-full">
        <input
          disabled={disabled}
          type="text"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className={`peer w-full rounded-2xl border border-white/15 bg-[#05060f]/60 px-4 py-3 text-sm font-medium text-white/80 outline-none transition placeholder:text-white/30 focus:border-white/50 focus:bg-[#090b18]/70 ${
            disabled ? "cursor-not-allowed text-white/40" : ""
          }`}
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/40 opacity-0 blur-md transition peer-focus:opacity-60" />
      </div>
    </div>
  );
};

export default TextInput;