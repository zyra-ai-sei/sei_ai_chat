import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import { IRootState } from "../store";
import { PortfolioSummaryApiResponse } from "./summaryTypes";
import {
  setSummaryLoading,
  setSummaryError,
  setSummaryData,
  clearSummaryData,
} from "./summaryReducer";

interface FetchSummaryOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (error: string) => void;
  forceRefresh?: boolean; // Force refresh even if data is cached
  address: string;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Fetch portfolio summary from API
 * Calls: GET /portfolio/summary
 * 
 * Implements caching: won't refetch if data is fresh (< 5 minutes old)
 */
export const fetchPortfolioSummary = createAsyncThunk<
  void,
  FetchSummaryOptions | void,
  { state: IRootState }
>("portfolioData/fetchSummary", async (options, { dispatch, getState }) => {
  const { onSuccessCb, onFailureCb, forceRefresh, address } = options || {};

  try {
    // Check if we have cached data
    const state = getState();
    const { lastUpdated, items, cachedAddress } = state.portfolioSummaryData;
    
    // If we have fresh data, same address, and not forcing refresh, skip the API call
    if (
      !forceRefresh &&
      lastUpdated &&
      cachedAddress === address &&
      Date.now() - lastUpdated < CACHE_DURATION &&
      items.length > 0
    ) {
      console.log("Using cached portfolio summary data");
      if (onSuccessCb) onSuccessCb();
      return;
    }

    dispatch(setSummaryLoading(true));

    const response = await axiosInstance.get<PortfolioSummaryApiResponse>(
      `/portfolio/summary?address=${address}`
    );

    if (response?.data?.status === 200 && Array.isArray(response?.data?.data?.items)) {
      const items = response.data.data.items;
      dispatch(setSummaryData({ items, address:address as string }));

      if (onSuccessCb) {
        onSuccessCb();
      }
    } else {
      const errorMsg = "Invalid response format from portfolio summary API";
      dispatch(setSummaryError(errorMsg));

      if (onFailureCb) {
        onFailureCb(errorMsg);
      }
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch portfolio summary";
    dispatch(setSummaryError(errorMsg));

    if (onFailureCb) {
      onFailureCb(errorMsg);
    }
  }
});

/**
 * Refresh portfolio summary (force refresh ignoring cache)
 */
export const refreshPortfolioSummary = createAsyncThunk<
  void,
  FetchSummaryOptions,
  { state: IRootState }
>("portfolioData/refreshSummary", async (options, { dispatch }) => {
  // Clear existing data first
  dispatch(clearSummaryData());

  // Then fetch fresh data with force refresh flag
  await dispatch(fetchPortfolioSummary({ ...options, forceRefresh: true }));
});
