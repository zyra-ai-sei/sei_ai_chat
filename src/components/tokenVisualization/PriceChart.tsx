import React, { useMemo } from "react";

interface PriceChartProps {
  data: [number, number][]; // [timestamp, price]
  change24h: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, change24h }) => {
  const { points, minPrice, maxPrice, priceRange } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: "", minPrice: 0, maxPrice: 0, priceRange: 0 };
    }

    // Get price values
    const prices = data.map(([_, price]) => price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;

    // Chart dimensions - responsive
    const width = 1000;
    const height = 400;
    const padding = 10;

    // Create SVG path points
    const pathPoints = data
      .map(([_, price], index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y =
          height -
          padding -
          ((price - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

    return {
      points: pathPoints,
      minPrice: min,
      maxPrice: max,
      priceRange: range,
    };
  }, [data]);

  const chartColor = change24h >= 0 ? "#10b981" : "#ef4444"; // emerald-500 or rose-500
  const gradientId = `gradient-${change24h >= 0 ? "up" : "down"}`;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full text-xs text-white/40">
        No chart data available
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <style>
        {`
          @keyframes drawLine {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: chartColor, stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: chartColor, stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>

        {/* Area under the line */}
        <polygon
          points={`10,400 ${points} 990,400`}
          fill={`url(#${gradientId})`}
          style={{
            animation: "fadeIn 2s ease-out",
          }}
        />

        {/* Price line */}
        <polyline
          points={points}
          fill="none"
          stroke={chartColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2000"
          strokeDashoffset="2000"
          style={{
            filter: `drop-shadow(0 0 8px ${chartColor}40)`,
            animation: "drawLine 2s ease-out forwards",
          }}
        />

        {/* Dots on the line (first, middle, last) */}
        {[0, Math.floor(data.length / 2), data.length - 1].map((idx) => {
          const [_, price] = data[idx];
          const x = (idx / (data.length - 1)) * 980 + 10;
          const y = 390 - ((price - minPrice) / priceRange) * 380;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="6"
              fill={chartColor}
              stroke="rgba(5,6,14,0.8)"
              strokeWidth="3"
              style={{
                animation: "fadeIn 2s ease-out",
              }}
            />
          );
        })}
      </svg>

      {/* Min/Max price labels */}
      <div className="absolute top-0 right-0 text-[10px] text-white/40">
        ${maxPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
      <div className="absolute bottom-0 right-0 text-[10px] text-white/40">
        ${minPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
};

export default PriceChart;
