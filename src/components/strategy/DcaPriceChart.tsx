import React, { useMemo, useState, useRef } from "react";
import { DcaBuyPointRaw } from "@/types/dca";

interface DcaPriceChartProps {
  prices: Array<[number, number]>; // [timestamp, price]
  buyPoints: DcaBuyPointRaw[]; // [timestamp, price, tokens_bought]
}

const DcaPriceChart: React.FC<DcaPriceChartProps> = ({ prices, buyPoints }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    value: number;
    timestamp: number;
    isBuyPoint?: boolean;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { pathPoints, minValue, maxValue, buyPointsPositions, dataPoints } = useMemo(() => {
    if (!prices || prices.length === 0) {
      return {
        pathPoints: "",
        minValue: 0,
        maxValue: 0,
        buyPointsPositions: [],
        dataPoints: [],
      };
    }

    // Get all price values
    const values = prices.map(([_, price]) => price);
    const validValues = values.filter(v => typeof v === 'number' && isFinite(v));

    if (validValues.length === 0) {
      return {
        pathPoints: "",
        minValue: 0,
        maxValue: 0,
        buyPointsPositions: [],
        dataPoints: [],
      };
    }

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const range = max - min;

    // Chart dimensions
    const width = 1000;
    const height = 300;
    const padding = 20;

    // Create price line path
    const points: Array<{ x: number; y: number; value: number; timestamp: number }> = [];
    const pathData = prices
      .map(([timestamp, price], index) => {
        if (typeof price !== 'number' || !isFinite(price)) {
          return null;
        }

        const x = prices.length === 1
          ? width / 2
          : (index / (prices.length - 1)) * (width - padding * 2) + padding;

        const y = range === 0
          ? height / 2
          : height - padding - ((price - min) / range) * (height - padding * 2);

        points.push({ x, y, value: price, timestamp });
        return `${x},${y}`;
      })
      .filter(p => p !== null)
      .join(" ");

    // Calculate buy point positions
    const buyPointPositions = buyPoints.map(([timestamp, price, tokens]) => {
      // Find the closest price point
      const priceIndex = prices.findIndex(p => p[0] === timestamp);
      if (priceIndex === -1) return null;

      const x = prices.length === 1
        ? width / 2
        : (priceIndex / (prices.length - 1)) * (width - padding * 2) + padding;

      const y = range === 0
        ? height / 2
        : height - padding - ((price - min) / range) * (height - padding * 2);

      return { x, y, price, timestamp, tokens };
    }).filter(Boolean);

    return {
      pathPoints: pathData,
      minValue: min,
      maxValue: max,
      buyPointsPositions: buyPointPositions as any[],
      dataPoints: points,
    };
  }, [prices, buyPoints]);

  const formatPrice = (value: number) => {
    return `$${value.toFixed(4)}`;
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

    // Check if near a buy point
    const nearBuyPoint = buyPointsPositions.find(bp => {
      const dist = Math.sqrt((bp.x - x) ** 2 + (bp.y - y) ** 2);
      return dist < 20;
    });

    if (minDist < 30 || nearBuyPoint) {
      setHoveredPoint({
        x: nearBuyPoint?.x || nearest.x,
        y: nearBuyPoint?.y || nearest.y,
        value: nearBuyPoint?.price || nearest.value,
        timestamp: nearBuyPoint?.timestamp || nearest.timestamp,
        isBuyPoint: !!nearBuyPoint,
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const isPositive = prices.length > 1 && prices[prices.length - 1][1] >= prices[0][1];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(122,171,249,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Price History
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-gradient-to-r from-[#7CABF9] to-[#9F6BFF]" />
              <span className="text-xs text-white/50">Price</span>
            </div>
            <div className="flex items-center gap-1 ml-3">
              <div className="w-2 h-2 rounded-full bg-[#2AF598]" />
              <span className="text-xs text-white/50">Buy Points</span>
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
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7CABF9" />
                <stop offset="100%" stopColor="#9F6BFF" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? "#2AF598" : "#FF5555"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? "#2AF598" : "#FF5555"} stopOpacity="0.05" />
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

            {/* Area under curve */}
            {pathPoints && (
              <polygon
                points={`20,280 ${pathPoints} 980,280`}
                fill="url(#areaGradient)"
              />
            )}

            {/* Price line */}
            {pathPoints && (
              <polyline
                points={pathPoints}
                fill="none"
                stroke="url(#priceGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Buy points */}
            {buyPointsPositions.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="#2AF598"
                  opacity="0.2"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#2AF598"
                />
              </g>
            ))}

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
                  fill={hoveredPoint.isBuyPoint ? "#2AF598" : "#7CABF9"}
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
                {formatPrice(hoveredPoint.value)}
              </p>
              {hoveredPoint.isBuyPoint && (
                <p className="text-xs text-[#2AF598] mt-1">Buy Point</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DcaPriceChart;
