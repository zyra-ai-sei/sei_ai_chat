import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefiProtocol, DefiChainSummary, CHAIN_NAMES } from "./defiTypes";

export interface DefiState {
  protocols: DefiProtocol[];
  chainSummaries: DefiChainSummary[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: DefiState = {
  protocols: [],
  chainSummaries: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

function computeChainSummaries(protocols: DefiProtocol[]): DefiChainSummary[] {
  const chainMap = new Map<number, DefiChainSummary>();

  protocols.forEach((protocol) => {
    const chainId = protocol.chainId;
    const existing = chainMap.get(chainId);
    const earnings = protocol.total_projected_earnings_usd;
    const positionUsd = protocol.position?.balance_usd || 0;
    if (existing) {
      existing.totalDefiUsd += positionUsd;
      existing.totalProjectedEarnings.daily += earnings.daily || 0;
      existing.totalProjectedEarnings.weekly += earnings.weekly || 0;
      existing.totalProjectedEarnings.monthly += earnings.monthly || 0;
      existing.totalProjectedEarnings.yearly += earnings.yearly || 0;
      existing.protocols.push(protocol);
    } else {
      chainMap.set(chainId, {
        chainId,
        chainName: CHAIN_NAMES[chainId] || `Chain ${chainId}`,
        totalDefiUsd: positionUsd,
        totalProjectedEarnings: {
          daily: earnings.daily || 0,
          weekly: earnings.weekly || 0,
          monthly: earnings.monthly || 0,
          yearly: earnings.yearly || 0,
        },
        protocols: [protocol],
      });
    }
  });
  return Array.from(chainMap.values()).sort((a, b) => b.totalDefiUsd - a.totalDefiUsd);
}

export const defiDataSlice = createSlice({
  name: "defiData",
  initialState,
  reducers: {
    setDefiLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDefiError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setDefiData: (state, action: PayloadAction<DefiProtocol[]>) => {
      state.protocols = action.payload;
      state.chainSummaries = computeChainSummaries(action.payload);
      state.lastUpdated = Date.now();
      state.isLoading = false;
      state.error = null;
    },
    clearDefiData: (state) => {
      state.protocols = [];
      state.chainSummaries = [];
      state.lastUpdated = null;
      state.error = null;
    },
  },
});

export const {
  setDefiLoading,
  setDefiError,
  setDefiData,
  clearDefiData,
} = defiDataSlice.actions;

export default defiDataSlice.reducer;
