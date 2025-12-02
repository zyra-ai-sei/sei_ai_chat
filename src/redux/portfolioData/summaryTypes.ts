// Types for Portfolio Summary from /portfolio/summary

export interface PortfolioSummaryItem {
  chainId: number;
  total_count_of_trades: number;
  total_realized_profit_usd: string | number;
  // Add other fields as needed based on actual API response
}

export interface PortfolioSummaryApiResponse {
  status: number;
  data: {
    items: PortfolioSummaryItem[];
  };
}

export interface PortfolioSummaryState {
  items: PortfolioSummaryItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// Computed summary statistics
export interface PortfolioSummaryStats {
  totalTrades: number;
  totalRealizedProfitUsd: number;
  chainCount: number;
  chainIds: number[];
}
