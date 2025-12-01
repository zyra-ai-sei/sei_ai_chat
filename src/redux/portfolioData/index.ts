// Portfolio Data Redux Module
// Handles fetching and computing portfolio balance data

export { default as portfolioReducer } from "./reducer";
export {
  setPortfolioLoading,
  setPortfolioError,
  setPortfolioData,
  clearPortfolioData,
} from "./reducer";
export { fetchPortfolioBalance, refreshPortfolioBalance } from "./action";
export { fetchDefiPositions, refreshDefiPositions } from "./defiAction";
export type {
  PortfolioToken,
  PortfolioApiResponse,
  PortfolioState,
  ChainBalance,
  TokenShare,
} from "./types";
export { CHAIN_NAMES } from "./types";

// Selectors
export {
  selectPortfolioTokens,
  selectPortfolioLoading,
  selectPortfolioError,
  selectPortfolioLastUpdated,
  selectTotalUsdBalance,
  selectTotalUsdChange24hr,
  selectPercentageChange24hr,
  selectIsPositiveChange,
  selectTokenShares,
  selectTopTokens,
  selectChainBalances,
  selectChainBalance,
  selectNativeToken,
  selectSeiBalance,
  selectSeiNativeToken,
  selectStablecoins,
  selectTotalStablecoinBalance,
  selectDashboardPortfolioData,
} from "./selectors";

// DeFi selectors
export {
  selectDefiProtocols,
  selectDefiChainSummaries,
  selectDefiLoading,
  selectDefiError,
  selectDefiLastUpdated,
  selectDefiChainSummary,
  selectDefiChainIds,
} from "./defiSelectors";
