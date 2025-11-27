import React from "react";
import { ToolOutput } from "@/redux/chatData/reducer";
import { StatusEnum } from "@/enum/status.enum";
import { ChevronDown, ChevronUp, Play, Zap, ExternalLink } from "lucide-react";
import TransactionForm from "./TransactionForm";
import { useTransactionNavigation } from "@/contexts/TransactionNavigationContext";
import { useAccount } from "wagmi";

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
  const { highlightedTransaction } = useTransactionNavigation();
  const txnId = `txn-${chatIndex}-${index}`;
  const isHighlighted = highlightedTransaction === txnId;
  const { chain } = useAccount();

  // Get explorer URL for transaction hash
  const getExplorerUrl = (hash: string) => {
    const explorerUrl = chain?.blockExplorers?.default?.url;
    if (explorerUrl) {
      return `${explorerUrl}/tx/${hash}`;
    }
    // Fallback to a default explorer if chain explorer not available
    return `https://seitrace.com/tx/${hash}`;
  };

  // Truncate hash for display
  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const getStatusColor = () => {
    switch (txn.status) {
      case StatusEnum.SUCCESS:
        return {
          border: "border-[#2AF598]/60",
          bg: "bg-gradient-to-tr from-[#2AF598]/20 to-[#009EFD]/20",
          dot: "bg-[#2AF598]",
        };
      case StatusEnum.ERROR:
        return {
          border: "border-red-500",
          bg: "bg-red-500/10",
          dot: "bg-red-500",
        };
      case StatusEnum.PENDING:
        return {
          border: "border-blue-500",
          bg: "bg-blue-500/10",
          dot: "bg-blue-500 animate-pulse",
        };
      case StatusEnum.SIMULATING:
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-500/10",
          dot: "bg-yellow-500 animate-pulse",
        };
      case StatusEnum.SIMULATION_SUCCESS:
        return {
          border: "border-[#2AF598]/60",
          bg: "bg-gradient-to-tr from-[#2AF598]/20 to-[#009EFD]/20",
          dot: "bg-[#2AF598]",
        };
      case StatusEnum.SIMULATION_FAILED:
        return {
          border: "border-orange-500",
          bg: "bg-orange-500/10",
          dot: "bg-orange-500",
        };
      case StatusEnum.IDLE:
      default:
        return {
          border: "border-white/20",
          bg: "bg-white/5",
          dot: "bg-white/40",
        };
    }
  };

  const getStatusText = () => {
    switch (txn.status) {
      case StatusEnum.SUCCESS:
        return "Completed";
      case StatusEnum.ERROR:
        return "Failed";
      case StatusEnum.PENDING:
        return "Executing...";
      case StatusEnum.SIMULATING:
        return "Simulating...";
      case StatusEnum.SIMULATION_SUCCESS:
        return "Simulation Passed";
      case StatusEnum.SIMULATION_FAILED:
        return "Simulation Failed";
      case StatusEnum.IDLE:
      default:
        return "Ready";
    }
  };

  const statusColors = getStatusColor();
  const statusText = getStatusText();
  const functionLabel = txn?.transaction?.functionName || "Contract Call";
  const networkLabel = chain?.name;
  const actionCount = txn?.transaction?.args?.length || 0;

  return (
    <div
      id={txnId}
      className={`relative overflow-hidden rounded-[20px] border px-6 py-6 shadow-[0_20px_45px_rgba(1,12,23,0.9)] transition-all duration-500 ${
        isHighlighted
          ? "border-blue-500/60 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          : "border-white/10"
      }`}
    >
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 flex-col">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              #{index + 1} • {functionLabel}{" "}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-[12px] uppercase tracking-[0.15em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              {networkLabel}
            </div>
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-white/50 text-[11px] uppercase tracking-[0.15em] ${statusColors.border} ${statusColors.bg}`}
            >
              <div className={`h-2 w-2 rounded-full ${statusColors.dot}`} />
              {statusText}
            </div>
            <button
              aria-label={
                isExpanded ? "Collapse transaction" : "Expand transaction"
              }
              onClick={onToggleExpanded}
              className="flex items-center justify-center text-white transition border rounded-full h-9 w-9 border-white/15 bg-white/10 hover:border-white/40"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="grid gap-4 p-4 text-xs border rounded-2xl border-white/5 bg-white/5 text-white/60 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">
                From
              </p>
              <p className="mt-1 font-mono text-sm text-white break-all">
                {txn?.transaction?.from || "0x—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">
                To / Contract
              </p>
              <p className="mt-1 font-mono text-sm text-white break-all">
                {txn?.transaction?.to || txn?.transaction?.address || "0x—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">
                Args
              </p>
              <p className="mt-1 text-sm text-white">
                {actionCount} parameter{actionCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="p-4 border rounded-2xl border-white/5 bg-white/5">
            <TransactionForm
              txn={txn}
              txnIndex={index}
              chatIndex={chatIndex}
              isExecuting={isCurrentlyExecuting}
              hideExecuteButton={true}
            />
          </div>
        )}

        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Simulation passed state */}
          {txn?.status === StatusEnum.SIMULATION_SUCCESS &&
            !isCurrentlySimulating &&
            !isCurrentlyExecuting && (
              <button
                onClick={onSimulateTransaction}
                disabled
                className="flex items-center justify-center flex-1 gap-1.5 px-4 py-1.5 text-xs font-medium border rounded-full border-[#2AF598]/50 bg-gradient-to-tr from-[#2AF598]/25 to-[#009EFD]/25 text-[#2AF598]"
              >
                <span>✓ Simulation Passed</span>
              </button>
            )}

          {/* Simulation failed state */}
          {txn?.status === StatusEnum.SIMULATION_FAILED &&
            !isCurrentlySimulating &&
            !isCurrentlyExecuting && (
              <button
                onClick={onSimulateTransaction}
                className="group flex items-center justify-center flex-1 gap-1.5 px-4 py-1.5 text-xs font-medium transition-all border rounded-full border-orange-500/30 bg-orange-500/5 text-orange-300/90 hover:border-orange-500/50 hover:bg-orange-500/10"
              >
                <Zap
                  size={12}
                  className="transition-transform group-hover:scale-110"
                />
                <span>Retry Simulation</span>
              </button>
            )}

          {/* Simulate button for IDLE state only */}
          {(txn?.status === StatusEnum.IDLE || !txn?.status) &&
            !isCurrentlySimulating &&
            !isCurrentlyExecuting && (
              <button
                onClick={onSimulateTransaction}
                className="group flex flex-1 items-center justify-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-1.5 text-xs font-medium text-yellow-300/80 transition-all hover:border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-200"
              >
                <Zap
                  size={12}
                  className="transition-transform group-hover:scale-110"
                />
                <span>Simulate</span>
              </button>
            )}

          {/* Success state - show txHash link instead of execute button */}
          {txn?.status === StatusEnum.SUCCESS &&
            !isCurrentlyExecuting &&
            !isCurrentlySimulating && (
              txn.txHash ? (
                <a
                  href={getExplorerUrl(txn.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-1.5 text-xs font-medium rounded-full  bg-gradient-to-tr from-[#2AF598]/25 to-[#009EFD]/25 text-[#2AF598] hover:border-[#2AF598]/70 hover:from-[#2AF598]/30 hover:to-[#009EFD]/30 transition-all"
                  title={txn.txHash}
                >
                  <span>✓ View Transaction</span>
                  <span className="font-mono text-[10px] text-[#2AF598]/70">{truncateHash(txn.txHash)}</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center flex-1 gap-1.5 px-4 py-1.5 text-xs font-medium border rounded-full border-[#2AF598]/50 bg-gradient-to-tr from-[#2AF598]/25 to-[#009EFD]/25 text-[#2AF598]"
                >
                  <span>✓ Executed</span>
                </button>
              )
            )}

          {/* Error state for execute button */}
          {txn?.status === StatusEnum.ERROR &&
            !isCurrentlyExecuting &&
            !isCurrentlySimulating && (
              <button
                disabled
                className="flex items-center justify-center flex-1 gap-1.5 px-4 py-1.5 text-xs font-medium border rounded-full border-red-500/30 bg-red-500/5 text-red-300/90 cursor-not-allowed"
              >
                <span>✕ Failed</span>
              </button>
            )}

          {/* Default execute button for IDLE, SIMULATION_SUCCESS, SIMULATION_FAILED */}
          {(txn?.status === StatusEnum.IDLE ||
            txn?.status === StatusEnum.SIMULATION_SUCCESS ||
            txn?.status === StatusEnum.SIMULATION_FAILED ||
            !txn?.status) &&
            !isCurrentlyExecuting &&
            !isCurrentlySimulating && (
              <button
                onClick={onExecuteTransaction}
                className="group flex flex-1 items-center justify-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-medium text-blue-300/80 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-200"
              >
                <Play
                  size={12}
                  className="transition-transform group-hover:scale-110"
                />
                <span>Execute</span>
              </button>
            )}

          {isCurrentlySimulating && (
            <div className="flex items-center justify-center flex-1 gap-1.5 px-4 py-1.5 text-xs font-medium border rounded-full border-yellow-500/30 bg-yellow-500/5 text-yellow-300/90">
              <div className="w-3 h-3 border-2 border-yellow-400 rounded-full animate-spin border-t-transparent" />
              <span>Simulating...</span>
            </div>
          )}

          {isCurrentlyExecuting && (
            <div className="flex items-center justify-center flex-1 gap-1.5 px-4 py-1.5 text-xs font-medium border rounded-full border-blue-500/30 bg-blue-500/5 text-blue-300/90">
              <div className="w-3 h-3 border-2 border-blue-400 rounded-full animate-spin border-t-transparent" />
              <span>Executing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
