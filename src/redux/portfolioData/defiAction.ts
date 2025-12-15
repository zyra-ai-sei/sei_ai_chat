import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import { IRootState } from "../store";
import { DefiApiResponse, DefiProtocol } from "./defiTypes";
import { setDefiLoading, setDefiError, setDefiData, clearDefiData } from "./defiReducer";

interface FetchDefiOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (error: string) => void;
  forceRefresh?: boolean; // Force refresh even if data is cached
  address: string;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Fetch DeFi positions from API
 * Calls: GET /portfolio/defiPositions
 * 
 * Implements caching: won't refetch if data is fresh (< 5 minutes old)
 */
export const fetchDefiPositions = createAsyncThunk<
  void,
  FetchDefiOptions | void,
  { state: IRootState }
>("portfolioData/fetchDefiPositions", async (options, { dispatch, getState }) => {
  const { onSuccessCb, onFailureCb, forceRefresh, address } = options || {};

  try {
    // Check if we have cached data
    const state = getState();
    const { lastUpdated, protocols, cachedAddress } = state.defiData;
    
    // If we have fresh data, same address, and not forcing refresh, skip the API call
    if (
      !forceRefresh &&
      lastUpdated &&
      cachedAddress === address &&
      Date.now() - lastUpdated < CACHE_DURATION &&
      protocols.length > 0
    ) {
      console.log("Using cached DeFi positions data");
      if (onSuccessCb) onSuccessCb();
      return;
    }

    dispatch(setDefiLoading(true));
    const response = await axiosInstance.get<DefiApiResponse>(
      `/portfolio/defiPositions?address=${address}`
    );
    if (response?.data?.status === 200 && response?.data?.data?.items) {
      const protocols: DefiProtocol[] = response.data.data.items;
      dispatch(setDefiData({ protocols, address }));
      if (onSuccessCb) onSuccessCb();
    } else {
      const errorMsg = "Invalid response format from defiPositions API";
      dispatch(setDefiError(errorMsg));
      if (onFailureCb) onFailureCb(errorMsg);
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch defi positions";
    dispatch(setDefiError(errorMsg));
    if (onFailureCb) onFailureCb(errorMsg);
  }
});

export const refreshDefiPositions = createAsyncThunk<
  void,
  FetchDefiOptions | void,
  { state: IRootState }
>("portfolioData/refreshDefiPositions", async (options, { dispatch }) => {
  dispatch(clearDefiData());
  await dispatch(fetchDefiPositions({ ...options, forceRefresh: true }));
});
