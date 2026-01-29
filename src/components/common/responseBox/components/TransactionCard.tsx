import React, { useState, useEffect, useCallback } from "react";
import { ToolOutput, updateTransactionStatus } from "@/redux/chatData/reducer";
import { StatusEnum } from "@/enum/status.enum";
import {
  ChevronDown,
  Play,
  Zap,
  ExternalLink,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Clock,
  Timer,
  RefreshCw,
} from "lucide-react";
import TransactionForm from "./TransactionForm";
import { useTransactionNavigation } from "@/contexts/TransactionNavigationContext";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { getChainByIdentifier } from "@/config/chains";
import { getOrderById, DelegatedOrder } from "@/services/delegatedTransactionApi";
import { useAppDispatch } from "@/hooks/useRedux";

interface TransactionCardProps {
  txn: ToolOutput;
  index: number;
  chatIndex: number;
  isExpanded: boolean;
  isCurrentlyExecuting: boolean;
  isCurrentlySimulating: boolean;
  onToggleExpanded: () => void;
  onExecuteTransaction: () => void;
  onSimulateTransaction: () => void;
}

const StatusBadge = ({
  status,
  isScheduledOrder,
  orderStatus
}: {
  status: StatusEnum | undefined;
  isScheduledOrder?: boolean;
  orderStatus?: DelegatedOrder['status'];
}) => {
  // For scheduled orders, show more specific statuses
  if (isScheduledOrder && orderStatus) {
    if (orderStatus === 'executed') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(16,185,129,0.3)]">
          <CheckCircle2 size={10} className="text-emerald-400" />
          <span>Executed</span>
        </div>
      );
    }
    if (orderStatus === 'executing') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium animate-pulse">
          <RefreshCw size={10} className="animate-spin" />
          <span>Executing...</span>
        </div>
      );
    }
    if (orderStatus === 'authorized') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">
          <Timer size={10} />
          <span>Scheduled</span>
        </div>
      );
    }
    if (orderStatus === 'failed') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(239,68,68,0.3)]">
          <XCircle size={10} />
          <span>Failed</span>
        </div>
      );
    }
    if (orderStatus === 'cancelled') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-medium">
          <XCircle size={10} />
          <span>Cancelled</span>
        </div>
      );
    }
    if (orderStatus === 'expired') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-medium">
          <Clock size={10} />
          <span>Expired</span>
        </div>
      );
    }
  }

  // For scheduled orders that were just scheduled (SUCCESS status but has orderId)
  if (isScheduledOrder && status === StatusEnum.SUCCESS) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">
        <Timer size={10} />
        <span>Scheduled</span>
      </div>
    );
  }

  if (status === StatusEnum.SUCCESS) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(16,185,129,0.3)]">
        <CheckCircle2 size={10} className="text-emerald-400" />
        <span>Completed</span>
      </div>
    );
  }
  if (status === StatusEnum.ERROR || status === StatusEnum.SIMULATION_FAILED) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(239,68,68,0.3)]">
        <XCircle size={10} />
        <span>{status === StatusEnum.SIMULATION_FAILED ? "Sim Failed" : "Failed"}</span>
      </div>
    );
  }
  if (status === StatusEnum.SIMULATION_SUCCESS) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(16,185,129,0.3)]">
        <CheckCircle2 size={10} className="text-emerald-400" />
        <span>Sim Passed</span>
      </div>
    );
  }
  if (status === StatusEnum.PENDING || status === StatusEnum.SIMULATING) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium animate-pulse">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
        <span>{status === StatusEnum.SIMULATING ? "Simulating..." : "Executing..."}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-medium">
      <div className="w-2 h-2 rounded-full bg-slate-500" />
      <span>Pending</span>
    </div>
  );
};

const ActionButton = ({ onClick, variant = "primary", children, icon: Icon, className = "", disabled = false }: any) => {
  const variants: any = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_12px_-3px_rgba(124,58,237,0.4)] border border-violet-500/50",
    amber: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-[0_0_12px_-3px_rgba(251,191,36,0.4)] border border-amber-500/50",
    secondary: "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50 hover:border-slate-600",
    ghost: "bg-transparent hover:bg-slate-800/30 text-slate-400 hover:text-slate-200",
    disabled: "bg-slate-800/30 text-slate-500 border border-slate-700/30 cursor-not-allowed",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-medium transition-all duration-300 active:scale-95 ${disabled ? variants.disabled : variants[variant]} ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </button>
  );
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  txn,
  index,
  chatIndex,
  isExpanded,
  isCurrentlyExecuting,
  isCurrentlySimulating,
  onToggleExpanded,
  onExecuteTransaction,
  onSimulateTransaction,
}) => {
  const dispatch = useAppDispatch();
  const { highlightedTransaction } = useTransactionNavigation();
  const txnId = `txn-${chatIndex}-${index}`;
  const isHighlighted = highlightedTransaction === txnId;
  const { chain } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  // State for tracking delegated order status
  const [orderStatus, setOrderStatus] = useState<DelegatedOrder['status'] | null>(null);
  const [executionTxHash, setExecutionTxHash] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Check if transaction network matches current chain
  const networkLabel = txn?.metadata?.network;
  const txnChain = networkLabel ? getChainByIdentifier(networkLabel) : null;
  const isWrongNetwork = txnChain && txnChain.chainId !== currentChainId;

  // Check if this is a conditional/delegated order
  const isConditionalOrder = txn?.transactionType && txn.transactionType !== 'immediate';
  const hasScheduledOrder = !!(txn?.orderId && isConditionalOrder);

  // Poll for delegated order status
  const checkOrderStatus = useCallback(async () => {
    if (!txn?.orderId || !hasScheduledOrder) return;

    try {
      const result = await getOrderById(txn.orderId);
      if (result.success && result.order) {
        setOrderStatus(result.order.status);

        // If order was executed, get the transaction hash
        if (result.order.status === 'executed' && result.order.execution?.transactionHash) {
          setExecutionTxHash(result.order.execution.transactionHash);

          // Update Redux state with the actual transaction hash
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: index,
              status: StatusEnum.SUCCESS,
              txHash: result.order.execution.transactionHash,
            })
          );
        }
      }
    } catch (error) {
      console.error('[TransactionCard] Error fetching order status:', error);
    }
  }, [txn?.orderId, hasScheduledOrder, dispatch, chatIndex, index]);

  // Set up polling for scheduled orders
  useEffect(() => {
    if (!hasScheduledOrder) return;

    // Initial check
    checkOrderStatus();

    // Poll every 10 seconds until order is executed, failed, cancelled, or expired
    const pollInterval = setInterval(() => {
      if (orderStatus && ['executed', 'failed', 'cancelled', 'expired'].includes(orderStatus)) {
        clearInterval(pollInterval);
        setIsPolling(false);
        return;
      }
      setIsPolling(true);
      checkOrderStatus();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [hasScheduledOrder, checkOrderStatus, orderStatus]);

  const handleSwitchChain = () => {
    if (txnChain) {
      switchChain({ chainId: txnChain.chainId });
    }
  };

  // Get explorer URL for transaction hash based on the transaction's network
  const getExplorerUrl = (hash: string) => {
    // Use the transaction's network chain for the explorer URL
    if (txnChain?.blockExplorer) {
      return `${txnChain.blockExplorer}/tx/${hash}`;
    }
    // Fallback to connected chain's explorer
    const explorerUrl = chain?.blockExplorers?.default?.url;
    if (explorerUrl) {
      return `${explorerUrl}/tx/${hash}`;
    }
    // Network-specific fallbacks
    const networkLower = networkLabel?.toLowerCase();
    if (networkLower === 'arbitrum') {
      return `https://arbiscan.io/tx/${hash}`;
    }
    if (networkLower === 'ethereum') {
      return `https://etherscan.io/tx/${hash}`;
    }
    if (networkLower === 'polygon') {
      return `https://polygonscan.com/tx/${hash}`;
    }
    if (networkLower === 'base') {
      return `https://basescan.org/tx/${hash}`;
    }
    if (networkLower === 'optimism') {
      return `https://optimistic.etherscan.io/tx/${hash}`;
    }
    // Default fallback
    return `https://seitrace.com/tx/${hash}`;
  };

  const functionLabel = txn?.transaction?.functionName || "Contract Call";
  const actionCount = txn?.transaction?.args?.length || 0;
  const isFailed = txn.status === StatusEnum.ERROR || txn.status === StatusEnum.SIMULATION_FAILED || orderStatus === 'failed';
  const isCompleted = txn.status === StatusEnum.SUCCESS || txn.status === StatusEnum.SIMULATION_SUCCESS;

  // Determine the actual transaction hash to use (execution hash takes priority)
  const actualTxHash = executionTxHash || txn.txHash;
  // Only show "View Tx" if we have a real transaction hash (not an orderId which is a UUID)
  const hasRealTxHash = actualTxHash && actualTxHash.startsWith('0x');

  // Debug: Log transaction type
  console.log('[TransactionCard] Render:', {
    transactionType: txn?.transactionType,
    isConditionalOrder,
    hasScheduledOrder,
    hasExecutionConditions: !!txn?.executionConditions,
    orderId: txn?.orderId,
    status: txn?.status,
    orderStatus,
    executionTxHash,
    actualTxHash,
    hasRealTxHash,
  });

  return (
    <div
      id={txnId}
      className={`
      relative rounded-lg transition-all duration-300 group
      bg-[#0a0b0f] border border-white/5 hover:border-white/10
      ${isFailed ? 'shadow-[inset_0_0_15px_-10px_rgba(239,68,68,0.15)]' : ''}
      ${isCompleted ? 'shadow-[inset_0_0_15px_-10px_rgba(16,185,129,0.15)]' : ''}
      ${isHighlighted ? 'border-violet-500/50 shadow-[0_0_20px_rgba(124,58,237,0.2)]' : ''}
    `}
    >
      {/* Decorative left border accent */}
      <div className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full transition-colors duration-300 
        ${isFailed ? 'bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
          isCompleted ? 'bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
          isWrongNetwork ? 'bg-amber-500/60' : 'bg-slate-700'}`} 
      />

      <div className="relative py-2 px-3 pl-5 flex flex-col lg:flex-row lg:items-center gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-[10px] font-mono text-slate-600">
            #{String(index + 1).padStart(2, '0')}
          </div>
          
          <div className="flex flex-col gap-0.5 min-w-0">
            <h4 className="text-[11px] font-bold text-slate-200 tracking-wider uppercase truncate">
              {functionLabel}
            </h4>
            
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-slate-400 px-1.5 py-px rounded bg-slate-800/40 border border-slate-700/30">
                <Layers size={8} /> {networkLabel}
              </span>
              {isWrongNetwork && (
                <span className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle size={8} /> Wrong Chain
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-2 w-full lg:w-auto mt-1 lg:mt-0 pl-2 lg:pl-0 border-t lg:border-t-0 border-white/5 pt-2 lg:pt-0">
          
          <StatusBadge
            status={txn.status}
            isScheduledOrder={hasScheduledOrder}
            orderStatus={orderStatus || undefined}
          />

          <div className="flex items-center gap-1.5">
            {isWrongNetwork && !isCurrentlyExecuting && !isCurrentlySimulating && (
              <ActionButton variant="primary" icon={ArrowLeftRight} onClick={handleSwitchChain} className="!py-0.5 !px-2 !h-6">
                Switch
              </ActionButton>
            )}
            
            {!isWrongNetwork && !isCurrentlyExecuting && !isCurrentlySimulating && (
              <>
                {(txn?.status === StatusEnum.IDLE || !txn?.status || txn?.status === StatusEnum.SIMULATION_SUCCESS || txn?.status === StatusEnum.SIMULATION_FAILED) && (
                  <>
                    {!isConditionalOrder && (
                      <ActionButton variant="secondary" icon={Zap} onClick={onSimulateTransaction} className="!py-0.5 !px-2 !h-6">
                        Simulate
                      </ActionButton>
                    )}
                    <ActionButton
                      variant={isConditionalOrder ? "amber" : "primary"}
                      icon={isConditionalOrder ? Clock : Play}
                      onClick={onExecuteTransaction}
                      className="!py-0.5 !px-2 !h-6"
                    >
                      {isConditionalOrder ? "Schedule" : "Execute"}
                    </ActionButton>
                  </>
                )}
                
                {/* Show View Tx for immediate transactions or executed delegated orders */}
                {((txn?.status === StatusEnum.SUCCESS && hasRealTxHash) ||
                  (hasScheduledOrder && orderStatus === 'executed' && executionTxHash)) && (
                  <a
                    href={getExplorerUrl(actualTxHash!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-violet-400 transition-colors px-1.5"
                  >
                    View Tx <ExternalLink size={8} />
                  </a>
                )}

                {/* Show refresh button for scheduled orders that are still pending */}
                {hasScheduledOrder && orderStatus && ['authorized', 'executing'].includes(orderStatus) && (
                  <button
                    onClick={checkOrderStatus}
                    disabled={isPolling}
                    className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-violet-400 transition-colors px-1.5 disabled:opacity-50"
                    title="Check order status"
                  >
                    <RefreshCw size={8} className={isPolling ? 'animate-spin' : ''} />
                  </button>
                )}
              </>
            )}

            <button 
              onClick={onToggleExpanded}
              className="p-1 text-slate-600 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="mx-3 mb-2 p-3 rounded-lg bg-[#050505]/40 border border-white/5">
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono mb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px]">Origin</span>
                  <span className="text-slate-300 truncate">{txn?.transaction?.from || "0x—"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px]">Target</span>
                  <span className="text-slate-300 truncate">{txn?.transaction?.to || txn?.transaction?.address || "0x—"}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5 flex gap-4">
                  <span className="text-slate-500">Args: <span className="text-slate-400">{actionCount}</span></span>
                  <span className="text-slate-500">Value: <span className="text-slate-400">{txn?.transaction?.value ? `${txn.transaction.value} wei` : "0"}</span></span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/5">
                <TransactionForm
                  txn={txn}
                  txnIndex={index}
                  chatIndex={chatIndex}
                  isExecuting={isCurrentlyExecuting}
                  hideExecuteButton={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
