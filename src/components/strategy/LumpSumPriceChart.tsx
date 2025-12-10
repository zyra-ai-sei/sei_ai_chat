import React, { useMemo, useState, useRef } from "react";

interface LumpSumPriceChartProps {
  prices: Array<[number, number]>;
  buyPoint: [number, number, number]; // [timestamp, price, tokens_bought]
}

const LumpSumPriceChart: React.FC<LumpSumPriceChartProps> = ({ prices, buyPoint }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    value: number;
    timestamp: number;
    isBuyPoint?: boolean;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { pathPoints, buyPointPosition, dataPoints } = useMemo(() => {
    if (!prices || prices.length === 0) {
      return {
        pathPoints: "",
        minValue: 0,
        maxValue: 0,
        buyPointPosition: null,
        dataPoints: [],
      };
    }

    const values = prices.map(([_, price]) => price);
    const validValues = values.filter(v => typeof v === 'number' && isFinite(v));

    if (validValues.length === 0) {
      return {
        pathPoints: "",
        minValue: 0,
        maxValue: 0,
        buyPointPosition: null,
        dataPoints: [],
      };
    }

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const range = max - min;

    const width = 1000;
    const height = 300;
    const padding = 20;

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

    let buyPointPos = null;
    if (buyPoint && buyPoint.length === 3) {
      const [timestamp, price, _tokens] = buyPoint;
      const priceIndex = prices.findIndex(p => p[0] === timestamp);
      if (priceIndex !== -1) {
        const x = prices.length === 1
          ? width / 2
          : (priceIndex / (prices.length - 1)) * (width - padding * 2) + padding;

        const y = range === 0
          ? height / 2
          : height - padding - ((price - min) / range) * (height - padding * 2);

        buyPointPos = { x, y, price, timestamp };
      }
    }

    return {
      pathPoints: pathData,
      minValue: min,
      maxValue: max,
      buyPointPosition: buyPointPos,
      dataPoints: points,
    };
  }, [prices, buyPoint]);

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

    let nearest = dataPoints[0];
    let minDist = Infinity;

    dataPoints.forEach(point => {
      const dist = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = point;
      }
    });

    const nearBuyPoint = buyPointPosition && Math.sqrt((buyPointPosition.x - x) ** 2 + (buyPointPosition.y - y) ** 2) < 20;

    if (minDist < 30 || nearBuyPoint) {
      setHoveredPoint({
        x: nearBuyPoint ? buyPointPosition!.x : nearest.x,
        y: nearBuyPoint ? buyPointPosition!.y : nearest.y,
        value: nearBuyPoint ? buyPointPosition!.price : nearest.value,
        timestamp: nearBuyPoint ? buyPointPosition!.timestamp : nearest.timestamp,
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
              <span className="text-xs text-white/50">Buy Point</span>
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
            <defs>
              <linearGradient id="lumpSumPriceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7CABF9" />
                <stop offset="100%" stopColor="#9F6BFF" />
              </linearGradient>
              <linearGradient id="lumpSumAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? "#2AF598" : "#FF5555"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? "#2AF598" : "#FF5555"} stopOpacity="0.05" />
              </linearGradient>
            </defs>

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

            {pathPoints && (
              <polygon
                points={`20,280 ${pathPoints} 980,280`}
                fill="url(#lumpSumAreaGradient)"
              />
            )}

            {pathPoints && (
              <polyline
                points={pathPoints}
                fill="none"
                stroke="url(#lumpSumPriceGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {buyPointPosition && (
              <g>
                <circle
                  cx={buyPointPosition.x}
                  cy={buyPointPosition.y}
                  r="8"
                  fill="#2AF598"
                  opacity="0.2"
                />
                <circle
                  cx={buyPointPosition.x}
                  cy={buyPointPosition.y}
                  r="4"
                  fill="#2AF598"
                />
              </g>
            )}

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

          {hoveredPoint && (
            <div
              className="absolute bg-[#0A0B15] border border-white/20 rounded-lg px-3 py-2 pointer-events-none shadow-xl"
              style={{
                left: `${(hoveredPoint.x / 1000) * 100}%`,
                top: `${(hoveredPoint.y / 300) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <p className="mb-1 text-xs text-white/50">
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

export default LumpSumPriceChart;
