import { tokenVisualizationSlice } from "./reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCryptoMarketData,
  clearMarketDataCache,
  clearCachedEntry,
} from "@/services/cryptoMarket";

export const {
  setTokenVisualization,
  clearTokenVisualization,
  setLoading,
  updateChartData,
  setChartLoading,
} = tokenVisualizationSlice.actions;

// Re-export cache management utilities
export { clearMarketDataCache, clearCachedEntry };

/**
 * Fetch market chart data for a specific timeframe
 * This is called when user changes timeframe in PriceCard
 */
export const fetchMarketChartData = createAsyncThunk(
  "tokenVisualization/fetchMarketChartData",
  async (
    {
      coinId,
      timeframe,
      forceRefresh = false,
    }: {
      coinId: string;
      timeframe: string;
      forceRefresh?: boolean;
    },
    { dispatch }
  ) => {
    try {
      console.log(
        `[Redux] Fetching chart data for ${coinId} with timeframe ${timeframe}${forceRefresh ? " (force refresh)" : ""}`
      );

      dispatch(setChartLoading(true));

      // DON'T clear old chart data - keep showing old data while loading
      // This prevents the chart from flickering to empty

      const response = await fetchCryptoMarketData(
        coinId,
        timeframe,
        forceRefresh
      );

      console.log("[Redux] API Response:", response);

      if (response?.data?.data?.chartData && response.data.data.chartData.length > 0) {
        console.log(
          `[Redux] Received ${response.data.data.chartData.length} data points for ${timeframe}`
        );

        // Update only the chart data in the current token
        dispatch(
          updateChartData({
            prices: response?.data?.data?.chartData,
          })
        );
      } else {
        console.error("Failed to fetch market data:", response.message);
        console.warn("[Redux] Keeping existing chart data due to API failure");
        // Don't update chart data - keep the existing data
      }
    } catch (error) {
      console.error("Error fetching market chart data:", error);
      console.warn("[Redux] Keeping existing chart data due to error");
      // Don't update chart data - keep the existing data
    } finally {
      dispatch(setChartLoading(false));
    }
  }
);
