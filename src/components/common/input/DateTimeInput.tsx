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
    <div className={`flex flex-col items-start p-3  ${className}`}>
      <label htmlFor="">{title}</label>
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
