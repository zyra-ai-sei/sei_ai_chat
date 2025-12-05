import { axiosInstance } from "./axios";

export interface CryptoMarketDataResponse {
  success: boolean;
  data?: {
    coinId: string;
    timeframe: string;
    dataPoints: number;
    chartData: [number, number, number][]; // [timestamp, price, marketCap]
  };
  message?: string;
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheEntry {
  data: CryptoMarketDataResponse;
  timestamp: number;
}

// In-memory cache: Map<coinId_timeframe, CacheEntry>
const marketDataCache = new Map<string, CacheEntry>();

/**
 * Generate cache key from coinId and timeframe
 */
const getCacheKey = (coinId: string, timeframe: string): string => {
  return `${coinId}_${timeframe}`;
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

/**
 * Get cached data if available and valid
 */
const getCachedData = (
  coinId: string,
  timeframe: string
): CryptoMarketDataResponse | null => {
  const cacheKey = getCacheKey(coinId, timeframe);
  const cached = marketDataCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    console.log(`[Cache] HIT for ${cacheKey} (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
    return cached.data;
  }

  if (cached) {
    console.log(`[Cache] EXPIRED for ${cacheKey}`);
    marketDataCache.delete(cacheKey);
  } else {
    console.log(`[Cache] MISS for ${cacheKey}`);
  }

  return null;
};

/**
 * Clear all cached data (useful for manual refresh)
 */
export const clearMarketDataCache = (): void => {
  marketDataCache.clear();
  console.log("[Cache] CLEARED all market data cache");
};

/**
 * Clear specific cached entry
 */
export const clearCachedEntry = (coinId: string, timeframe: string): void => {
  const cacheKey = getCacheKey(coinId, timeframe);
  marketDataCache.delete(cacheKey);
  console.log(`[Cache] CLEARED ${cacheKey}`);
};

/**
 * Fetch cryptocurrency market data from backend with caching
 * @param coinId - CoinGecko coin ID (e.g., "bitcoin", "ethereum", "sei-network")
 * @param timeframe - Time period: "24h", "7d", "1m", "3m", "1y"
 * @param forceRefresh - Force fetch from API, bypassing cache
 * @returns Market data with price and market cap chart
 */
export const fetchCryptoMarketData = async (
  coinId: string,
  timeframe: string,
  forceRefresh: boolean = false
): Promise<any> => {
  try {
    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cachedData = getCachedData(coinId, timeframe);
      if (cachedData) {
        return cachedData;
      }
    } else {
      console.log(`[API Service] Force refresh requested for ${coinId}_${timeframe}`);
    }

    console.log(`[API Service] Fetching ${coinId} for ${timeframe} from API...`);

    const response = await axiosInstance.get<any>(
      "/crypto/market-data",
      {
        params: {
          coinId,
          timeframe,
        },
      }
    );

    console.log(`[API Service] Raw response:`, response.data.data.data);
    console.log(`[API Service] Response structure:`, {
      success: response.data.data.success,
      dataPoints: response.data.data.data?.dataPoints,
      hasChartData: !!response.data.data.data?.chartData,
      chartDataLength: response.data.data.data?.chartData?.length,
      sampleData: response.data.data.data?.chartData?.[0],
    });

    // Cache successful responses
    if (response.data.success && response.data.data?.chartData) {
      // setCachedData(coinId, timeframe, response.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("[API Service] Error fetching crypto market data:", error);
    console.error("[API Service] Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch market data",
    };
  }
};
