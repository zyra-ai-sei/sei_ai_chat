import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PortfolioSummaryItem, PortfolioSummaryState } from "./summaryTypes";

const initialState: PortfolioSummaryState = {
  items: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
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
    setSummaryData: (state, action: PayloadAction<PortfolioSummaryItem[]>) => {
      state.items = action.payload;
      state.lastUpdated = Date.now();
      state.isLoading = false;
      state.error = null;
    },
    clearSummaryData: (state) => {
      state.items = [];
      state.lastUpdated = null;
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
