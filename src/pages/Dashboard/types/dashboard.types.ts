// Dashboard Types - All interfaces for dashboard data structures
// Values marked with /* API */ comment will be replaced by API calls

export interface PortfolioStats {
  totalValue: number; /* API */
  performanceScore: number; /* API */
  isPerformancePositive: boolean; /* API */
}

export interface SeiBalance {
  balance: number; /* API */
  symbol: string;
  usdValue: number; /* API */
  price: number; /* API */
}

export interface StablecoinBalance {
  balance: number; /* API */
  canClaim: boolean; /* API */
  claimAmount: number; /* API */
}

export interface AiPortfolioManagement {
  mode: "Manual Mode" | "Auto Mode"; /* API */
  isAutoEnabled: boolean; /* API */
  activeCategories: number; /* API */
  totalCategories: number;
}

export interface AssetCategory {
  id: string;
  shortName: string;
  name: string;
  tag: string;
  color: string;
  value: number; /* API */
  percentage: number; /* API */
  description: string;
}

export interface PortfolioPerformanceData {
  date: string;
  value: number; /* API */
}

// Alias for component compatibility
export type PerformanceDataPoint = PortfolioPerformanceData;

export interface YieldPerformanceData {
  month: string;
  predicted: number; /* API */
  actual?: number; /* API */
}

export interface DashboardData {
  portfolioStats: PortfolioStats;
  seiBalance: SeiBalance;
  stablecoinBalance: StablecoinBalance;
  aiManagement: AiPortfolioManagement;
  assetAllocation: AssetCategory[];
  portfolioPerformance: PortfolioPerformanceData[];
  yieldPerformance: YieldPerformanceData[];
}

export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "All";

// TimePeriod alias for time selector components
export type TimePeriod = TimeRange;

