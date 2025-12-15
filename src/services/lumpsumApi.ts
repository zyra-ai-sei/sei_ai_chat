import { axiosInstance } from "./axios";
import type {
  LumpSumSimulationParams,
  LumpSumResponse,
  LumpSumApiResponse,
} from "@/types/lumpsum";

/**
 * Run Lump Sum simulation by calling the backend API
 * @param params - Lump Sum simulation parameters
 * @returns Lump Sum simulation results with summary, chart data, and projections
 */
export const runLumpSumSimulation = async (
  params: LumpSumSimulationParams
): Promise<LumpSumApiResponse> => {
  try {

    const response = await axiosInstance.post<{
      success: boolean;
      data: LumpSumResponse;
      message?: string;
    }>("/strategies-api/v1/strategies/lump-sum/simulate", params);

   

    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[Lump Sum API] Error running Lump Sum simulation:", error);
    console.error("[Lump Sum API] Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to run Lump Sum simulation",
    };
  }
};
