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
    prices: [number, number, number][]; // [timestamp, price, marketCap]
  };
  sentiment: {
    positive_pct: number;
    negative_pct: number;
    watchlist_count: number;
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
  chartLoading: boolean;
}

const initialState: TokenVisualizationState = {
  currentToken: null,
  isLoading: false,
  chartLoading: false,
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
      state.chartLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setChartLoading(state, action: PayloadAction<boolean>) {
      state.chartLoading = action.payload;
    },
    updateChartData(
      state,
      action: PayloadAction<{ prices: [number, number, number][] }>
    ) {
      console.log('[Reducer] updateChartData called:', {
        hasCurrentToken: !!state.currentToken,
        newPricesLength: action.payload.prices.length,
        samplePrice: action.payload.prices[0]
      });

      if (state.currentToken) {
        state.currentToken.chart = {
          prices: action.payload.prices,
        };
      } else {
        console.warn('[Reducer] Cannot update chart data - no current token!');
      }
    },
  },
});

export const {
  setTokenVisualization,
  clearTokenVisualization,
  setLoading,
  setChartLoading,
  updateChartData,
} = tokenVisualizationSlice.actions;

export default tokenVisualizationSlice.reducer;
