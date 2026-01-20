import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootreducers";
import { PortfolioSummaryState, PortfolioSummaryStats } from "./summaryTypes";

const selectSummaryState = (state: RootState): PortfolioSummaryState =>
  state.portfolioSummaryData;

export const selectSummaryItems = createSelector(
  [selectSummaryState],
  (state) => state.items
);

export const selectSummaryLoading = createSelector(
  [selectSummaryState],
  (state) => state.isLoading
);

export const selectSummaryError = createSelector(
  [selectSummaryState],
  (state) => state.error
);

export const selectSummaryLastUpdated = createSelector(
  [selectSummaryState],
  (state) => state.lastUpdated
);

// Computed summary statistics
export const selectSummaryStats = createSelector(
  [selectSummaryItems],
  (items): PortfolioSummaryStats => {
    const totalTrades = items.reduce(
      (acc, item) => acc + (item.total_count_of_trades || 0),
      0
    );

    const totalRealizedProfitUsd = items.reduce(
      (acc, item) => acc + Number(item.total_realized_profit_usd || 0),
      0
    );

    const totalBuys = items.reduce(
      (acc, item) => acc + (item.total_buys || 0),
      0
    );

    const totalSells = items.reduce(
      (acc, item) => acc + (item.total_sells || 0),
      0
    );

    const avgProfitPercentage = items.length > 0 
      ? items.reduce((acc, item) => acc + (item.profit_percentage || 0), 0) / items.length
      : 0;

    const chainIds = items.map((item) => item.chainId);

    return {
      totalTrades,
      totalRealizedProfitUsd,
      totalBuys,
      totalSells,
      avgProfitPercentage,
      chainCount: chainIds.length,
      chainIds,
    };
  }
);

// Check if summary data is stale (> 5 minutes old)
export const selectSummaryIsStale = createSelector(
  [selectSummaryLastUpdated],
  (lastUpdated) => {
    if (!lastUpdated) return true;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    return Date.now() - lastUpdated > CACHE_DURATION;
  }
);
