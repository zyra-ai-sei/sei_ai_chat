import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  addTransfer,
  selectTransfers,
  selectSubscribedAddresses,
  selectSubscribing,
} from "@/redux/trackingData/reducer";
import {
  subscribeToAddress,
  unsubscribeFromAddress,
  updateSubscribe,
  fetchTransferHistory,
  TokenTransfer,
  getSubscribedAddresses,
} from "@/redux/trackingData/action";
import { usePrivy } from "@privy-io/react-auth";
import { io } from "socket.io-client";
import {
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Activity,
  Search,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/services/axios";
import AddressSummary from "./AddressSummary";
import { getChainByIdentifier } from "@/config/chains";
import { getTokensByChainId } from "@/constants/token";
import Pagination from "@/components/common/Pagination";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const AVAILABLE_CHAINS = ["base", "arbitrum", "polygon", "ethereum", "sei"];

const WalletWatcher = () => {
  const dispatch = useAppDispatch();
  const { user } = usePrivy();
  const transfers = useAppSelector(selectTransfers);
  const subscribedAddresses = useAppSelector(selectSubscribedAddresses);
  const subscribing = useAppSelector(selectSubscribing);
  const [inputAddress, setInputAddress] = useState("");
  const [selectedChains, setSelectedChains] = useState<string[]>(["sei"]);
  const [activeTab, setActiveTab] = useState<"ALL" | "INCOMING" | "OUTGOING">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedTargetFilter, setSelectedTargetFilter] = useState<
    string | null
  >(null);
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [editingChains, setEditingChains] = useState<string[]>([]);
  const [summaryCache, setSummaryCache] = useState<Map<string, string>>(
    new Map()
  );
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [currentSummary, setCurrentSummary] = useState<string>("");

  // Initialize Socket
  useEffect(() => {
    if (!user?.id) return;

    const newSocket = io(BACKEND_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected to:", BACKEND_URL);
      newSocket.emit("join", { userId: user.id });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    newSocket.on("token-transfer", (transfer: any) => {
      console.log("New Transfer Received:", transfer);
      dispatch(addTransfer(transfer));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, dispatch]);

  // Fetch history on mount
  useEffect(() => {
    dispatch(fetchTransferHistory());
  }, [dispatch]);

  const handleSubscribe = async () => {
    if (!inputAddress || selectedChains.length === 0) return;
    
    if (subscribedAddresses.find((item:any) => item.address === inputAddress)) {
      setInputAddress("");
      setIsAddingTarget(false);
      return;
    }

    await dispatch(subscribeToAddress({ address: inputAddress, chains: selectedChains }));
    setInputAddress("");
    setSelectedChains(["sei"]);
    setIsAddingTarget(false);
  };

  const handleUpdateSubscribe = async (address: string) => {
    if (editingChains.length === 0) return;
    await dispatch(updateSubscribe({ address, chains: editingChains }));
    setEditingTarget(null);
    setEditingChains([]);
  };

  const startEditing = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTarget === item.address) {
      setEditingTarget(null);
      setEditingChains([]);
    } else {
      setEditingTarget(item.address);
      setEditingChains(item.chains || []);
    }
  };

  const toggleEditingChain = (chain: string) => {
    setEditingChains((prev) =>
      prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]
    );
  };

  const handleUnsubscribe = async (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(unsubscribeFromAddress(address));
    if (selectedTargetFilter === address) {
      setSelectedTargetFilter(null);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredTransfers = useMemo(() => {
    const safeTransfers = Array.isArray(transfers) ? transfers : [];
    return safeTransfers.filter((t: TokenTransfer) => {
      const matchesType = activeTab === "ALL" || t.type === activeTab;
      const matchesTarget = selectedTargetFilter
        ? t.trackedAddress.toLowerCase() === selectedTargetFilter.toLowerCase()
        : true;
      return matchesType && matchesTarget;
    });
  }, [transfers, activeTab, selectedTargetFilter]);

  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
  const paginatedTransfers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransfers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransfers, currentPage]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSummaryGeneration = useCallback(
    async (address: string) => {
      // Return cached summary if available
      if (summaryCache.has(address)) {
        return summaryCache.get(address)!;
      }

      setLoadingSummary(address);
      try {
        const response = await axiosInstance.get(
          `/address-activity/summary?address=${address}`
        );
        console.log("api res for summary", response.data.data.summary);
        const summary = response.data.data.summary;

        // Cache the result
        setSummaryCache((prev) => new Map(prev).set(address, summary));

        return summary;
      } finally {
        setLoadingSummary(null);
      }
    },
    [summaryCache]
  );

  const handleAddressClick = async (address: string) => {
    setSelectedTargetFilter(address);
    setCurrentPage(1); // Reset to first page when changing address
    const summary = await handleSummaryGeneration(address);
    setCurrentSummary(summary);
  };

  useEffect(() => {
    dispatch(getSubscribedAddresses());
  }, []);

  useEffect(() => {
    if (subscribedAddresses.length > 0 && !selectedTargetFilter) {
      handleAddressClick(subscribedAddresses[0].address);
    }
  }, [subscribedAddresses, selectedTargetFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <div className="relative w-full border shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] rounded-3xl border-blue-500/20 bg-[#05060E]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 p-6 border-b border-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Activity className="text-blue-400" size={24} />
              <span className="absolute top-0 right-0 flex w-3 h-3 -mt-1 -mr-1">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Live Interceptor
              </h2>
              <p className="text-xs font-medium tracking-wider uppercase text-white/40">
                Real-time Blockchain Surveillance
              </p>
            </div>
          </div>

          {/* Stats / Summary */}
          <div className="flex items-center gap-6 px-6 py-3 border rounded-full bg-white/5 border-white/5">
            <div className="text-center">
              <p className="text-xs text-white/40">Targets</p>
              <p className="text-lg font-bold text-white">
                {subscribedAddresses.length}
              </p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-white/40">Events</p>
              <p className="text-lg font-bold text-white">
                {Array.isArray(transfers) ? transfers.length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left Sidebar: Targets */}
        <div className="relative z-10 flex flex-col p-4 border-r border-white/5 lg:col-span-4 bg-white/[0.02]">
          <div className="flex flex-col gap-3 mb-4">
            <h3 className="text-xs font-bold tracking-wider uppercase text-white/40">
              Active Targets
            </h3>

            <AnimatePresence mode="wait">
              {!isAddingTarget ? (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => setIsAddingTarget(true)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium transition-all border group",
                    "bg-white/5 hover:bg-white/10 text-blue-400 border-blue-500/30 hover:border-blue-500/50"
                  )}
                >
                  <Plus
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span>Add New Target</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 p-3 border rounded-xl bg-black/40 border-blue-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-400">
                        Track Address
                      </span>
                      <button
                        onClick={() => setIsAddingTarget(false)}
                        className="text-white/40 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={inputAddress}
                      onChange={(e) => setInputAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 text-xs text-white border rounded-lg bg-white/5 border-white/10 focus:border-blue-500/50 focus:outline-none"
                    />

                    <div className="flex flex-wrap gap-1.5 py-1">
                      {AVAILABLE_CHAINS.map((chain) => (
                        <button
                          key={chain}
                          type="button"
                          onClick={() => {
                            setSelectedChains((prev) =>
                              prev.includes(chain)
                                ? prev.filter((c) => c !== chain)
                                : [...prev, chain]
                            );
                          }}
                          className={cn(
                            "px-2 py-1 text-[9px] rounded-md border transition-all uppercase font-bold tracking-tighter",
                            selectedChains.includes(chain)
                              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                              : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
                          )}
                        >
                          {chain}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleSubscribe}
                      disabled={subscribing || !inputAddress || selectedChains.length === 0}
                      className="w-full py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50"
                    >
                      {subscribing ? (
                        <Loader2 size={14} className="mx-auto animate-spin" />
                      ) : (
                        "Start Watching"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-[400px] lg:max-h-none">
            {subscribedAddresses.length > 0 &&
              subscribedAddresses?.map((item: any) => (
                <motion.div
                  key={item.address}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={() => handleAddressClick(item.address)}
                    className={cn(
                      "group relative w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      selectedTargetFilter === item.address
                        ? "bg-blue-500/10 border-blue-500/50"
                        : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 font-mono text-[10px]">
                      {item.address?.slice(2, 4)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-medium text-white truncate">
                        {item.address}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.chains?.map((chain: string) => (
                          <span
                            key={chain}
                            className="text-[8px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-bold"
                          >
                            {chain}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Edit Button */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(item, e);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-500/20 hover:text-blue-400 rounded-md transition-all"
                      >
                        <Edit3 size={12} />
                      </div>
                      {/* Delete Button */}
                      <div
                        onClick={(e) => handleUnsubscribe(item.address, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all"
                      >
                        <Trash2 size={12} />
                      </div>
                    </div>
                  </button>

                  {/* Edit Chains Menu */}
                  {editingTarget === item.address && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-black/40 border-blue-500/30">
                        {AVAILABLE_CHAINS.map((chain) => (
                          <button
                            key={chain}
                            type="button"
                            onClick={() => toggleEditingChain(chain)}
                            className={cn(
                              "px-3 py-1 text-[10px] rounded-md border transition-all uppercase font-bold",
                              editingChains.includes(chain)
                                ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
                            )}
                          >
                            {chain}
                          </button>
                        ))}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateSubscribe(item.address);
                          }}
                          className="px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            {subscribedAddresses.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs text-white/30">No targets active</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content: Intelligence / Feed */}
        <div className="relative z-10 flex flex-col lg:col-span-8 bg-[#05060E]/50 overflow-y-auto custom-scrollbar">
          {selectedTargetFilter ? (
            <div className="flex flex-col gap-6 p-6">
              {/* Transaction Activity Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-white/40" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Recent Activity Feed
                    </h3>
                  </div>

                  <div className="flex p-1 space-x-1 rounded-lg bg-white/5">
                    {(["ALL", "INCOMING", "OUTGOING"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider",
                          activeTab === tab
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "text-white/40 hover:text-white"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {paginatedTransfers.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]"
                      >
                        <Search size={20} className="mb-2 text-white/10" />
                        <p className="text-xs text-white/20">
                          No intercepted transfers for this target
                        </p>
                      </motion.div>
                    ) : (
                      paginatedTransfers.map((transfer: TokenTransfer) => (
                        <motion.div
                          key={transfer._id || transfer.hash}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative flex items-center gap-4 p-4 border rounded-xl border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                        >
                          <div
                            className={cn(
                              "absolute left-0 top-0 bottom-0 w-1 rounded-l-full",
                              transfer.type === "INCOMING"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            )}
                          />

                          <div
                            className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-full shrink-0 shadow-inner",
                              transfer.type === "INCOMING"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-rose-500/10 text-rose-400"
                            )}
                          >
                            {transfer.type === "INCOMING" ? (
                              <ArrowDownLeft size={18} />
                            ) : (
                              <ArrowUpRight size={18} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <img
                                src={
                                  getTokensByChainId(
                                    getChainByIdentifier(transfer.chain)
                                      ?.chainId as number
                                  ).find(
                                    (t) =>
                                      t.address.toLowerCase() ===
                                      transfer.tokenAddress.toLowerCase()
                                  )?.imageUrl || "/assets/tokens/eth.svg"
                                }
                                className="w-4 h-4 rounded-full"
                              />
                              <span className="text-sm font-bold text-white">
                                {transfer.symbol}
                              </span>
                              <span className="text-[10px] text-white/30 font-mono tracking-tighter">
                                {formatTime(transfer.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                              <span className="truncate max-w-[150px]">
                                {transfer.type === "INCOMING"
                                  ? `From: ${transfer.from}`
                                  : `To: ${transfer.to}`}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    transfer.type === "INCOMING"
                                      ? transfer.from
                                      : transfer.to
                                  )
                                }
                                className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                              >
                                <Copy size={10} />
                              </button>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p
                              className={cn(
                                "text-sm font-bold font-mono",
                                transfer.type === "INCOMING"
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              )}
                            >
                              {transfer.type === "INCOMING" ? "+" : "-"}
                              {transfer.value}
                            </p>
                            <a
                              href={`https://seitrace.com/tx/${transfer.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-end gap-1 text-[10px] text-white/20 hover:text-blue-400 transition-colors"
                            >
                              TX <ExternalLink size={8} />
                            </a>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
                {totalPages > 1 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
              {/* Intelligence Summary Section */}
              <AddressSummary
                address={selectedTargetFilter}
                summary={currentSummary}
                isLoading={loadingSummary === selectedTargetFilter}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
              <div className="p-4 rounded-full bg-white/5 shadow-2xl ring-1 ring-white/10">
                <Search size={32} className="text-white/20" />
              </div>
              <p className="text-sm font-bold text-white/30 uppercase tracking-widest">
                Awaiting Target Selection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletWatcher;
