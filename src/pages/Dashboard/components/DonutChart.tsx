// DonutChart - SVG-based donut chart for asset allocation visualization
import { useState } from "react";
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
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Add small gaps between segments (2% of total circumference)
  const gapPercentage = 1; // 1% gap between each segment
  const totalGaps = data.length * gapPercentage;
  const availablePercentage = 100 - totalGaps;

  // Calculate stroke dash arrays for each segment with gaps
  let cumulativePercentage = 0;
  const segments = data.map((item, index) => {
    // Adjust percentage to account for gaps
    const adjustedPercentage = (item.percentage / 100) * availablePercentage;
    const dashLength = (adjustedPercentage / 100) * circumference;
    
    // Add gap before this segment (except for the first one)
    const gapOffset = index * gapPercentage;
    const dashOffset = circumference - ((cumulativePercentage + gapOffset) / 100) * circumference;
    
    cumulativePercentage += adjustedPercentage;

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
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Data segments */}
        {segments.map((segment) => (
          <circle
            key={segment.id}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={hoveredSegment === segment.id ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${segment.dashLength} ${circumference - segment.dashLength}`}
            strokeDashoffset={segment.dashOffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out cursor-pointer"
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
            style={{
              filter: hoveredSegment === segment.id 
                ? `drop-shadow(0 0 12px ${segment.color}80)` 
                : `drop-shadow(0 0 6px ${segment.color}40)`,
              opacity: hoveredSegment && hoveredSegment !== segment.id ? 0.6 : 0.9,
            }}
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mb-1 text-xs tracking-wider uppercase text-white/60">
          {hoveredSegment ? 
            segments.find(s => s.id === hoveredSegment)?.name || "Portfolio"
            : "Portfolio"
          }
        </span>
        <span className="text-2xl font-bold text-white">
          {hoveredSegment ? 
            formatCurrency(segments.find(s => s.id === hoveredSegment)?.value || 0)
            : formatCurrency(totalValue)
          }
        </span>
        {hoveredSegment && (
          <span className="mt-1 text-xs text-white/70">
            {((segments.find(s => s.id === hoveredSegment)?.percentage || 0)).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
