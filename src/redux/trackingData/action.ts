import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";

export interface TokenTransfer {
  _id: string;
  trackedAddress: string;
  chain: string;
  symbol?: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenAddress: string;
  blockNumber: number;
  timestamp: number;
  type: "INCOMING" | "OUTGOING";
  createdAt: string;
}

export const subscribeToAddress = createAsyncThunk(
  "tracking/subscribe",
  async (
    { address, chains }: { address: string; chains: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/tracking/subscribe", {
        address,
        chains,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to subscribe"
      );
    }
  }
);

export const getSubscribedAddresses = createAsyncThunk(
  "tracking/subscribes",
  async () => {
    try {
      const response = await axiosInstance.get("/tracking/addresses");
      return response?.data?.data?.items || [];
    } catch (error: any) {
      return [];
    }
  }
);

export const unsubscribeFromAddress = createAsyncThunk(
  "tracking/unsubscribe",
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tracking/unsubscribe", {
        address,
      });
      return { address, data: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unsubscribe"
      );
    }
  }
);

export const updateSubscribe = createAsyncThunk(
  "tracking/update",
  async (
    { address, chains }: { address: string; chains: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/tracking/update", {
        address,
        chains,
      });
      return { address, chains, data: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subscription"
      );
    }
  }
);

export const fetchTransferHistory = createAsyncThunk(
  "tracking/history",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tracking/history");
      return response.data; // Assuming response.data is TokenTransfer[] or { data: TokenTransfer[] }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  }
);
