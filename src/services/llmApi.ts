import { axiosInstance } from "./axios";
import {
  ToolDataResponse,
  ToolDataStatusResponse,
  ToolDataBatchResponse,
} from "@/types/asyncToolData.types";

/**
 * Fetch full tool data by execution ID
 * GET /llm/toolData/:executionId
 */
export const fetchToolData = async (
  executionId: string,
  network: string = "sei",
): Promise<ToolDataResponse> => {
  const response = await axiosInstance.get(
    `/llm/toolData/${executionId}?network=${network}`,
  );
  // API returns { status, data: { success, data: { ... } } }
  // We need to extract the inner structure to match ToolDataResponse
  const apiData = response.data;
  return {
    success: apiData?.data?.success ?? apiData?.success ?? false,
    data: apiData?.data?.data ?? apiData?.data,
    error: apiData?.data?.error ?? apiData?.error,
  };
};

/**
 * Poll status of async tool data (lightweight check)
 * GET /llm/toolData/:executionId/status
 */
export const pollToolDataStatus = async (
  executionId: string,
  network: string = "sei",
): Promise<ToolDataStatusResponse> => {
  const response = await axiosInstance.get(
    `/llm/toolData/${executionId}/status?network=${network}`,
  );
  return response.data;
};

/**
 * Batch fetch multiple tool data results (max 20)
 * POST /llm/toolData/batch
 *
 * Useful for loading historical async tool data
 */
export const batchFetchToolData = async (
  executionIds: string[],
  network: string = "sei",
): Promise<ToolDataBatchResponse> => {
  const response = await axiosInstance.post(
    `/llm/toolData/batch?network=${network}`,
    {
      executionIds,
    },
  );
  // API returns nested structure { status, data: { success, results: { ... } } }
  const apiData = response.data;
  return {
    success: apiData?.data?.success ?? apiData?.success ?? false,
    results: apiData?.data?.results ?? apiData?.results,
    error: apiData?.data?.error ?? apiData?.error,
  };
};

/**
 * Fetch tool data by request IDs (from AIMessageChunk)
 * POST /llm/toolData/byRequestIds
 *
 * This API takes requestIds from AIMessageChunk messages and returns corresponding tool_outputs
 */
export const fetchToolDataByRequestIds = async (
  requestIds: string[],
  network: string = "sei",
): Promise<ToolDataBatchResponse> => {
  const response = await axiosInstance.post(
    `/llm/toolData/byRequestIds?network=${network}`,
    {
      requestIds,
    },
  );
  // API returns nested structure { status, data: { success, results: { ... } } }
  const apiData = response.data;
  return {
    success: apiData?.data?.success ?? apiData?.success ?? false,
    results: apiData?.data?.results ?? apiData?.results,
    error: apiData?.data?.error ?? apiData?.error,
  };
};
