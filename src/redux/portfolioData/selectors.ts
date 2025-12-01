import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootreducers";
import { PortfolioState, ChainBalance, PortfolioToken } from "./types";

// Base selector
const selectPortfolioState = (state: RootState): PortfolioState =>
  state.portfolioData;

// Raw data selectors
export const selectPortfolioTokens = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.tokens
);

export const selectPortfolioLoading = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.isLoading
);

export const selectPortfolioError = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.error
);

export const selectPortfolioLastUpdated = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.lastUpdated
);

// Computed value selectors
export const selectTotalUsdBalance = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.totalUsdBalance
);

export const selectTotalUsdChange24hr = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.totalUsdChange24hr
);

export const selectPercentageChange24hr = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.percentageChange24hr
);

export const selectIsPositiveChange = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.totalUsdChange24hr >= 0
);

// Token shares for allocation chart
export const selectTokenShares = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.tokenShares
);

// Top N tokens by USD value
export const selectTopTokens = (limit: number = 5) =>
  createSelector([selectTokenShares], (shares) => shares.slice(0, limit));

// Chain balances with native tokens
export const selectChainBalances = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.chainBalances
);

// Get specific chain balance
export const selectChainBalance = (chainId: number) =>
  createSelector([selectChainBalances], (chains) =>
    chains.find((c) => c.chainId === chainId)
  );

// Get native token for specific chain
export const selectNativeToken = (chainId: number) =>
  createSelector([selectChainBalances], (chains) => {
    const chain = chains.find((c) => c.chainId === chainId);
    return chain?.nativeToken || null;
  });

// SEI specific selectors (chainId: 1329)
export const selectSeiBalance = createSelector(
  [selectChainBalances],
  (chains): ChainBalance | undefined => chains.find((c) => c.chainId === 1329)
);

export const selectSeiNativeToken = createSelector(
  [selectSeiBalance],
  (seiChain): PortfolioToken | null => seiChain?.nativeToken || null
);

// Get all stablecoins (USDC, USDT, etc.)
export const selectStablecoins = createSelector(
  [selectPortfolioTokens],
  (tokens): PortfolioToken[] =>
    tokens.filter((t) =>
      ["USDC", "USDT", "USDC.n", "USDs", "LUSD", "USD₮0"].includes(t.symbol)
    )
);

// Total stablecoin balance
export const selectTotalStablecoinBalance = createSelector(
  [selectStablecoins],
  (stablecoins) =>
    stablecoins.reduce((total, token) => total + (token.usd_value || 0), 0)
);

// Dashboard-ready data object
export const selectDashboardPortfolioData = createSelector(
  [
    selectTotalUsdBalance,
    selectPercentageChange24hr,
    selectIsPositiveChange,
    selectSeiNativeToken,
    selectTotalStablecoinBalance,
    selectTokenShares,
    selectChainBalances,
    selectPortfolioLoading,
    selectPortfolioError,
  ],
  (
    totalValue,
    percentageChange,
    isPositive,
    seiToken,
    stablecoinBalance,
    tokenShares,
    chainBalances,
    isLoading,
    error
  ) => ({
    // Portfolio stats card
    portfolioStats: {
      totalValue,
      performanceScore: percentageChange,
      isPerformancePositive: isPositive,
    },

    // SEI balance card
    seiBalance: seiToken
      ? {
          balance: parseFloat(seiToken.balance_formatted),
          symbol: seiToken.symbol,
          usdValue: seiToken.usd_value,
          price: seiToken.usd_price,
        }
      : null,

    // Stablecoin balance card
    stablecoinBalance: {
      balance: stablecoinBalance,
      canClaim: false, // This would come from a different API
      claimAmount: 0,
    },

    // Asset allocation for pie chart
    assetAllocation: tokenShares,

    // Chain balances for chain breakdown
    chainBalances,

    // Loading state
    isLoading,
    error,
  })
);
