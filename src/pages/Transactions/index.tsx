import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getTransactions } from "@/redux/transactionData/action";
import { ArrowDownToLine, ArrowUpRight, Filter, Search } from "lucide-react";

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
  const { transactions, loading } = useAppSelector(
    (state) => state.transactionData || { transactions: [], loading: false }
  );

  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"recent" | "value">("recent");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, query, sortKey, pageSize, transactions.length]);

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    if (activeFilter !== "all") {
      list = list.filter((txn) => {
        const normalized = normalizeStatus(txn.status);
        if (activeFilter === "failed") {
          return normalized === "failed" || normalized === "error";
        }
        return normalized === activeFilter;
      });
    }

    if (query.trim()) {
      const lower = query.trim().toLowerCase();
      list = list.filter(
        (txn) =>
          txn.hash?.toLowerCase().includes(lower) ||
          txn.to?.toLowerCase().includes(lower) ||
          txn.from?.toLowerCase().includes(lower) ||
          txn.token?.toLowerCase().includes(lower)
      );
    }

    if (sortKey === "recent") {
      list.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } else {
      list.sort((a, b) => toSeiValue(b.value) - toSeiValue(a.value));
    }

    return list;
  }, [transactions, activeFilter, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(
    pageStart,
    pageStart + pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const totalValue = transactions.reduce(
      (acc, txn) => acc + Number(txn.value || 0),
      0
    );
    const successCount = transactions.filter(
      (txn) => normalizeStatus(txn.status) === "success"
    ).length;
    const failedCount = transactions.filter((txn) =>
      ["failed", "error"].includes(normalizeStatus(txn.status))
    ).length;

    return {
      total: transactions.length,
      success: successCount,
      failed: failedCount,
      totalValue,
    };
  }, [transactions]);

  return (
    <div className="min-h-screen w-full bg-[#05060E] text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 lg:px-0">
        <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(124,171,249,0.2),_transparent_60%),_linear-gradient(135deg,_rgba(124,171,249,0.15),_rgba(179,122,232,0.15))] p-8 shadow-[0_20px_80px_rgba(10,10,12,0.6)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                Transaction hub
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                On-chain history, curated for you
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/70">
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
                  txns tracked
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
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Total volume</span>
                <span className="font-semibold text-white">
                  {formatTokenValue(stats.totalValue)} {transactions[0]?.token || "SEI"}
                </span>
              </div>
              <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                <ArrowDownToLine size={16} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-black/40 p-6 shadow-[0_12px_60px_rgba(3,3,5,0.45)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold">History</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={16}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by address or hash"
                  className="h-10 w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-white/60">
                <button
                  onClick={() => setSortKey("recent")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-1.5 text-sm leading-none whitespace-nowrap",
                    sortKey === "recent" && "bg-white text-black"
                  )}
                >
                  Recent
                </button>
                <button
                  onClick={() => setSortKey("value")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-1.5 text-sm leading-none whitespace-nowrap",
                    sortKey === "value" && "bg-white text-black"
                  )}
                >
                  Highest value
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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
                {f.id === "all" ? <Filter size={16} /> : <span className="h-2 w-2 rounded-full bg-white/50" />}
                {f.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/30">
            <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-6 py-4 text-xs uppercase tracking-[0.2em] text-white/50">
              <span className="col-span-4">Hash</span>
              <span className="col-span-3">Type</span>
              <span className="col-span-2">Value</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-1 text-right">Time</span>
            </div>
            <div className="divide-y divide-white/5">
              {loading && (
                <LoadingState />
              )}
              {!loading && filteredTransactions.length === 0 && (
                <EmptyState />
              )}
              {!loading &&
                paginatedTransactions.map((txn, idx) => (
                  <Row key={txn.hash || `${idx}-${txn.timestamp}`} txn={txn} />
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/5 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white focus:border-white/40 focus:outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size} className="bg-[#05060E] text-white">
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
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

const Row = ({ txn }: { txn: any }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm">
      <div className="col-span-4">
        <p className="font-mono text-white">
          {formatHash(txn.hash)}
        </p>
        <p className="text-xs text-white/50">
          {formatAddress(txn.from)} → {formatAddress(txn.to)}
        </p>
      </div>
      <div className="col-span-3 text-white/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <ArrowUpRight size={16} />
          </span>
          <div>
            <p className="font-medium capitalize">{txn.type || "Contract"}</p>
            <p className="text-xs text-white/50">{txn.blockNumber ? `Block #${txn.blockNumber}` : ""}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 font-semibold">
        {formatTokenValue(txn.value)} {txn.token || "SEI"}
      </div>
      <div className="col-span-2">
        <StatusBadge status={txn.status} />
      </div>
      <div className="col-span-1 text-right text-xs text-white/50">
        {formatTime(txn.timestamp)}
      </div>
    </div>
  );
};

const StatusBadge = ({ status = "pending" }: { status?: string | null }) => {
  const normalized = normalizeStatus(status);
  const lookup: Record<string, { label: string; className: string }> = {
    success: {
      label: "Success",
      className:
        "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    },
    failed: {
      label: "Failed",
      className: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
    },
  };

  const config = lookup[normalized] || lookup.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs",
        config.className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};

const LoadingState = () => (
  <div className="flex flex-col gap-2 px-6 py-10 text-center text-white/50">
    <p>Fetching your on-chain history…</p>
    <span className="mx-auto h-1 w-32 animate-pulse rounded-full bg-white/20" />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col gap-3 px-6 py-12 text-center text-white/50">
    <p>No transactions found for the selected filters.</p>
    <p className="text-sm">Try syncing your wallet or adjusting the filters.</p>
  </div>
);

const normalizeStatus = (status?: string | null) =>
  (status?.toLowerCase().replace("status_", "") || "pending") as
    | "pending"
    | "success"
    | "failed"
    | "error";

const formatHash = (hash?: string) =>
  hash ? `${hash.slice(0, 10)}…${hash.slice(-6)}` : "—";

const formatAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—";

const formatTokenValue = (value?: number | string | null) => {
  const numeric = toSeiValue(value);
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: numeric < 1 ? 4 : 2,
  }).format(numeric);
};

const formatTime = (timestamp?: string) =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

const toSeiValue = (value?: number | string | null) =>
  Number(value || 0) / 10 ** 18;

export default Transactions;
