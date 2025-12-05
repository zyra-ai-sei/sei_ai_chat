import { axiosInstance } from "./axios";
import type {
  DcaSimulationParams,
  DcaResponse,
  DcaApiResponse,
} from "@/types/dca";

/**
 * Run DCA simulation by calling the backend API
 * @param params - DCA simulation parameters
 * @returns DCA simulation results with summary, chart data, and projections
 */
export const runDcaSimulation = async (
  params: DcaSimulationParams
): Promise<DcaApiResponse> => {
  try {
    console.log(`[DCA API] Running simulation for ${params.coin}...`, params);

    const response = await axiosInstance.post<{
      success: boolean;
      data: DcaResponse;
      message?: string;
    }>("/strategy/dca", params);

    console.log(`[DCA API] Simulation completed successfully:`, {
      buy_count: response.data.data?.summary?.buy_count,
      total_investment: response.data.data?.summary?.total_investment,
      return_pct: response.data.data?.summary?.return_pct,
    });

    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[DCA API] Error running DCA simulation:", error);
    console.error("[DCA API] Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to run DCA simulation",
    };
  }
};
