// Dashboard Page - Main dashboard component composing all sections
// Uses Redux portfolioData for portfolio balance information
import { useEffect, useState } from "react";
import {
  PortfolioValueCard,
  ChainBalanceCard,
  StablecoinCard,
  AiManagementCard,
  AssetAllocationSection,
  PortfolioPerformanceSection,
  YieldPerformanceChart,
  StatCard,
} from "./components";
import { MOCK_DASHBOARD_DATA } from "./constants/dashboard.constants";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  fetchPortfolioBalance,
  selectTotalUsdBalance,
  selectPercentageChange24hr,
  selectIsPositiveChange,
  selectChainBalances,
  selectTotalStablecoinBalance,
  selectPortfolioLoading,
  selectPortfolioError,
  fetchDefiPositions,
  selectDefiChainSummaries,
  selectDefiLoading,
  selectDefiError,
  selectDefiChainIds,
  selectDefiProtocols,
} from "@/redux/portfolioData";

import ChainDropdown from "./components/ChainDropdown";
import { defiToAssetCategories } from "./utils/defiDashboard.utils";
import { axiosInstance } from "@/services/axios";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  // Portfolio data from Redux
  const totalUsdBalance = useAppSelector(selectTotalUsdBalance);
  const percentageChange = useAppSelector(selectPercentageChange24hr);
  const isPositiveChange = useAppSelector(selectIsPositiveChange);
  const chainBalances = useAppSelector(selectChainBalances);
  const stablecoinBalance = useAppSelector(selectTotalStablecoinBalance);
  const isLoading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  // DeFi data from Redux
  const defiChainSummaries = useAppSelector(selectDefiChainSummaries);
  const defiLoading = useAppSelector(selectDefiLoading);
  const defiError = useAppSelector(selectDefiError);
  const defiChainIds = useAppSelector(selectDefiChainIds);
  const defiProtocols = useAppSelector(selectDefiProtocols);

  // State for /portfolio/summary API
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Chain selection state for DeFi sections
  const [selectedDefiChainId, setSelectedDefiChainId] = useState<number>(() =>
    defiChainIds.length > 0 ? defiChainIds[0] : 1
  );

  const totalBorrowedUsd = defiProtocols.reduce(
    (sum: number, protocol: any) => {
      if (!protocol.position?.tokens) return sum;
      return (
        sum +
        protocol.position.tokens
          .filter((t: any) => t.token_type?.toLowerCase() === "borrowed")
          .reduce(
            (s: number, t: any) =>
              s + (typeof t.usd_value === "number" ? t.usd_value : 0),
            0
          )
      );
    },
    0
  );

  // Update selected chain if available chains change
  useEffect(() => {
    if (
      defiChainIds.length > 0 &&
      !defiChainIds.includes(selectedDefiChainId)
    ) {
      setSelectedDefiChainId(defiChainIds[0]);
    }
  }, [defiChainIds, selectedDefiChainId]);

  // Fetch portfolio and DeFi data on mount
  useEffect(() => {
    dispatch(fetchPortfolioBalance());
    dispatch(fetchDefiPositions());
    setSummaryLoading(true);
    axiosInstance("/portfolio/summary")
      .then((res) => {
        if (
          res?.data?.status === 200 &&
          Array.isArray(res?.data?.data?.items)
        ) {
          setSummaryData(res.data.data.items);
          setSummaryError(null);
        } else {
          setSummaryError("Invalid summary response");
        }
      })
      .catch((err) => {
        setSummaryError(err?.message || "Failed to fetch summary");
      })
      .finally(() => setSummaryLoading(false));
  }, [dispatch]);

  // Portfolio stats for PortfolioValueCard
  const portfolioStats = {
    totalValue: totalUsdBalance,
    performanceScore: percentageChange,
    isPerformancePositive: isPositiveChange,
  };

  // Stablecoin data for StablecoinCard
  const stablecoinData = {
    balance: stablecoinBalance,
    canClaim: false, // This would come from a different API
    claimAmount: 0,
  };

  const handleAiModeToggle = (isAutoEnabled: boolean) => {
    // TODO: API call to toggle AI mode
    console.log("AI Mode toggled:", isAutoEnabled);
  };

  const handleClaimStablecoin = () => {
    // TODO: API call to claim stablecoin
    console.log("Claiming stablecoin...");
  };

  if (isLoading && chainBalances.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-[#2AF598] rounded-full animate-spin" />
          <span className="text-sm text-white/60">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error && chainBalances.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="text-white/60">
          Failed to load dashboard data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-white/60">
            Overview of your portfolio and performance
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <PortfolioValueCard data={portfolioStats} />
          {/* Duplicate PortfolioValueCard with trade/profit info from summary */}
          <StatCard title="Trading Summary">
            {summaryLoading ? (
              <span className="text-white/60">Loading...</span>
            ) : summaryError ? (
              <span className="text-red-400">{summaryError}</span>
            ) : summaryData.length > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">
                  Total Trades:{" "}
                  {summaryData.reduce(
                    (acc, c) => acc + (c.total_count_of_trades || 0),
                    0
                  )}
                </span>
                <span className="text-sm">
                  Total Realized Profit: ${" "}
                  {summaryData
                    .reduce(
                      (acc, c) =>
                        acc + Number(c.total_realized_profit_usd || 0),
                      0
                    )
                    .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-white/60">
                  Chains: {summaryData.map((c) => c.chainId).join(", ")}
                </span>
              </div>
            ) : (
              <span className="text-white/60">No data</span>
            )}
          </StatCard>
          <ChainBalanceCard
            chainBalances={chainBalances}
            isLoading={isLoading}
          />
          <StablecoinCard
            data={stablecoinData}
            onClaim={handleClaimStablecoin}
          />
          <AiManagementCard
            data={{
              ...MOCK_DASHBOARD_DATA.aiManagement,
              activeCategories: summaryData.reduce(
                (acc, c) => acc + (c.total_count_of_trades || 0),
                0
              ),
              totalCategories: summaryData.length,
              borrowedUsd: totalBorrowedUsd,
            }}
            onToggle={handleAiModeToggle}
          />
        </div>

        {/* Asset Allocation Section (DeFi) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white/80">
              DeFi Asset Allocation
            </span>
            {defiChainIds.length > 1 && (
              <ChainDropdown
                chainIds={defiChainIds}
                selectedChainId={selectedDefiChainId}
                onSelect={setSelectedDefiChainId}
              />
            )}
          </div>
          {defiLoading ? (
            <div className="py-8 text-center text-white/60">
              Loading DeFi data...
            </div>
          ) : defiError ? (
            <div className="py-8 text-center text-red-400">{defiError}</div>
          ) : (
            <AssetAllocationSection
              assets={(() => {
                const summary = defiChainSummaries.find(
                  (s) => s.chainId === selectedDefiChainId
                );
                return summary ? defiToAssetCategories(summary) : [];
              })()}
              totalValue={(() => {
                const summary = defiChainSummaries.find(
                  (s) => s.chainId === selectedDefiChainId
                );
                return summary ? summary.totalDefiUsd : 0;
              })()}
            />
          )}
        </div>

        {/* Yield Performance Section (DeFi) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white/80">
              DeFi Yield Performance
            </span>
            {defiChainIds.length > 1 && (
              <ChainDropdown
                chainIds={defiChainIds}
                selectedChainId={selectedDefiChainId}
                onSelect={setSelectedDefiChainId}
              />
            )}
          </div>
          {defiLoading ? (
            <div className="py-8 text-center text-white/60">
              Loading DeFi data...
            </div>
          ) : defiError ? (
            <div className="py-8 text-center text-red-400">{defiError}</div>
          ) : (
            <YieldPerformanceChart
              data={(() => {
                const summary = defiChainSummaries.find(
                  (s) => s.chainId === selectedDefiChainId
                );
                if (!summary) return [];
                // Map projected earnings to YieldPerformanceData[]
                return [
                  {
                    month: "Daily",
                    predicted: summary.totalProjectedEarnings.daily,
                  },
                  {
                    month: "Weekly",
                    predicted: summary.totalProjectedEarnings.weekly,
                  },
                  {
                    month: "Monthly",
                    predicted: summary.totalProjectedEarnings.monthly,
                  },
                  {
                    month: "Yearly",
                    predicted: summary.totalProjectedEarnings.yearly,
                  },
                ];
              })()}
            />
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PortfolioPerformanceSection
            data={MOCK_DASHBOARD_DATA.portfolioPerformance}
            isWalletConnected={chainBalances.length > 0}
          />
          <YieldPerformanceChart data={MOCK_DASHBOARD_DATA.yieldPerformance} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
