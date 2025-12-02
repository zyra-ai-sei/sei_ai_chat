import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import { IRootState } from "../store";
import {
  setPortfolioLoading,
  setPortfolioError,
  setPortfolioData,
  clearPortfolioData,
} from "./reducer";
import { PortfolioApiResponse } from "./types";

// Re-export reducer actions
export { clearPortfolioData } from "./reducer";

interface FetchPortfolioOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (error: string) => void;
  forceRefresh?: boolean; // Force refresh even if data is cached
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Fetch portfolio total balance from API
 * Calls: GET /portfolio/totalBalance
 * 
 * Implements caching: won't refetch if data is fresh (< 5 minutes old)
 * 
 * Response structure:
 * {
 *   status: 200,
 *   data: {
 *     items: PortfolioToken[]
 *   }
 * }
 */
export const fetchPortfolioBalance = createAsyncThunk<
  void,
  FetchPortfolioOptions | void,
  { state: IRootState }
>("portfolioData/fetchBalance", async (options, { dispatch, getState }) => {
  const { onSuccessCb, onFailureCb, forceRefresh } = options || {};

  try {
    // Check if we have cached data
    const state = getState();
    const { lastUpdated, tokens } = state.portfolioData;
    
    // If we have fresh data and not forcing refresh, skip the API call
    if (
      !forceRefresh &&
      lastUpdated &&
      Date.now() - lastUpdated < CACHE_DURATION &&
      tokens.length > 0
    ) {
      console.log("Using cached portfolio balance data");
      if (onSuccessCb) onSuccessCb();
      return;
    }

    dispatch(setPortfolioLoading(true));

    const response = await axiosInstance.get<PortfolioApiResponse>(
      "/portfolio/totalBalance"
    );

    if (response?.data?.status === 200 && response?.data?.data?.items) {
      const tokens = response.data.data.items;
      dispatch(setPortfolioData(tokens));

      if (onSuccessCb) {
        onSuccessCb();
      }
    } else {
      const errorMsg = "Invalid response format from portfolio API";
      dispatch(setPortfolioError(errorMsg));

      if (onFailureCb) {
        onFailureCb(errorMsg);
      }
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch portfolio data";
    dispatch(setPortfolioError(errorMsg));

    if (onFailureCb) {
      onFailureCb(errorMsg);
    }
  }
});

/**
 * Refresh portfolio data (alias for fetchPortfolioBalance with force refresh intent)
 */
export const refreshPortfolioBalance = createAsyncThunk<
  void,
  FetchPortfolioOptions | void,
  { state: IRootState }
>("portfolioData/refresh", async (options, { dispatch }) => {
  // Clear existing data first
  dispatch(clearPortfolioData());

  // Then fetch fresh data with force refresh flag
  await dispatch(fetchPortfolioBalance({ ...options, forceRefresh: true }));
});
