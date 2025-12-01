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

/**
 * Fetch cryptocurrency market data from backend
 * @param coinId - CoinGecko coin ID (e.g., "bitcoin", "ethereum", "sei-network")
 * @param timeframe - Time period: "24h", "7d", "1m", "3m", "1y"
 * @returns Market data with price and market cap chart
 */
export const fetchCryptoMarketData = async (
  coinId: string,
  timeframe: string
): Promise<CryptoMarketDataResponse> => {
  try {
    console.log(`[API Service] Fetching ${coinId} for ${timeframe}...`);

    const response = await axiosInstance.get<CryptoMarketDataResponse>(
      "/crypto/market-data",
      {
        params: {
          coinId,
          timeframe,
          _t: Date.now(), // Cache buster
        },
      }
    );

    console.log(`[API Service] Raw response:`, response.data);
    console.log(`[API Service] Response structure:`, {
      success: response.data.success,
      dataPoints: response.data.data?.dataPoints,
      hasChartData: !!response.data.data?.chartData,
      chartDataLength: response.data.data?.chartData?.length,
      sampleData: response.data.data?.chartData?.[0],
      fullData: response.data
    });

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
