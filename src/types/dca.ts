export interface DcaSummary {
  total_investment: number;
  buy_count: number;
  average_buy_price: number;
  total_tokens: number;
  current_value: number;
  return_pct: number;
}

// Raw buy point format from backend: [timestamp, price, tokens_bought]
export type DcaBuyPointRaw = [number, number, number];

// Transformed buy point for UI display
export interface DcaBuyPoint {
  date: string;
  timestamp: number;
  price: number;
  tokens_bought: number;
  amount_invested: number; // Calculated: price * tokens_bought
}

export interface DcaChartData {
  prices: Array<[number, number]>; // [timestamp, price]
  buy_points: DcaBuyPointRaw[]; // Raw format from backend
  portfolio_values: Array<[number, number]>; // [timestamp, value]
}

export interface DcaMonteCarloProjections {
  pct_10: number; // Bearish (10th percentile)
  pct_50: number; // Median (50th percentile)
  pct_90: number; // Bullish (90th percentile)
}

export interface DcaProjections {
  expected_annual_return: number; // Percentage as decimal (-2.165 = -216.5%)
  annual_volatility: number; // Percentage as decimal (0.917 = 91.7%)
  mc: DcaMonteCarloProjections;
}

export interface DcaResponse {
  summary: DcaSummary;
  chartData: DcaChartData;
  projections: DcaProjections;
}

export interface DcaSimulationParams {
  coin: string;
  total_investment: number;
  frequency: "daily" | "weekly";
  duration_days: number;
}

export interface DcaApiResponse {
  success: boolean;
  data?: DcaResponse;
  error?: string;
}
