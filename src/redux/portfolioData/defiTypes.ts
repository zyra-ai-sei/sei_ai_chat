// Types for DeFi positions from /portfolio/defiPositions

export interface DefiToken {
  token_type: string;
  name: string;
  symbol: string;
  contract_address: string;
  decimals: string;
  logo: string;
  thumbnail: string;
  balance: string;
  balance_formatted: string;
  usd_price: number | null;
  usd_value: number | null;
}

export interface DefiPosition {
  label: string;
  tokens: DefiToken[];
  address: string;
  balance_usd: number;
  total_unclaimed_usd_value: number | null;
  position_details: Record<string, any>;
}

export interface DefiProtocol {
  protocol_name: string;
  protocol_id: string;
  protocol_url: string;
  protocol_logo: string;
  account_data: Record<string, any>;
  total_projected_earnings_usd: {
    daily: number | null;
    weekly: number | null;
    monthly: number | null;
    yearly: number | null;
  };
  position: DefiPosition;
  chainId: number;
}

export interface DefiApiResponse {
  status: number;
  data: {
    items: DefiProtocol[];
  };
}

// Derived/computed
export interface DefiChainSummary {
  chainId: number;
  chainName: string;
  totalDefiUsd: number;
  totalProjectedEarnings: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  protocols: DefiProtocol[];
}

// Chain ID to name mapping (imported by both reducers)
export const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  137: "Polygon",
  42161: "Arbitrum",
  8453: "Base",
  1329: "SEI",
};
