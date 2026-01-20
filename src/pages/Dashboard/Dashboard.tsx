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
  WalletWatcher,
  OrderWatcherCard,
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
  selectSummaryItems,
} from "@/redux/portfolioData";

import ChainDropdown from "./components/ChainDropdown";
import { defiToAssetCategories } from "./utils/defiDashboard.utils";
import { useAccount } from "wagmi";
import TradingSummaryCard from "./components/TradingSummaryCard";
import { getOrders } from "@/redux/orderData/action";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();

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
    if (isConnected) {
      dispatch(fetchPortfolioBalance({ address: address! }));
      dispatch(fetchDefiPositions({ address: address! }));
      dispatch(fetchPortfolioSummary({ address: address! }));
      dispatch(getOrders({ address: address! }));
    }
  }, [dispatch, address]);

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
        
        {/* Background glow*/}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] pointer-events-none" />

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <PortfolioValueCard data={portfolioStats} />
          {/* Trading Summary from portfolio/summary API */}
          <TradingSummaryCard />
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
       

        {/* Wallet Watcher Section */}
        <div className="mb-8">
          <WalletWatcher />
        </div>

        {/* Strategy Orders Section */}
        <div className="mb-8">
          <OrderWatcherCard />
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
