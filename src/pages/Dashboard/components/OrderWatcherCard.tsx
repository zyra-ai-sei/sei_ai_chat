import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  Loader2,
  TrendingUp,
  XCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { getOrders } from "@/redux/orderData/action";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";

const OrderWatcherCard = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"active" | "history" | "failed">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { orders, loading } = useAppSelector(
    (state) => state.orderData || { orders: [], loading: false }
  );

  const filteredOrders = orders.filter(o => {
    const status = o.status
    if (activeTab === "active") return status === "OPEN";
    if (activeTab === "history") return status === "COMPLETED";
    if (activeTab === "failed") return status === "CANCELED" ;
    return false;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const TabButton = ({ id, label, count, icon: Icon }: any) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setCurrentPage(1);
      }}
      className={cn(
        "relative flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold transition-all rounded-md",
        activeTab === id 
          ? "text-blue-400 bg-white/[0.04]" 
          : "text-white/30 hover:text-white/50"
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      {label}
      {count > 0 && (
        <span className={cn(
          "ml-0.5 text-[10px] opacity-40",
          activeTab === id && "opacity-100"
        )}>
          ({count})
        </span>
      )}
      {activeTab === id && (
        <motion.div 
          layoutId="activeTabUnderline"
          className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-blue-500 rounded-full" 
        />
      )}
    </button>
  );

const OrderItem = ({ order, index }: { order: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.04, ease: "easeOut" }}
      className="group relative flex items-center gap-4 p-3 mb-2 transition-all border rounded-xl bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-blue-500/20"
    >
      {/* Indicator Line */}
      <div className={cn(
        "absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full transition-all duration-500",
        activeTab === "active" ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" :
        activeTab === "history" ? "bg-emerald-500" : "bg-rose-500"
      )} />

      <div className="flex-1 min-w-0 px-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              {order.srcToken} 
              <ArrowRight size={10} className="text-white/20" />
              {order.dstToken}
            </span>
            <div className={cn(
              "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border",
              activeTab === "active" ? "bg-blue-500/5 text-blue-400/80 border-blue-500/10" :
              activeTab === "history" ? "bg-emerald-500/5 text-emerald-400/80 border-emerald-500/10" :
              "bg-rose-500/5 text-rose-400/80 border-rose-500/10"
            )}>
              {order.status}
            </div>
          </div>
          <span className="text-[10px] tabular-nums text-white/20">
             #{order.orderId}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-medium">Selling</span>
              <span className="text-xs font-medium text-white/70">{order.srcAmount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-medium">Targeting</span>
              <span className="text-xs font-medium text-white/70">~{order.dstMinAmount}</span>
            </div>
            {order.fillDelay > 0 && (
              <div className="hidden sm:flex flex-col">
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-medium">Frequency</span>
                <span className="text-xs font-medium text-white/70">{order.fillDelay}s</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
             {order.txHash && (
              <a 
                href={`https://seitrace.com/tx/${order.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-all"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {activeTab === "active" && order.percentFilled !== undefined && (
          <div className="mt-2.5 relative w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${order.percentFilled}%` }}
              className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-400"
            />
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="relative w-full overflow-hidden border shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] rounded-3xl border-white/10 bg-[#05060E]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 px-6 py-5 border-b border-white/5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <ClipboardList className="text-blue-400" size={16} />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-white uppercase opacity-80">Strategy Engine</h2>
          </div>

          <div className="flex items-center gap-1">
            <TabButton 
              id="active" 
              label="Active" 
              icon={Clock}
              count={orders.filter(o => o.status?.toLowerCase() === "open" || o.status?.toLowerCase() === "partially_filled").length} 
            />
            <TabButton 
              id="history" 
              label="Completed" 
              icon={CheckCircle2}
              count={orders.filter(o => o.status?.toLowerCase() === "fulfilled").length} 
            />
            <TabButton 
              id="failed" 
              label="Failed" 
              icon={XCircle}
              count={orders.filter(o => ["cancelled", "failed", "expired"].includes(o.status?.toLowerCase())).length} 
            />
          </div>
        </div>
      </div>

      {/* List Body */}
      <div className="relative z-10 p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-blue-500/40 animate-spin" />
              <RefreshCw className="absolute inset-0 m-auto w-4 h-4 text-blue-400 animate-spin-slow" />
            </div>
            <p className="text-sm font-medium text-white/40">Synchronizing with Zyra Engine...</p>
          </div>
        ) : (
          <div className="min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {paginatedOrders.length > 0 ? (
                <motion.div
                  key={activeTab + currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {paginatedOrders.map((order, idx) => (
                    <OrderItem key={order._id || idx} order={order} index={idx} />
                  ))}
                  
                  {totalPages > 1 && (
                    <div className="mt-8 pt-6 border-t border-white/5">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed rounded-3xl border-white/5 bg-white/[0.01]"
                >
                  <div className="p-4 rounded-full bg-white/[0.02]">
                    <TrendingUp className="w-10 h-10 text-white/10" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white/40">No {activeTab} orders found</p>
                    <p className="text-xs text-white/20 mt-1">Strategies and AI trades will appear here</p>
                  </div>
                  <button 
                    onClick={() => dispatch(getOrders({ address: address! }))}
                    className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/5 hover:bg-blue-500/10 rounded-lg"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-20 px-6 py-3 bg-blue-500/5 backdrop-blur-md flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Engine Healthy</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Search size={10} className="text-white/20" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Tracking Live Events</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-white/20 font-mono italic">ID: ZYRA-SURV-[DCA/LIMIT]</span>
        </div>
      </div>
    </div>
  );
};

export default OrderWatcherCard;

