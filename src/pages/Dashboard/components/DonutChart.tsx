// DonutChart - SVG-based donut chart for asset allocation visualization
import { AssetCategory } from "../types/dashboard.types";
import { formatCurrency } from "../utils/dashboard.utils";

interface DonutChartProps {
  data: AssetCategory[]; /* API data */
  totalValue: number; /* API: Total portfolio value */
  size?: number;
  strokeWidth?: number;
}

const DonutChart = ({
  data,
  totalValue,
  size = 200,
  strokeWidth = 24,
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke dash arrays for each segment
  let cumulativePercentage = 0;
  const segments = data.map((item) => {
    const dashLength = (item.percentage / 100) * circumference;
    const dashOffset = circumference - (cumulativePercentage / 100) * circumference;
    cumulativePercentage += item.percentage;

    return {
      ...item,
      dashLength,
      dashOffset,
    };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Data segments */}
        {segments.map((segment) => (
          <circle
            key={segment.shortName}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment.dashLength} ${circumference - segment.dashLength}`}
            strokeDashoffset={segment.dashOffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${segment.color}40)`,
            }}
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white/60 text-xs uppercase tracking-wider mb-1">
          Portfolio
        </span>
        <span className="text-white font-bold text-2xl">
          {formatCurrency(totalValue)} {/* API: totalValue */}
        </span>
      </div>
    </div>
  );
};

export default DonutChart;
