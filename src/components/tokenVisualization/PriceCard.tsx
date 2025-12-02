import React, { useState, useMemo, useEffect } from "react";
import { TokenVisualizationData } from "@/redux/tokenVisualization/reducer";
import PriceChart from "./PriceChart";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchMarketChartData } from "@/redux/tokenVisualization/action";

interface PriceCardProps {
  token: TokenVisualizationData;
}

type DataType = "price" | "marketCap";
type TimePeriod = "24h" | "7d" | "1m" | "3m" | "1y";

const PriceCard: React.FC<PriceCardProps> = ({ token }) => {
  const dispatch = useAppDispatch();
  const chartLoading = useAppSelector(
    (state) => state.tokenVisualization.chartLoading
  );

  const [dataType, setDataType] = useState<DataType>("price");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("7d");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch chart data when timeframe changes
  useEffect(() => {
    if (token.id) {
      dispatch(fetchMarketChartData({ coinId: token.id, timeframe: timePeriod }));
    }
  }, [timePeriod, token.id, dispatch]);

  // Client-side filtering of chart data based on timeframe
  // This is a fallback when backend API is not available
  const chartData = useMemo(() => {
    const data = token.chart?.prices || [];

    console.log('[PriceCard] Chart data from Redux:', {
      hasChartObject: !!token.chart,
      hasPricesArray: !!token.chart?.prices,
      dataLength: data.length,
      timePeriod,
      dataType
    });

    if (data.length === 0) {
      console.warn('[PriceCard] No chart data available!');
      return [];
    }

    // Validate data structure
    const isValidFormat = data.every((point, idx) => {
      const isValid = Array.isArray(point) &&
             point.length === 3 &&
             typeof point[0] === 'number' &&
             typeof point[1] === 'number' &&
             typeof point[2] === 'number';

      if (!isValid) {
        console.error(`[PriceCard] Invalid data point at index ${idx}:`, point);
      }
      return isValid;
    });

    if (!isValidFormat) {
      console.error('[PriceCard] Data format validation failed! Expected: [timestamp, price, marketCap][]');
      return [];
    }

    // Filter data based on selected timeframe (using latest timestamp as reference)
    const latestTimestamp = Math.max(...data.map(([ts]) => ts));
    let cutoffTime = latestTimestamp;

    switch (timePeriod) {
      case "24h":
        cutoffTime = latestTimestamp - 24 * 60 * 60 * 1000;
        break;
      case "7d":
        cutoffTime = latestTimestamp - 7 * 24 * 60 * 60 * 1000;
        break;
      case "1m":
        cutoffTime = latestTimestamp - 30 * 24 * 60 * 60 * 1000;
        break;
      case "3m":
        cutoffTime = latestTimestamp - 90 * 24 * 60 * 60 * 1000;
        break;
      case "1y":
        cutoffTime = latestTimestamp - 365 * 24 * 60 * 60 * 1000;
        break;
    }

    const filteredData = data.filter(([timestamp]) => timestamp >= cutoffTime);

    console.log('[PriceCard] Filtered Chart Data:', {
      dataType,
      timePeriod,
      originalLength: data.length,
      filteredLength: filteredData.length,
      firstPoint: filteredData[0],
      lastPoint: filteredData[filteredData.length - 1],
      format: '[timestamp, price, marketCap]',
      dateRange: filteredData.length > 0
        ? `${new Date(filteredData[0][0]).toLocaleDateString()} to ${new Date(filteredData[filteredData.length - 1][0]).toLocaleDateString()}`
        : 'No data',
      samplePrice: filteredData[0]?.[1],
      sampleMarketCap: filteredData[0]?.[2]
    });

    return filteredData;
  }, [token.chart?.prices, dataType, timePeriod, token.chart]);

  // Get the latest price from chart data (most recent data point)
  const latestPrice = useMemo(() => {
    if (chartData.length > 0) {
      const lastPoint = chartData[chartData.length - 1];
      return lastPoint[1]; // [timestamp, price, marketCap] - get price
    }
    return token.market.price_usd; // Fallback to token price if no chart data
  }, [chartData, token.market.price_usd]);

  // Calculate 24h change from chart data
  const price24hChange = useMemo(() => {
    if (chartData.length > 1) {
      const latestPrice = chartData[chartData.length - 1][1];
      const oldestPrice = chartData[0][1];
      return ((latestPrice - oldestPrice) / oldestPrice) * 100;
    }
    return token.market.price_change_24h; // Fallback
  }, [chartData, token.market.price_change_24h]);

  return (
    <div className="relative h-fit rounded-2xl scrollbar-none border border-white/10 bg-gradient-to-br from-[#05060E]/95 via-[#0A0B15]/95 to-[#05060E]/95 p-5 shadow-[0_20px_60px_rgba(5,6,14,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(110,178,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Price
          </p>
          <div className="flex items-center gap-2">
            <img
              src={token.image.thumb}
              alt={token.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-semibold text-white/70">
              {token.symbol.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold text-white">
              {formatPrice(latestPrice)}
            </span>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                price24hChange >= 0
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-rose-500/10 border border-rose-500/30"
              }`}
            >
              <svg
                className={`w-3 h-3 ${
                  price24hChange >= 0
                    ? "text-emerald-400"
                    : "text-rose-400 rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span
                className={`text-sm font-semibold ${
                  price24hChange >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {price24hChange >= 0 ? "+" : ""}
                {price24hChange.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="mb-3 text-xs text-white/50">
            Change ({timePeriod})
          </p>

          {/* Chart Controls */}
          <div className="mb-3 space-y-3">
            {/* Data Type Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setDataType("price")}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  dataType === "price"
                    ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                    : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10"
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setDataType("marketCap")}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  dataType === "marketCap"
                    ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                    : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10"
                }`}
              >
                Market Cap
              </button>
            </div>

            {/* Time Period Toggles */}
            <div className="flex gap-2">
              {[
                { value: "24h" as TimePeriod, label: "24H" },
                { value: "7d" as TimePeriod, label: "7D" },
                { value: "1m" as TimePeriod, label: "1M" },
                { value: "3m" as TimePeriod, label: "3M" },
                { value: "1y" as TimePeriod, label: "1Y" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimePeriod(value)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                    timePeriod === value
                      ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                      : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Chart */}
          <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-2 h-[400px] relative">
            {/* Data type indicator */}
            <div className="absolute z-10 px-2 py-1 border rounded top-2 left-2 bg-white/10 border-white/20">
              <span className="text-[10px] font-semibold text-white/70">
                {dataType === "price" ? "Price (USD)" : "Market Cap (USD)"}
              </span>
            </div>
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 rounded-full border-blue-500/30 border-t-blue-500 animate-spin" />
                  <p className="text-xs text-white/50">Loading chart data...</p>
                </div>
              </div>
            ) : chartData.length > 0 ? (
              <PriceChart
                key={`${dataType}-${timePeriod}`}
                data={chartData}
                change24h={price24hChange}
                dataType={dataType}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-white/40">No chart data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 border rounded-xl bg-white/5 border-white/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              1H
            </p>
            <p
              className={`text-sm font-semibold ${
                token.market.price_change_1h >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {token.market.price_change_1h >= 0 ? "+" : ""}
              {token.market.price_change_1h.toFixed(2)}%
            </p>
          </div>
          <div className="p-3 border rounded-xl bg-white/5 border-white/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              7D
            </p>
            <p
              className={`text-sm font-semibold ${
                token.market.price_change_7d >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {token.market.price_change_7d >= 0 ? "+" : ""}
              {token.market.price_change_7d.toFixed(2)}%
            </p>
          </div>
          <div className="p-3 border rounded-xl bg-white/5 border-white/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              30D
            </p>
            <p
              className={`text-sm font-semibold ${
                token.market.price_change_30d >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {token.market.price_change_30d >= 0 ? "+" : ""}
              {token.market.price_change_30d.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="mb-1 text-xs text-white/50">24h High</p>
            <p className="text-sm font-semibold text-white/80">
              {formatPrice(token.market.high_24h)}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs text-white/50">24h Low</p>
            <p className="text-sm font-semibold text-white/80">
              {formatPrice(token.market.low_24h)}
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs text-white/50">ATH</p>
              <p className="text-sm font-semibold text-white/80">
                {formatPrice(token.market.ath_usd)}
              </p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs text-white/50">From ATH</p>
              <p
                className={`text-sm font-semibold ${
                  token.market.ath_change_pct >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {token.market.ath_change_pct.toFixed(2)}%
              </p>
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-2">
            Reached on {formatDate(token.market.ath_date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
