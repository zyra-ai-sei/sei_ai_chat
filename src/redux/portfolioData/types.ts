// Portfolio Data Types
// These types represent the API response structure from /portfolio/totalBalance

export interface PortfolioToken {
  token_address: string;
  symbol: string;
  name: string;
  logo: string | null;
  thumbnail: string | null;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  total_supply: string | null;
  total_supply_formatted: string | null;
  percentage_relative_to_total_supply: number | null;
  security_score: number | null;
  balance_formatted: string;
  usd_price: number;
  usd_price_24hr_percent_change: number;
  usd_price_24hr_usd_change: number;
  usd_value: number;
  usd_value_24hr_usd_change: number;
  native_token: boolean;
  portfolio_percentage: number;
  chainId: number;
}

export interface PortfolioApiResponse {
  status: number;
  data: {
    items: PortfolioToken[];
  };
}

// Derived/computed data structures for the dashboard

export interface ChainBalance {
  chainId: number;
  chainName: string;
  nativeToken: PortfolioToken | null;
  totalUsdValue: number;
  tokens: PortfolioToken[];
}

export interface TokenShare {
  symbol: string;
  name: string;
  logo: string | null;
  usdValue: number;
  percentageShare: number;
  chainId: number;
  balance_formatted: string;
  usd_price: number;
  usd_price_24hr_percent_change: number;
}

export interface PortfolioState {
  // Raw API data
  tokens: PortfolioToken[];
  
  // Computed values
  totalUsdBalance: number;
  totalUsdChange24hr: number;
  percentageChange24hr: number;
  
  // Token shares (for pie chart / allocation)
  tokenShares: TokenShare[];
  
  // Native balances per chain
  chainBalances: ChainBalance[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  cachedAddress: string | null;
}

// Chain ID to name mapping
export const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  137: "Polygon",
  42161: "Arbitrum",
  8453: "Base",
  1329: "SEI",
};
