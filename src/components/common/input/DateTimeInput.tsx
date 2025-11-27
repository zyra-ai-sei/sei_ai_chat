import { Calendar24 } from "../calendar";

const DateTimeInput = ({
  title,
  val,
  onChange,
  className = "",
}: {
  title: string;
  val: string;
  onChange: any;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col items-start gap-2 p-3 ${className}`}>
      <label className="text-[11px] uppercase tracking-[0.35em] text-white/40">{title}</label>
      <Calendar24
        epoch={parseInt(val) || undefined}
        onEpochChange={(newEpoch) =>
          onChange(newEpoch.toString())
        }
      />
    </div>
  );
};

export default DateTimeInput;
