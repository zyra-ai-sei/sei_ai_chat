import { axiosInstance } from "./axios";
import type { TransactionType, ExecutionConditions } from "@/redux/chatData/reducer";

export interface CreateDelegatedOrderRequest {
  walletId: string;
  transactionType: TransactionType;
  transactionData: {
    to: string;
    value?: string;
    data?: string;
    chainId: number;
  };
  executionConditions: ExecutionConditions;
  description?: string;
}

export interface CreateDelegatedOrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}

export interface DelegatedOrder {
  orderId: string;
  userId: string;
  walletId: string;
  transactionType: TransactionType;
  status: 'authorized' | 'executing' | 'executed' | 'failed' | 'cancelled' | 'expired';
  transactionData: {
    to: string;
    value?: string;
    data?: string;
    chainId: number;
  };
  executionConditions: ExecutionConditions;
  execution?: {
    transactionHash?: string;
    executedAt?: string;
    errorMessage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersResponse {
  success: boolean;
  orders?: DelegatedOrder[];
  error?: string;
}

/**
 * Create a delegated (conditional) order
 * The order will be stored in the database and executed when conditions are met
 */
export const createDelegatedOrder = async (
  request: CreateDelegatedOrderRequest
): Promise<CreateDelegatedOrderResponse> => {
  try {
    console.log(`[Delegated TX API] Creating delegated order...`, {
      transactionType: request.transactionType,
      executionConditions: request.executionConditions,
    });

    const response = await axiosInstance.post<{
      status: number;
      data: {
        success: boolean;
        orderId: string;
        message?: string;
      };
    }>("/privy-transactions/delegated", request);

    // Backend wraps response in {status, data}, so actual data is at response.data.data
    const responseData = response.data.data;

    console.log(`[Delegated TX API] Full response:`, response.data);
    console.log(`[Delegated TX API] Parsed responseData:`, responseData);
    console.log(`[Delegated TX API] Order created successfully:`, {
      orderId: responseData.orderId,
    });

    return {
      success: responseData.success,
      orderId: responseData.orderId,
      message: responseData.message,
    };
  } catch (error: any) {
    console.error("[Delegated TX API] Error creating delegated order:", error);
    console.error("[Delegated TX API] Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to create delegated order",
    };
  }
};

/**
 * Get all delegated orders for the current user
 */
export const getDelegatedOrders = async (
  status?: string
): Promise<GetOrdersResponse> => {
  try {
    console.log(`[Delegated TX API] Fetching orders...`);

    const params = status ? { status } : {};
    const response = await axiosInstance.get<{
      success: boolean;
      orders: DelegatedOrder[];
    }>("/privy-transactions/orders", { params });

    console.log(`[Delegated TX API] Fetched ${response.data.orders?.length || 0} orders`);

    return {
      success: response.data.success,
      orders: response.data.orders,
    };
  } catch (error: any) {
    console.error("[Delegated TX API] Error fetching orders:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders",
    };
  }
};

/**
 * Get a specific delegated order by ID
 */
export const getOrderById = async (
  orderId: string
): Promise<{ success: boolean; order?: DelegatedOrder; error?: string }> => {
  try {
    console.log(`[Delegated TX API] Fetching order ${orderId}...`);

    const response = await axiosInstance.get<{
      status: number;
      data: {
        success: boolean;
        order: DelegatedOrder;
      };
    }>(`/privy-transactions/orders/${orderId}`);

    // Backend wraps response in {status, data}, so actual data is at response.data.data
    const responseData = response.data.data;

    console.log(`[Delegated TX API] Order fetched:`, responseData?.order?.status);

    return {
      success: responseData?.success ?? false,
      order: responseData?.order,
    };
  } catch (error: any) {
    console.error("[Delegated TX API] Error fetching order:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch order",
    };
  }
};

/**
 * Cancel a delegated order
 */
export const cancelDelegatedOrder = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`[Delegated TX API] Cancelling order ${orderId}...`);

    const response = await axiosInstance.delete<{
      success: boolean;
      message?: string;
    }>(`/privy-transactions/orders/${orderId}`);

    console.log(`[Delegated TX API] Order cancelled successfully`);

    return {
      success: response.data.success,
    };
  } catch (error: any) {
    console.error("[Delegated TX API] Error cancelling order:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel order",
    };
  }
};
