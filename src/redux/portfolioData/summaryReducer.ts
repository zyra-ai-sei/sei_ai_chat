import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PortfolioSummaryItem, PortfolioSummaryState } from "./summaryTypes";

const initialState: PortfolioSummaryState = {
  items: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  cachedAddress: null,
};

export const portfolioSummarySlice = createSlice({
  name: "portfolioSummary",
  initialState,
  reducers: {
    setSummaryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSummaryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSummaryData: (state, action: PayloadAction<{items: PortfolioSummaryItem[], address: string}>) => {
      const { items, address } = action.payload;
      state.items = items;
      state.lastUpdated = Date.now();
      state.cachedAddress = address;
      state.isLoading = false;
      state.error = null;
    },
    clearSummaryData: (state) => {
      state.items = [];
      state.lastUpdated = null;
      state.cachedAddress = null;
      state.error = null;
    },
  },
});

export const {
  setSummaryLoading,
  setSummaryError,
  setSummaryData,
  clearSummaryData,
} = portfolioSummarySlice.actions;

export default portfolioSummarySlice.reducer;
