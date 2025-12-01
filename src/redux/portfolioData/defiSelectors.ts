import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootreducers";
import { DefiState } from "./defiReducer";

const selectDefiState = (state: RootState): DefiState => state.defiData;

export const selectDefiProtocols = createSelector(
  [selectDefiState],
  (defi) => defi.protocols
);

export const selectDefiChainSummaries = createSelector(
  [selectDefiState],
  (defi) => defi.chainSummaries
);

export const selectDefiLoading = createSelector(
  [selectDefiState],
  (defi) => defi.isLoading
);

export const selectDefiError = createSelector(
  [selectDefiState],
  (defi) => defi.error
);

export const selectDefiLastUpdated = createSelector(
  [selectDefiState],
  (defi) => defi.lastUpdated
);

// Get summary for a specific chain
export const selectDefiChainSummary = (chainId: number) =>
  createSelector([selectDefiChainSummaries], (summaries) =>
    summaries.find((s) => s.chainId === chainId)
  );

// Get all chain IDs with DeFi positions
export const selectDefiChainIds = createSelector(
  [selectDefiChainSummaries],
  (summaries) => summaries.map((s) => s.chainId)
);
