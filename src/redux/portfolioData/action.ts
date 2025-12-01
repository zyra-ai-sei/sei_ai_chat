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
}

/**
 * Fetch portfolio total balance from API
 * Calls: GET /portfolio/totalBalance
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
>("portfolioData/fetchBalance", async (options, { dispatch }) => {
  const { onSuccessCb, onFailureCb } = options || {};

  try {
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

  // Then fetch fresh data
  await dispatch(fetchPortfolioBalance(options));
});
