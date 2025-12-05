import React, { useMemo, useState, useRef } from "react";

interface DcaPortfolioChartProps {
  portfolioValues: Array<[number, number]>; // [timestamp, value]
  totalInvestment: number;
}

const DcaPortfolioChart: React.FC<DcaPortfolioChartProps> = ({
  portfolioValues,
  totalInvestment,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    value: number;
    timestamp: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { pathPoints, minValue, maxValue, investmentLine, dataPoints } = useMemo(() => {
    if (!portfolioValues || portfolioValues.length === 0) {
      return {
        pathPoints: "",
        minValue: 0,
        maxValue: 0,
        investmentLine: 0,
        dataPoints: [],
      };
    }

    // Get all values
    const values = portfolioValues.map(([_, value]) => value);
    const validValues = values.filter(v => typeof v === 'number' && isFinite(v));

    if (validValues.length === 0) {
      return {
        pathPoints: "",
        minValue: 0,
        maxValue: 0,
        investmentLine: 0,
        dataPoints: [],
      };
    }

    const min = Math.min(...validValues, totalInvestment);
    const max = Math.max(...validValues, totalInvestment);
    const range = max - min;

    // Chart dimensions
    const width = 1000;
    const height = 300;
    const padding = 20;

    // Create portfolio value line path
    const points: Array<{ x: number; y: number; value: number; timestamp: number }> = [];
    const pathData = portfolioValues
      .map(([timestamp, value], index) => {
        if (typeof value !== 'number' || !isFinite(value)) {
          return null;
        }

        const x = portfolioValues.length === 1
          ? width / 2
          : (index / (portfolioValues.length - 1)) * (width - padding * 2) + padding;

        const y = range === 0
          ? height / 2
          : height - padding - ((value - min) / range) * (height - padding * 2);

        points.push({ x, y, value, timestamp });
        return `${x},${y}`;
      })
      .filter(p => p !== null)
      .join(" ");

    // Calculate investment line Y position
    const investmentY = range === 0
      ? height / 2
      : height - padding - ((totalInvestment - min) / range) * (height - padding * 2);

    return {
      pathPoints: pathData,
      minValue: min,
      maxValue: max,
      investmentLine: investmentY,
      dataPoints: points,
    };
  }, [portfolioValues, totalInvestment]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || dataPoints.length === 0) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find nearest point
    let nearest = dataPoints[0];
    let minDist = Infinity;

    dataPoints.forEach(point => {
      const dist = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = point;
      }
    });

    if (minDist < 30) {
      setHoveredPoint(nearest);
    } else {
      setHoveredPoint(null);
    }
  };

  const currentValue = portfolioValues.length > 0 ? portfolioValues[portfolioValues.length - 1][1] : 0;
  const isProfit = currentValue >= totalInvestment;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(159,107,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Portfolio Growth
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className={`w-3 h-0.5 ${isProfit ? 'bg-[#2AF598]' : 'bg-[#FF5555]'}`} />
              <span className="text-xs text-white/50">Portfolio</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-white/30" style={{ borderTop: "2px dashed rgba(255,255,255,0.3)" }} />
              <span className="text-xs text-white/50">Investment</span>
            </div>
          </div>
        </div>

        <div className="relative w-full" style={{ height: "320px" }}>
          <svg
            ref={svgRef}
            viewBox="0 0 1000 300"
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Grid lines */}
            <defs>
              <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isProfit ? "#2AF598" : "#FF5555"} stopOpacity="0.4" />
                <stop offset="100%" stopColor={isProfit ? "#2AF598" : "#FF5555"} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="20"
                y1={20 + i * 70}
                x2="980"
                y2={20 + i * 70}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Investment baseline (dashed line) */}
            <line
              x1="20"
              y1={investmentLine}
              x2="980"
              y2={investmentLine}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeDasharray="8 4"
            />

            {/* Area under portfolio curve */}
            {pathPoints && (
              <polygon
                points={`20,280 ${pathPoints} 980,280`}
                fill="url(#portfolioGradient)"
              />
            )}

            {/* Portfolio value line */}
            {pathPoints && (
              <polyline
                points={pathPoints}
                fill="none"
                stroke={isProfit ? "#2AF598" : "#FF5555"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Hover indicator */}
            {hoveredPoint && (
              <g>
                <line
                  x1={hoveredPoint.x}
                  y1="20"
                  x2={hoveredPoint.x}
                  y2="280"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="6"
                  fill={isProfit ? "#2AF598" : "#FF5555"}
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute bg-[#0A0B15] border border-white/20 rounded-lg px-3 py-2 pointer-events-none shadow-xl"
              style={{
                left: `${(hoveredPoint.x / 1000) * 100}%`,
                top: `${(hoveredPoint.y / 300) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <p className="text-xs text-white/50 mb-1">
                {formatDate(hoveredPoint.timestamp)}
              </p>
              <p className="text-sm font-bold text-white">
                {formatCurrency(hoveredPoint.value)}
              </p>
              <p className={`text-xs mt-1 ${hoveredPoint.value >= totalInvestment ? 'text-[#2AF598]' : 'text-[#FF5555]'}`}>
                {hoveredPoint.value >= totalInvestment ? '+' : ''}{formatCurrency(hoveredPoint.value - totalInvestment)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DcaPortfolioChart;
