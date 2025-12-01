// TimePeriodToggle - Time period selector for charts
import { TimePeriod } from "../types/dashboard.types";
import { TIME_PERIODS } from "../constants/dashboard.constants";

interface TimePeriodToggleProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const TimePeriodToggle = ({
  selectedPeriod,
  onPeriodChange,
}: TimePeriodToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1">
      {TIME_PERIODS.map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedPeriod === period
              ? "bg-white/20 text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default TimePeriodToggle;
