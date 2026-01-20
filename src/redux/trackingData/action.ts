import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import { selectSubscribedAddresses } from "./reducer";

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
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tracking/subscribe", {
        address,
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
  async (userId: string) => {
    try {
      const response = await axiosInstance.get("/tracking/addresses");
      const addresses = response?.data?.data?.items;
      return addresses;
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
