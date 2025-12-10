export interface LumpSumSummary {
  total_investment: number;
  buy_price: number;
  tokens_bought: number;
  current_value: number;
  return_pct: number;
}

export interface LumpSumChartData {
  prices: Array<[number, number]>;
  buy_point: [number, number, number]; // [timestamp, price, tokens_bought]
  portfolio_values: Array<[number, number]>;
}

export interface LumpSumProjections {
  expected_annual_return: number;
  annual_volatility: number;
  pct_10_value: number;
  pct_50_value: number;
  pct_90_value: number;
  paths: number;
  horizon_days: number;
}

export interface LumpSumResponse {
  summary: LumpSumSummary;
  chartData: LumpSumChartData;
  projections: LumpSumProjections;
}

export interface LumpSumSimulationParams {
  coin: string;
  total_investment: number;
  duration_days: number;
}

export interface LumpSumApiResponse {
  success: boolean;
  data?: LumpSumResponse;
  error?: string;
}
