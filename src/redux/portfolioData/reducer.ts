import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PortfolioState,
  PortfolioToken,
  TokenShare,
  ChainBalance,
  CHAIN_NAMES,
} from "./types";

const initialState: PortfolioState = {
  // Raw API data
  tokens: [],

  // Computed values
  totalUsdBalance: 0,
  totalUsdChange24hr: 0,
  percentageChange24hr: 0,

  // Token shares (for pie chart / allocation)
  tokenShares: [],

  // Native balances per chain
  chainBalances: [],

  // Loading states
  isLoading: false,
  error: null,
  lastUpdated: null,
  cachedAddress: null,
};

// Helper function to compute total USD balance from tokens
const computeTotalUsdBalance = (tokens: PortfolioToken[]): number => {
  return tokens.reduce((total, token) => total + (token.usd_value || 0), 0);
};

// Helper function to compute total 24hr USD change
const computeTotalUsdChange24hr = (tokens: PortfolioToken[]): number => {
  return tokens.reduce(
    (total, token) => total + (token.usd_value_24hr_usd_change || 0),
    0
  );
};

// Helper function to compute percentage change
const computePercentageChange24hr = (
  totalBalance: number,
  totalChange: number
): number => {
  if (totalBalance === 0) return 0;
  const previousBalance = totalBalance - totalChange;
  if (previousBalance === 0) return 0;
  return (totalChange / previousBalance) * 100;
};

// Helper function to compute token shares (percentage of total portfolio)
const computeTokenShares = (
  tokens: PortfolioToken[],
  totalUsdBalance: number
): TokenShare[] => {
  // Filter out tokens with 0 USD value and aggregate by symbol
  const tokenMap = new Map<string, TokenShare>();

  tokens.forEach((token) => {
    if (token.usd_value > 0) {
      const key = `${token.symbol}-${token.chainId}`;
      const existing = tokenMap.get(key);

      if (existing) {
        existing.usdValue += token.usd_value;
        existing.percentageShare =
          totalUsdBalance > 0
            ? (existing.usdValue / totalUsdBalance) * 100
            : 0;
      } else {
        tokenMap.set(key, {
          symbol: token.symbol,
          name: token.name,
          logo: token.logo,
          usdValue: token.usd_value,
          percentageShare:
            totalUsdBalance > 0
              ? (token.usd_value / totalUsdBalance) * 100
              : 0,
          chainId: token.chainId,
          balance_formatted: token.balance_formatted,
          usd_price: token.usd_price,
          usd_price_24hr_percent_change: token.usd_price_24hr_percent_change,
        });
      }
    }
  });

  // Sort by USD value descending
  return Array.from(tokenMap.values()).sort((a, b) => b.usdValue - a.usdValue);
};

// Helper function to compute chain balances with native tokens
const computeChainBalances = (tokens: PortfolioToken[]): ChainBalance[] => {
  const chainMap = new Map<number, ChainBalance>();

  tokens.forEach((token) => {
    const existing = chainMap.get(token.chainId);

    if (existing) {
      existing.totalUsdValue += token.usd_value || 0;
      existing.tokens.push(token);
      if (token.native_token) {
        existing.nativeToken = token;
      }
    } else {
      chainMap.set(token.chainId, {
        chainId: token.chainId,
        chainName: CHAIN_NAMES[token.chainId] || `Chain ${token.chainId}`,
        nativeToken: token.native_token ? token : null,
        totalUsdValue: token.usd_value || 0,
        tokens: [token],
      });
    }
  });

  // Sort by total USD value descending
  return Array.from(chainMap.values()).sort(
    (a, b) => b.totalUsdValue - a.totalUsdValue
  );
};

export const portfolioDataSlice = createSlice({
  name: "portfolioData",
  initialState,
  reducers: {
    // Set loading state
    setPortfolioLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setPortfolioError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set portfolio data from API response
    setPortfolioData: (state, action: PayloadAction<{tokens: PortfolioToken[], address: string}>) => {
      const { tokens, address } = action.payload;

      // Store raw tokens
      state.tokens = tokens;

      // Compute derived values
      state.totalUsdBalance = computeTotalUsdBalance(tokens);
      state.totalUsdChange24hr = computeTotalUsdChange24hr(tokens);
      state.percentageChange24hr = computePercentageChange24hr(
        state.totalUsdBalance,
        state.totalUsdChange24hr
      );

      // Compute token shares for allocation chart
      state.tokenShares = computeTokenShares(tokens, state.totalUsdBalance);

      // Compute chain balances with native tokens
      state.chainBalances = computeChainBalances(tokens);

      // Update metadata
      state.lastUpdated = Date.now();
      state.cachedAddress = address;
      state.isLoading = false;
      state.error = null;
    },

    // Clear portfolio data
    clearPortfolioData: (state) => {
      state.tokens = [];
      state.totalUsdBalance = 0;
      state.totalUsdChange24hr = 0;
      state.percentageChange24hr = 0;
      state.tokenShares = [];
      state.chainBalances = [];
      state.lastUpdated = null;
      state.cachedAddress = null;
      state.error = null;
    },
  },
});

export const {
  setPortfolioLoading,
  setPortfolioError,
  setPortfolioData,
  clearPortfolioData,
} = portfolioDataSlice.actions;

export default portfolioDataSlice.reducer;
