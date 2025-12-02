// YieldPerformanceChart - Yield performance chart with prediction line
import { YieldPerformanceData } from "../types/dashboard.types";

interface YieldPerformanceChartProps {
  data: YieldPerformanceData[]; /* API data */
}

const YieldPerformanceChart = ({ data }: YieldPerformanceChartProps) => {
  // Calculate chart dimensions
  const chartHeight = 200;
  const maxValue = Math.max(...data.map((d) => Math.max(d.predicted, d.actual || 0)));
  const minValue = 0;
  const valueRange = maxValue - minValue;

  // Generate path for predicted line
  const generatePath = (
    values: number[],
    width: number,
    height: number
  ): string => {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - minValue) / valueRange) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const predictedValues = data.map((d) => d.predicted);
  const actualValues = data.map((d) => d.actual || 0);

  // Y-axis labels
  const yLabels = [
    maxValue,
    maxValue * 0.75,
    maxValue * 0.5,
    maxValue * 0.25,
    0,
  ];

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">DeFi Yield Performance</h2>
      </div>

      <div className="flex gap-4">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-right text-xs text-white/40 py-1">
          {yLabels.map((label, index) => (
            <span key={index}>${label.toLocaleString()}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 400 ${chartHeight}`}
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={index}
                x1="0"
                y1={chartHeight * ratio}
                x2="400"
                y2={chartHeight * ratio}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Predicted line - gradient */}
            <defs>
              <linearGradient
                id="predictedGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#2AF598" />
                <stop offset="100%" stopColor="#009EFD" />
              </linearGradient>
              <linearGradient
                id="areaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2AF598" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2AF598" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill under predicted line */}
            <path
              d={`${generatePath(predictedValues, 400, chartHeight)} L 400,${chartHeight} L 0,${chartHeight} Z`}
              fill="url(#areaGradient)"
            />

            {/* Predicted line */}
            <path
              d={generatePath(predictedValues, 400, chartHeight)}
              stroke="url(#predictedGradient)"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(42,245,152,0.4)]"
            />

            {/* Actual line (dashed where it exists) */}
            {actualValues.some((v) => v > 0) && (
              <path
                d={generatePath(
                  actualValues.filter((v) => v > 0),
                  (400 * actualValues.filter((v) => v > 0).length) /
                    actualValues.length,
                  chartHeight
                )}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
            )}

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y =
                chartHeight -
                ((point.predicted - minValue) / valueRange) * chartHeight;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#0a0d14"
                  stroke="url(#predictedGradient)"
                  strokeWidth="1"
                  className="hover:r-2 transition-all cursor-pointer"
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-white/40">
            {data
              .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
              .map((point, index) => (
                <span key={index}>{point.month}</span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldPerformanceChart;
