import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getTransactions } from "@/redux/transactionData/action";
import { getOrders } from "@/redux/orderData/action";
import {
  ArrowDownToLine,
  ArrowUpDown,
  ArrowUpRight,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  formatAddress,
  formatHash,
  formatTime,
  formatTokenValue,
  normalizeStatus,
  toSeiValue,
} from "@/utility/transactionHistory";
import { StatusBadge } from "./components/StatusBadge";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { useAccount } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import Dropdown from "@/components/common/dropdown/Dropdown";

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const FILTERS = [
  { id: "all", label: "All" },
  { id: "success", label: "Success" },
  { id: "failed", label: "Failed" },
  { id: "pending", label: "Pending" },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const Transactions = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightHash = searchParams.get("highlight");
  const { transactions, loading: transactionsLoading } = useAppSelector(
    (state) => state.transactionData || { transactions: [], loading: false }
  );
  const { orders, loading: ordersLoading } = useAppSelector(
    (state) => state.orderData || { orders: [], loading: false }
  );
  const { address } = useAccount();
  const { wallets } = useWallets();

  const [viewMode, setViewMode] = useState<"transactions" | "orders">(
    "transactions"
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeChainFilter, setActiveChainFilter] = useState("All Chains");
  const [activeAccountFilter, setActiveAccountFilter] =
    useState("All Accounts");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"recent" | "value">("recent");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const loading =
    viewMode === "transactions" ? transactionsLoading : ordersLoading;

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      return;
    }

    const headers = Object.keys(transactions[0]);

    const csvRows: string[] = [];

    csvRows.push(headers.join(","));

    for (const row of transactions) {
      const values = headers.map((header) => {
        const val = (row as any)[header]; // cast to any to allow dynamic indexing
        // Escape quotes within the string and wrap in quotes to handle commas within data
        const escaped = ("" + val).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!address) return;
    if (!transactions || transactions.length === 0) {
      dispatch(getTransactions({ address: address as string }));
    }
    if (!orders || orders.length === 0) {
      dispatch(getOrders({ address: address! }));
    }
  }, [dispatch, address]);

  // Poll orders API every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getOrders({ address: address! }));
    }, 30000); // 30 seconds

    // Cleanup function to clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  // Clear highlight after 3 seconds
  useEffect(() => {
    if (highlightHash) {
      const timer = setTimeout(() => {
        setSearchParams({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightHash, setSearchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeFilter,
    activeChainFilter,
    activeAccountFilter,
    query,
    sortKey,
    pageSize,
    transactions.length,
  ]);

  const filteredData = useMemo(() => {
    let list: any[] =
      viewMode === "transactions" ? [...transactions] : [...orders];

    // Chain Filter
    if (activeChainFilter !== "All Chains") {
      list = list.filter((item: any) => item.network === activeChainFilter);
    }

    // Account Filter
    if (activeAccountFilter !== "All Accounts") {
      const embeddedWallet = wallets.find(
        (w) => w.connectorType === "embedded"
      );
      const injectedWallets = wallets.filter(
        (w) => w.connectorType === "injected"
      );

      if (viewMode === "transactions") {
        if (activeAccountFilter === "embedded") {
          list = list.filter(
            (item: any) =>
              item.from?.toLowerCase() === embeddedWallet?.address.toLowerCase()
          );
        } else if (activeAccountFilter === "injected") {
          list = list.filter((item: any) =>
            injectedWallets.some(
              (w) => w.address.toLowerCase() === item.from?.toLowerCase()
            )
          );
        }
      } else {
        // Orders
        if (activeAccountFilter === "embedded") {
          list = list.filter(
            (item: any) =>
              item.maker?.toLowerCase() ===
              embeddedWallet?.address.toLowerCase()
          );
        } else if (activeAccountFilter === "injected") {
          list = list.filter((item: any) =>
            injectedWallets.some(
              (w) => w.address.toLowerCase() === item.maker?.toLowerCase()
            )
          );
        }
      }
    }

    if (activeFilter !== "all") {
      list = list.filter((item: any) => {
        if (viewMode === "transactions") {
          const normalized = normalizeStatus(item.status);
          if (activeFilter === "failed") {
            return normalized === "failed" || normalized === "error";
          }
          return normalized === activeFilter;
        } else {
          // Handle orders
          if (activeFilter === "success") {
            return item.status === "COMPLETED";
          } else if (activeFilter === "failed") {
            return item.status === "FAILED";
          } else if (activeFilter === "pending") {
            return item.status === "OPEN";
          }
          return false;
        }
      });
    }

    if (query.trim()) {
      const lower = query.trim().toLowerCase();
      if (viewMode === "transactions") {
        list = list.filter(
          (txn: any) =>
            txn.hash?.toLowerCase().includes(lower) ||
            txn.to?.toLowerCase().includes(lower) ||
            txn.from?.toLowerCase().includes(lower) ||
            txn.token?.toLowerCase().includes(lower)
        );
      } else {
        list = list.filter(
          (order: any) =>
            order.orderId?.toString().includes(lower) ||
            order.maker?.toLowerCase().includes(lower) ||
            order.txHash?.toLowerCase().includes(lower) ||
            order.txHashCreated?.toLowerCase().includes(lower)
        );
      }
    }

    if (sortKey === "recent") {
      list.sort((a: any, b: any) => {
        const aTime =
          viewMode === "transactions"
            ? a.timestamp
            : a.lastUpdated || a.createdAt;
        const bTime =
          viewMode === "transactions"
            ? b.timestamp
            : b.lastUpdated || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
    } else {
      if (viewMode === "transactions") {
        list.sort(
          (a: any, b: any) => toSeiValue(b.value) - toSeiValue(a.value)
        );
      } else {
        list.sort(
          (a: any, b: any) =>
            Number(b.srcAmount || 0) - Number(a.srcAmount || 0)
        );
      }
    }

    return list;
  }, [
    viewMode,
    transactions,
    orders,
    activeFilter,
    activeChainFilter,
    activeAccountFilter,
    query,
    sortKey,
    wallets,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedData = filteredData.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const data = viewMode === "transactions" ? transactions : orders;

    let successCount = 0;
    let failedCount = 0;

    if (viewMode === "transactions") {
      successCount = data.filter(
        (item: any) => normalizeStatus(item.status) === "success"
      ).length;
      failedCount = data.filter((item: any) =>
        ["failed", "error"].includes(normalizeStatus(item.status))
      ).length;
    } else {
      successCount = data.filter(
        (item: any) => item.status === "COMPLETED"
      ).length;
      failedCount = data.filter((item: any) => item.status === "FAILED").length;
    }

    let totalValue = 0;
    if (viewMode === "transactions") {
      totalValue = transactions.reduce(
        (acc: any, txn: any) => acc + Number(txn.value || 0),
        0
      );
    }

    return {
      total: data.length,
      success: successCount,
      failed: failedCount,
      totalValue,
    };
  }, [viewMode, transactions, orders]);

  return (
    <div className="min-h-screen w-full bg-[#05060E] text-white">
      <section className="flex flex-col w-full max-w-6xl gap-6 px-4 py-12 mx-auto lg:px-0">
        <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(124,171,249,0.2),_transparent_60%),_linear-gradient(135deg,_rgba(124,171,249,0.15),_rgba(179,122,232,0.15))] p-8 shadow-[0_20px_80px_rgba(10,10,12,0.6)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                Transaction hub
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                On-chain history, curated for you
              </h1>
              <p className="max-w-2xl mt-4 text-base text-white/70">
                Review every contract interaction, monitor token transfers, and
                download detailed receipts without leaving Zyra.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 md:w-[340px]">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Snapshot
              </p>
              <div className="flex items-center gap-3 text-4xl font-semibold text-white">
                {stats.total}
                <span className="text-base font-medium text-white/60">
                  {viewMode === "transactions"
                    ? "txns tracked"
                    : "orders tracked"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Success</span>
                <span className="text-emerald-400">{stats.success}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Failed</span>
                <span className="text-rose-400">{stats.failed}</span>
              </div>
              {viewMode === "transactions" && (
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Total volume</span>
                  <span className="font-semibold text-white">
                    {formatTokenValue(stats.totalValue)}{" "}
                    {transactions[0]?.token || "SEI"}
                  </span>
                </div>
              )}
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white transition rounded-full bg-white/10 hover:bg-white/20"
              >
                <ArrowDownToLine size={16} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-black/40 p-6 shadow-[0_12px_60px_rgba(3,3,5,0.45)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">History</h2>
              <div className="flex items-center gap-1 p-1 text-sm border rounded-full border-white/10 bg-white/5 text-white/60">
                <button
                  onClick={() => setViewMode("transactions")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-1.5 text-sm leading-none whitespace-nowrap",
                    viewMode === "transactions" && "bg-white text-black"
                  )}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setViewMode("orders")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-1.5 text-sm leading-none whitespace-nowrap",
                    viewMode === "orders" && "bg-white text-black"
                  )}
                >
                  Orders
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-72">
                <Search
                  className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-white/40"
                  size={16}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    viewMode === "transactions"
                      ? "Search by address or hash"
                      : "Search by order ID or maker address"
                  }
                  className="w-full py-2 pl-10 pr-4 text-sm text-white border rounded-full border-white/10 bg-white/5 placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setSortKey(sortKey === "recent" ? "value" : "recent")
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm transition border rounded-full border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <ArrowUpDown size={16} />
                  {sortKey === "recent" ? "Most recent" : "Highest value"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm",
                  activeFilter === f.id
                    ? "bg-white text-black"
                    : "text-white/70 hover:border-white/30"
                )}
              >
                {f.id === "all" ? (
                  <Filter size={16} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/50" />
                )}
                {f.label}
              </button>
            ))}

            <div className="w-px h-6 mx-2 bg-white/10" />

            {/* Chain Filter */}

            <Dropdown
              onChange={(e: any) => setActiveChainFilter(e)}
              list={["All Chains"].concat(
                Array.from(
                  new Set(
                    [...transactions, ...orders]
                      .map((t: any) => t.network)
                      .filter(Boolean)
                  )
                )
              )}
            />
            
            {/* Account Filter */}
            <Dropdown
              onChange={(e: any) => setActiveAccountFilter(e)}
              list={["All Accounts", "embedded", "injected"]}
            />
          </div>

          <div className="w-full border rounded-2xl border-white/5 bg-black/30">
            {viewMode === "transactions" ? (
              <>
                <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-6 py-4 text-xs uppercase tracking-[0.2em] text-white/50">
                  <span className="col-span-4">Hash</span>
                  <span className="col-span-3">Type</span>
                  <span className="col-span-2">Value</span>
                  <span className="col-span-2">Status</span>
                  <span className="col-span-1 text-right">Time</span>
                </div>
                <div className="w-full divide-y divide-white/5">
                  {loading && <LoadingState />}
                  {!loading && filteredData.length === 0 && <EmptyState />}
                  {!loading &&
                    paginatedData.map((txn: any, idx) => (
                      <TransactionRow
                        key={txn.hash || `${idx}-${txn.timestamp}`}
                        txn={txn}
                        isHighlighted={txn.hash === highlightHash}
                      />
                    ))}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-6 py-4 text-xs uppercase tracking-[0.2em] text-white/50">
                  <span className="col-span-2">Order ID</span>
                  <span className="col-span-4">Maker</span>
                  <span className="col-span-2">Amount</span>
                  <span className="col-span-2">Status</span>
                  <span className="col-span-2 text-right">Last Updated</span>
                </div>
                <div className="w-full divide-y divide-white/5">
                  {loading && <LoadingState />}
                  {!loading && filteredData.length === 0 && <EmptyState />}
                  {!loading &&
                    paginatedData.map((order: any, idx) => (
                      <OrderRow
                        key={order._id || `${idx}-${order.orderId}`}
                        order={order}
                      />
                    ))}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-white/5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
                className="px-3 py-1 text-sm text-white border rounded-full border-white/15 bg-white/5 focus:border-white/40 focus:outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option
                    key={size}
                    value={size}
                    className="bg-[#05060E] text-white"
                  >
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
                className="px-3 py-1 text-sm border rounded-full border-white/10 text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <div className="flex items-center gap-1 text-sm text-white/70">
                <span>
                  Page {safePage} of {totalPages}
                </span>
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safePage === totalPages}
                className="px-3 py-1 text-sm border rounded-full border-white/10 text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const TransactionRow = ({
  txn,
  isHighlighted,
}: {
  txn: any;
  isHighlighted?: boolean;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  return (
    <div className="grid items-center w-full ">
      <div
        ref={rowRef}
        className={cn(
          "grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm transition-all duration-500",
          isHighlighted && "bg-[#7cabf9]/20 ring-1 ring-[#7cabf9]/50 rounded-lg"
        )}
      >
        <div className="col-span-4">
          <div className="flex items-center gap-2">
            <p className="font-mono text-white">{formatHash(txn.hash)}</p>
            {txn.hash && (
              <a
                href={`https://seitrace.com/tx/${txn.hash}`}
                target="_blank"
                rel="noreferrer"
                className="text-white/40 hover:text-[#7cabf9] transition-colors"
                title="View on Seitrace"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          <p className="text-xs text-white/50">
            {formatAddress(txn.from)} → {formatAddress(txn.to)}
          </p>
        </div>
        <div className="col-span-3 text-white/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
              <ArrowUpRight size={16} />
            </span>
            <div>
              <p className="font-medium capitalize">
                {txn.functionName || "Unknown"}
              </p>
              <p className="text-xs text-white/50">
                {txn.network && (
                  <span className="uppercase">{txn.network} • </span>
                )}
                {txn.blockNumber ? `Block #${txn.blockNumber}` : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2 font-semibold">
          {formatTokenValue(txn.value)} {txn.token || "SEI"}
        </div>
        <div className="col-span-2">
          <StatusBadge status={txn.status} />
        </div>
        <div className="col-span-1 text-xs text-right text-white/50">
          {formatTime(txn.timestamp)}
        </div>
      </div>
    </div>
  );
};

const OrderRow = ({ order }: { order: any }) => {
  const formatAmount = (amount: string) => {
    if (!amount) return "0";
    const num = Number(amount) / 1e18;
    return num.toFixed(6);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-400";
      case "OPEN":
        return "text-blue-400";
      case "FAILED":
        return "text-rose-400";
      default:
        return "text-white/70";
    }
  };

  return (
    <div className="grid items-center w-full">
      <div className="grid items-center grid-cols-12 gap-4 px-6 py-5 text-sm">
        <div className="col-span-2">
          <p className="font-mono text-white">#{order.orderId}</p>
        </div>
        <div className="col-span-4">
          <div className="flex items-center gap-2">
            <p className="font-mono text-white">{formatAddress(order.maker)}</p>
            {order.txHashCreated && (
              <a
                href={`https://seitrace.com/tx/${order.txHashCreated}`}
                target="_blank"
                rel="noreferrer"
                className="text-white/40 hover:text-[#7cabf9] transition-colors"
                title="View on Seitrace"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          {order.fills && order.fills.length > 0 && (
            <p className="text-xs text-white/50">
              {order.fills.length} fill{order.fills.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="col-span-2 text-white/80">
          {order.srcAmount ? (
            <div>
              <p className="font-semibold">{formatAmount(order.srcAmount)}</p>
              <p className="text-xs text-white/50">
                {order.percentFilled ? `${order.percentFilled}% filled` : ""}
              </p>
            </div>
          ) : (
            <p className="font-semibold">
              {order.filledAmount ? formatAmount(order.filledAmount) : "—"}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <span
            className={cn(
              "font-semibold capitalize",
              getStatusColor(order.status)
            )}
          >
            {order.status}
          </span>
        </div>
        <div className="col-span-2 text-xs text-right text-white/50">
          {formatTime(order.lastUpdated || order.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
