import React, { useMemo, useState, useRef, useCallback } from "react";

interface PriceChartProps {
  data: [number, number, number][]; // [timestamp, price, marketCap]
  change24h: number;
  dataType: "price" | "marketCap"; // Toggle between price and market cap
}

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  change24h,
  dataType,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    value: number;
    timestamp: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { points, minValue, maxValue, dataPoints } = useMemo(() => {
    if (!data || data.length === 0) {
      console.log('[PriceChart] No data provided');
      return {
        points: "",
        minValue: 0,
        maxValue: 0,
        valueRange: 0,
        dataPoints: [],
      };
    }

    console.log('[PriceChart] Processing data:', {
      dataLength: data.length,
      dataType,
      firstPoint: data[0],
      lastPoint: data[data.length - 1]
    });

    // Get values based on dataType
    const values = data.map(([_, price, marketCap]) =>
      dataType === "price" ? price : marketCap
    );

    // Filter out invalid values (NaN, Infinity, null, undefined)
    const validValues = values.filter(v => typeof v === 'number' && isFinite(v));

    if (validValues.length === 0) {
      console.error('[PriceChart] No valid values found in data');
      return {
        points: "",
        minValue: 0,
        maxValue: 0,
        valueRange: 0,
        dataPoints: [],
      };
    }

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const range = max - min;

    console.log('[PriceChart] Value range:', { min, max, range });

    // Chart dimensions - responsive
    const width = 1000;
    const height = 400;
    const padding = 10;

    // Create SVG path points and store data points for hover
    const points: Array<{ x: number; y: number; value: number; timestamp: number }> = [];
    const pathPoints = data
      .map(([timestamp, price, marketCap], index) => {
        const value = dataType === "price" ? price : marketCap;

        // Handle invalid values
        if (typeof value !== 'number' || !isFinite(value)) {
          console.warn('[PriceChart] Invalid value at index', index, value);
          return null;
        }

        // Handle single data point case
        const x = data.length === 1
          ? width / 2
          : (index / (data.length - 1)) * (width - padding * 2) + padding;

        // Handle zero range case
        const y = range === 0
          ? height / 2
          : height - padding - ((value - min) / range) * (height - padding * 2);

        points.push({ x, y, value, timestamp });
        return `${x},${y}`;
      })
      .filter(p => p !== null)
      .join(" ");

    console.log('[PriceChart] Generated path points:', pathPoints.substring(0, 100) + '...');

    return {
      points: pathPoints,
      minValue: min,
      maxValue: max,
      valueRange: range,
      dataPoints: points,
    };
  }, [data, dataType]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || dataPoints.length === 0) return;

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 1000;

      // Find the closest point
      let closestPoint = dataPoints[0];
      let minDistance = Math.abs(mouseX - closestPoint.x);

      for (const point of dataPoints) {
        const distance = Math.abs(mouseX - point.x);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = point;
        }
      }

      setHoveredPoint(closestPoint);
    },
    [dataPoints]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  const formatValue = (value: number) => {
    if (dataType === "price") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2,
      }).format(value);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(value);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const chartColor = change24h >= 0 ? "#10b981" : "#ef4444"; // emerald-500 or rose-500
  const gradientId = `gradient-${change24h >= 0 ? "up" : "down"}-${dataType}`;

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
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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

        {/* Hover indicator line */}
        {hoveredPoint && (
          <>
            <line
              x1={hoveredPoint.x}
              y1="0"
              x2={hoveredPoint.x}
              y2="400"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.3"
            />
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r="8"
              fill={chartColor}
              stroke="rgba(5,6,14,0.8)"
              strokeWidth="3"
            />
          </>
        )}
      </svg>

      {/* Hover tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-[#0A0B15]/95 border border-white/20 rounded-lg px-3 py-2 pointer-events-none z-50"
          style={{
            left: `${(hoveredPoint.x / 1000) * 100}%`,
            top: `${(hoveredPoint.y / 400) * 100}%`,
            transform: "translate(-50%, -120%)",
          }}
        >
          <div className="mb-1 text-xs font-semibold text-white/90">
            {formatValue(hoveredPoint.value)}
          </div>
          <div className="text-[10px] text-white/50">
            {formatDate(hoveredPoint.timestamp)}
          </div>
        </div>
      )}

      {/* Min/Max value labels */}
      <div className="absolute top-0 right-0 text-[10px] text-white/40">
        {formatValue(maxValue)}
      </div>
      <div className="absolute bottom-0 right-0 text-[10px] text-white/40">
        {formatValue(minValue)}
      </div>
    </div>
  );
};

export default PriceChart;
