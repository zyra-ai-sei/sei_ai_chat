import { tokenVisualizationSlice } from "./reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCryptoMarketData } from "@/services/cryptoMarket";

export const {
  setTokenVisualization,
  clearTokenVisualization,
  setLoading,
  updateChartData,
  setChartLoading,
} = tokenVisualizationSlice.actions;

/**
 * Fetch market chart data for a specific timeframe
 * This is called when user changes timeframe in PriceCard
 */
export const fetchMarketChartData = createAsyncThunk(
  "tokenVisualization/fetchMarketChartData",
  async (
    { coinId, timeframe }: { coinId: string; timeframe: string },
    { dispatch }
  ) => {
    try {
      console.log(`[Redux] Fetching chart data for ${coinId} with timeframe ${timeframe}`);

      dispatch(setChartLoading(true));

      // DON'T clear old chart data - keep showing old data while loading
      // This prevents the chart from flickering to empty

      const response = await fetchCryptoMarketData(coinId, timeframe);

      console.log('[Redux] API Response:', response);

      if (response.success && response.data?.chartData && response.data.chartData.length > 0) {
        console.log(`[Redux] Received ${response.data.chartData.length} data points for ${timeframe}`);

        // Update only the chart data in the current token
        dispatch(
          updateChartData({
            prices: response.data.chartData,
          })
        );
      } else {
        console.error("Failed to fetch market data:", response.message);
        console.warn('[Redux] Keeping existing chart data due to API failure');
        // Don't update chart data - keep the existing data
      }
    } catch (error) {
      console.error("Error fetching market chart data:", error);
      console.warn('[Redux] Keeping existing chart data due to error');
      // Don't update chart data - keep the existing data
    } finally {
      dispatch(setChartLoading(false));
    }
  }
);
