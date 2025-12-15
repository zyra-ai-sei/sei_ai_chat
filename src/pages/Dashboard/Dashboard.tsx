// Dashboard Page - Main dashboard component composing all sections
// Uses Redux portfolioData for portfolio balance information
import { useEffect, useState } from "react";
import {
  PortfolioValueCard,
  ChainBalanceCard,
  PortfolioOverviewCard,
  AssetAllocationSection,
  PortfolioPerformanceSection,
  YieldPerformanceChart,
  StatCard,
  ChainPerformanceCard,
} from "./components";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  fetchPortfolioBalance,
  selectTotalUsdBalance,
  selectPercentageChange24hr,
  selectIsPositiveChange,
  selectChainBalances,
  selectPortfolioLoading,
  selectPortfolioError,
  fetchDefiPositions,
  selectDefiChainSummaries,
  selectDefiLoading,
  selectDefiError,
  selectDefiChainIds,
  fetchPortfolioSummary,
  selectSummaryStats,
  selectSummaryLoading,
  selectSummaryError,
  selectSummaryItems,
} from "@/redux/portfolioData";

import ChainDropdown from "./components/ChainDropdown";
import { defiToAssetCategories } from "./utils/defiDashboard.utils";
import { add } from "lodash";
import { useAccount } from "wagmi";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const {address} = useAccount();

  // Portfolio data from Redux
  const totalUsdBalance = useAppSelector(selectTotalUsdBalance);
  const percentageChange = useAppSelector(selectPercentageChange24hr);
  const isPositiveChange = useAppSelector(selectIsPositiveChange);
  const chainBalances = useAppSelector(selectChainBalances);
  const isLoading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  // DeFi data from Redux
  const defiChainSummaries = useAppSelector(selectDefiChainSummaries);
  const defiLoading = useAppSelector(selectDefiLoading);
  const defiError = useAppSelector(selectDefiError);
  const defiChainIds = useAppSelector(selectDefiChainIds);

  // Summary data from Redux
  const summaryStats = useAppSelector(selectSummaryStats);
  const summaryLoading = useAppSelector(selectSummaryLoading);
  const summaryError = useAppSelector(selectSummaryError);
  const summaryItems = useAppSelector(selectSummaryItems);

  // Chain selection state for DeFi sections
  const [selectedDefiChainId, setSelectedDefiChainId] = useState<number>(() =>
    defiChainIds.length > 0 ? defiChainIds[0] : 1
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

  // Fetch portfolio, DeFi, and summary data on mount
  // These will use cached data if available (< 5 minutes old)
  useEffect(() => {
    dispatch(fetchPortfolioBalance({address:address!}));
    dispatch(fetchDefiPositions({address:address!}));
    dispatch(fetchPortfolioSummary({address:address!}));
  }, [dispatch,address]);

  // Portfolio stats for PortfolioValueCard
  const portfolioStats = {
    totalValue: totalUsdBalance,
    performanceScore: percentageChange,
    isPerformancePositive: isPositiveChange,
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
          {/* Trading Summary from portfolio/summary API */}
          <StatCard title="Trading Summary">
            <div className="flex items-start justify-between w-full">
              {summaryLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-white/20 border-t-[#2AF598] rounded-full animate-spin"></div>
                  <span className="text-white/60">Loading...</span>
                </div>
              ) : summaryError ? (
                <span className="text-red-400">{summaryError}</span>
              ) : summaryStats.totalTrades > 0 ? (
                <>
                  <div>
                    <p className="text-2xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-white to-white/60 bg-clip-text">
                      {summaryStats.totalTrades}
                    </p>
                    <p className={`text-sm font-medium mt-1 ${
                      summaryStats.totalRealizedProfitUsd >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      P&L: ${summaryStats.totalRealizedProfitUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-xs leading-4 text-right text-white/60">
                    <p>Total Trades</p>
                    <p className="mt-1">
                      {summaryStats.chainCount} chain{summaryStats.chainCount !== 1 ? 's' : ''} active
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center">
                    <span className="text-xl text-white/40">📈</span>
                  </div>
                  <span className="text-sm text-white/40">No trading data</span>
                </div>
              )}
            </div>
          </StatCard>
          <ChainBalanceCard
            chainBalances={chainBalances}
            isLoading={isLoading}
          />
          <PortfolioOverviewCard
            totalBalance={totalUsdBalance}
            percentageChange={percentageChange}
            isPositiveChange={isPositiveChange}
            chainBalances={chainBalances}
            totalChains={chainBalances.length}
          />
        </div>

        {/* Chain Performance Overview */}
        <div className="mb-6">
          <ChainPerformanceCard summaryData={summaryItems} />
        </div>

        {/* Asset Allocation Section (DeFi) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
         
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
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PortfolioPerformanceSection
            summaryData={summaryItems}
            isWalletConnected={chainBalances.length > 0}
          />
          {defiLoading ? (
            <div className="py-8 text-center text-white/60">
              Loading DeFi data...
            </div>
          ) : defiError ? (
            <div className="py-8 text-center text-red-400">{defiError}</div>
          ) : (
            <div className="relative">
              <div className="absolute top-6 right-2">
              {defiChainIds.length > 0 && (
                <ChainDropdown
                chainIds={defiChainIds}
                selectedChainId={selectedDefiChainId}
                onSelect={setSelectedDefiChainId}
                />
              )}
              </div>
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
            </div>
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
