import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import { IRootState } from "../store";
import { DefiApiResponse, DefiProtocol } from "./defiTypes";
import { setDefiLoading, setDefiError, setDefiData, clearDefiData } from "./defiReducer";

interface FetchDefiOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (error: string) => void;
}

export const fetchDefiPositions = createAsyncThunk<
  void,
  FetchDefiOptions | void,
  { state: IRootState }
>("portfolioData/fetchDefiPositions", async (options, { dispatch }) => {
  const { onSuccessCb, onFailureCb } = options || {};

  try {
    dispatch(setDefiLoading(true));
    const response = await axiosInstance.get<DefiApiResponse>(
      "/portfolio/defiPositions"
    );
    if (response?.data?.status === 200 && response?.data?.data?.items) {
      const protocols: DefiProtocol[] = response.data.data.items;
      dispatch(setDefiData(protocols));
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
  await dispatch(fetchDefiPositions(options));
});
