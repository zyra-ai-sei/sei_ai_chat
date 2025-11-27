import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TokenVisualizationData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    large: string;
  };
  categories: string[];
  market: {
    price_usd: number;
    price_change_1h: number;
    price_change_24h: number;
    price_change_7d: number;
    price_change_30d: number;
    high_24h: number;
    low_24h: number;
    ath_usd: number;
    ath_change_pct: number;
    ath_date: string;
    market_cap: number;
    market_cap_rank: number;
    volume_24h: number;
    circulating_supply: number;
    max_supply: number;
    supply_pct_mined: number;
  };
  chart?: {
    prices: [number, number][]; // [timestamp, price]
  };
  sentiment: {
    positive_pct: number;
    negative_pct: number;
    watchlist_count: number;
  };
  developer_activity: {
    stars: number;
    forks: number;
    commit_count_4_weeks: number;
    pull_requests_merged: number;
    contributors: number;
  };
  liquidity: {
    top_exchange: string;
    last_traded_price: number;
    volume_on_top_exchange: number;
    spread_pct: number;
    trust_score: string;
  };
}

export interface TokenVisualizationState {
  currentToken: TokenVisualizationData | null;
  isLoading: boolean;
}

const initialState: TokenVisualizationState = {
  currentToken: null,
  isLoading: false,
};

export const tokenVisualizationSlice = createSlice({
  name: "tokenVisualization",
  initialState,
  reducers: {
    setTokenVisualization(
      state,
      action: PayloadAction<TokenVisualizationData>
    ) {
      state.currentToken = action.payload;
      state.isLoading = false;
    },
    clearTokenVisualization(state) {
      state.currentToken = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setTokenVisualization, clearTokenVisualization, setLoading } =
  tokenVisualizationSlice.actions;

export default tokenVisualizationSlice.reducer;
