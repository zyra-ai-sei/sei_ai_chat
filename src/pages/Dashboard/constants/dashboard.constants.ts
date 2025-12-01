// Mock data for dashboard - Replace with API calls
// All values marked with /* API */ are placeholders for real API data

import { DashboardData, AssetCategory, YieldPerformanceData } from "../types/dashboard.types";

export const MOCK_ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: "bigcap",
    shortName: "BI",
    name: "Big Cap",
    tag: "BIGCAP",
    color: "#8a5bf1",
    value: 2500.0, /* API */
    percentage: 42.0, /* API */
    description: "Large-cap established cryptocurrency",
  },
  {
    id: "l1",
    shortName: "BI",
    name: "Big Cap",
    tag: "L1",
    color: "#45afed",
    value: 400.0, /* API */
    percentage: 15.0, /* API */
    description: "Layer 1 blockchain infrastructure tokens",
  },
  {
    id: "ai",
    shortName: "AI",
    name: "AI & DeFi",
    tag: "AI",
    color: "#6182fb",
    value: 1100.0, /* API */
    percentage: 28.0, /* API */
    description: "AI-powered protocols and machine learning tokens",
  },
  {
    id: "rwa",
    shortName: "RW",
    name: "RWA",
    tag: "RWA",
    color: "#33ec8a",
    value: 200.0, /* API */
    percentage: 10.0, /* API */
    description: "Real-world asset tokenization projects",
  },
  {
    id: "defi",
    shortName: "BI",
    name: "DeFi",
    tag: "DEFI",
    color: "#d570f4",
    value: 1025.0, /* API */
    percentage: 25.0, /* API */
    description: "Decentralized finance protocols and yield farming",
  },
  {
    id: "meme",
    shortName: "ME",
    name: "Meme & NFT",
    tag: "MEME",
    color: "#fc54e1",
    value: 85.0, /* API */
    percentage: 3.0, /* API */
    description: "Community-driven meme tokens and social coins",
  },
];

export const MOCK_YIELD_PERFORMANCE: YieldPerformanceData[] = [
  { month: "Jan", predicted: 1.5 }, /* API */
  { month: "Feb", predicted: 6.0 }, /* API */
  { month: "Mar", predicted: 7.0 }, /* API */
  { month: "Apr", predicted: 9.5 }, /* API */
  { month: "May", predicted: 10.0 }, /* API */
  { month: "Jun", predicted: 9.0 }, /* API */
];

export const MOCK_DASHBOARD_DATA: DashboardData = {
  portfolioStats: {
    totalValue: 0.0, /* API */
    performanceScore: 0.0, /* API */
    isPerformancePositive: false, /* API */
  },
  seiBalance: {
    balance: 0.0, /* API */
    symbol: "SEI",
    usdValue: 0.0, /* API */
    price: 0.3, /* API */
  },
  stablecoinBalance: {
    balance: 0.0, /* API */
    canClaim: true, /* API */
    claimAmount: 100, /* API */
  },
  aiManagement: {
    mode: "Manual Mode", /* API */
    isAutoEnabled: false, /* API */
    activeCategories: 6, /* API */
    totalCategories: 7,
  },
  assetAllocation: MOCK_ASSET_CATEGORIES,
  portfolioPerformance: [],
  yieldPerformance: MOCK_YIELD_PERFORMANCE,
};

export const TIME_RANGES = ["1D", "1W", "1M", "3M", "1Y", "All"] as const;
export const TIME_PERIODS = TIME_RANGES; // Alias for component compatibility
