export const formatCryptoMarketData = (data: any) => {
  if (!data?.chartData || !Array.isArray(data.chartData)) return null;

  const marketData = data.market_data || {};
  const tickers = data.tickers || [];
  const topTicker = tickers[0] || {};
  const coinId = data.coinId || data.id || "";

  return {
    type: "CRYPTO_MARKET_DATA",
    id: coinId,
    symbol: data.symbol || coinId.toUpperCase(),
    name: data.name || coinId.charAt(0).toUpperCase() + coinId.slice(1),
    image: {
      thumb:
        data.image?.thumb ||
        `https://assets.coingecko.com/coins/images/1/thumb/${coinId}.png`,
      large:
        data.image?.large ||
        `https://assets.coingecko.com/coins/images/1/large/${coinId}.png`,
    },
    categories: data.categories || [],
    market: {
      price_usd:
        marketData.current_price?.usd ||
        data.chartData[data.chartData.length - 1][1],
      price_change_1h:
        marketData.price_change_percentage_1h_in_currency?.usd || 0,
      price_change_24h:
        marketData.price_change_percentage_24h_in_currency?.usd || 0,
      price_change_7d:
        marketData.price_change_percentage_7d_in_currency?.usd || 0,
      price_change_30d:
        marketData.price_change_percentage_30d_in_currency?.usd || 0,
      high_24h:
        marketData.high_24h?.usd ||
        Math.max(...data.chartData.map((d: any) => d[1])),
      low_24h:
        marketData.low_24h?.usd ||
        Math.min(...data.chartData.map((d: any) => d[1])),
      ath_usd:
        marketData.ath?.usd ||
        Math.max(...data.chartData.map((d: any) => d[1])),
      ath_change_pct: marketData.ath_change_percentage?.usd || 0,
      ath_date: marketData.ath_date?.usd || new Date().toISOString(),
      market_cap:
        marketData.market_cap?.usd ||
        data.chartData[data.chartData.length - 1][2],
      market_cap_rank: marketData.market_cap_rank || 0,
      volume_24h: marketData.total_volume?.usd || 0,
      circulating_supply: marketData.circulating_supply || 0,
      max_supply: marketData.max_supply || 0,
      supply_pct_mined:
        marketData.max_supply > 0
          ? marketData.circulating_supply / marketData.max_supply
          : 0,
    },
    chart: {
      prices: data.chartData,
    },
    sentiment: {
      positive_pct: data.sentiment_votes_up_percentage || 50,
      negative_pct: data.sentiment_votes_down_percentage || 50,
      watchlist_count: data.watchlist_portfolio_users || 0,
    },
    liquidity: {
      top_exchange: topTicker.market?.name || "N/A",
      last_traded_price: topTicker.last || marketData.current_price?.usd || 0,
      volume_on_top_exchange: topTicker.volume || 0,
      spread_pct: topTicker.bid_ask_spread_percentage || 0,
      trust_score: topTicker.trust_score || "white",
    },
  };
};

export const formatDcaSimulationData = (data: any) => {
  return {
    ...data,
    type: "DCA_SIMULATION",
  };
};

export const formatTweetsData = (data: any) => {
  //   if (data?.data?.length === 0) return null;
  return {
    ...data,
    type: "TWEETS",
  };
};

export const formatLumpSumSimulationData = (data: any) => {
  return {
    ...data,
    type: "LUMP_SUM_SIMULATION",
  };
};

/**
 * Formatter for ORDER_TX data from async tool data
 * Extracts transactions array and normalizes them to ToolOutput format
 */
export const formatOrderTxData = (data: any) => {
  if (!data?.transactions || !Array.isArray(data.transactions)) {
    return {
      type: "ORDER_TX",
      transactions: [],
      orderDetails: data?.orderDetails || {},
    };
  }

  // Normalize transactions to match ToolOutput interface
  const normalizedTransactions = data.transactions.map(
    (tx: any, idx: number) => ({
      id: idx + 1,
      label: tx.metadata?.order?.type || `Order #${idx + 1}`,
      transaction: tx.transaction || {},
      metadata: tx.metadata || {},
      metaData: tx.metadata || {}, // Some components use metaData instead of metadata
      // NOTE: executionId intentionally omitted here - the parent executionId
      // will be set by resolvePendingAsyncData reducer. Per-tx executionId from
      // payload.transactions[] is NOT the one recognized by the backend DB.
      type: "ORDER_TX",
    }),
  );

  return {
    type: "ORDER_TX",
    transactions: normalizedTransactions,
    orderDetails: data.orderDetails || {},
    requiresApproval: data.requiresApproval || false,
    txCount: data.txCount || normalizedTransactions.length,
  };
};

export const dataOutputFormatters: Record<string, (data: any) => any> = {
  CRYPTO_MARKET_DATA: formatCryptoMarketData,
  DCA_SIMULATION: formatDcaSimulationData,
  LUMP_SUM_SIMULATION: formatLumpSumSimulationData,
  TWEETS: formatTweetsData,
  TWITTER_LATEST_TWEETS: formatTweetsData, // Map to TWEETS type for rendering
  ORDER_TX: formatOrderTxData,
};
