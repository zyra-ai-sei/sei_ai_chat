import React from "react";
import { Play, ArrowLeftRight } from "lucide-react";
import { ToolOutput } from "@/redux/chatData/reducer";
import { useChainId, useSwitchChain } from "wagmi";
import { getChainByIdentifier } from "@/config/chains";

interface ExecuteAllButtonProps {
  executionState: {
    isExecuting: boolean;
    currentIndex: number | null;
    completedCount: number;
    hasErrors: boolean;
    isCompleted: boolean;
  };
  orderedTxns: ToolOutput[];
  onExecuteAll: () => void;
}

const ExecuteAllButton: React.FC<ExecuteAllButtonProps> = ({
  executionState,
  orderedTxns,
  onExecuteAll,
}) => {
  const totalTxns = orderedTxns.length;
  const completedCount = executionState.completedCount || 0;
  const currentIndex = executionState.currentIndex !== null ? executionState.currentIndex + 1 : completedCount;
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Check if any transaction requires a different network
  const txnRequiringSwitch = orderedTxns.find((txn) => {
    const networkLabel = txn?.metadata?.network;
    const txnChain = networkLabel ? getChainByIdentifier(networkLabel) : null;
    return txnChain && txnChain.chainId !== currentChainId;
  });

  const handleSwitchChain = () => {
    if (txnRequiringSwitch) {
      const networkLabel = txnRequiringSwitch.metadata.network;
      const txnChain = networkLabel ? getChainByIdentifier(networkLabel) : null;
      if (txnChain) {
        switchChain({ chainId: txnChain.chainId });
      }
    }
  };
  
  // Executing state
  if (executionState.isExecuting) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-1.5 text-xs font-medium text-blue-300/90"
      >
        <div className="w-3 h-3 border-2 border-blue-400 rounded-full animate-spin border-t-transparent" />
        <span>
          {currentIndex}/{totalTxns}
        </span>
      </button>
    );
  }
  
  // Completed with errors state
  if (executionState.isCompleted && executionState.hasErrors) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/5 px-4 py-1.5 text-xs font-medium text-red-300/90"
      >
        <span>Aborted {completedCount}/{totalTxns}</span>
      </button>
    );
  }
  
  // Completed successfully state
  if (executionState.isCompleted) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-[0_0_12px_-3px_rgba(16,185,129,0.4)]"
      >
        <span>✓ {completedCount}/{totalTxns}</span>
      </button>
    );
  }
  
  // Show Switch Chain button if any transaction requires different network
  if (txnRequiringSwitch && !executionState.isExecuting) {
    const networkLabel = txnRequiringSwitch.metadata.network;
    const txnChain = networkLabel ? getChainByIdentifier(networkLabel) : null;

    return (
      <button
        onClick={handleSwitchChain}
        disabled={orderedTxns.length === 0}
        className={`group flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium transition-all ${
          orderedTxns.length === 0
            ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-white/30"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_12px_-3px_rgba(124,58,237,0.4)] border border-violet-500/50"
        }`}
      >
        <ArrowLeftRight size={14} className={orderedTxns.length === 0 ? "" : "group-hover:scale-110 transition-transform"} />
        <span>Switch to {txnChain?.name}</span>
      </button>
    );
  }

  // Default executable state
  return (
    <button
      onClick={onExecuteAll}
      disabled={orderedTxns.length === 0}
      className={`group flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all duration-300 ${
        orderedTxns.length === 0
          ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-white/30"
          : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_12px_-3px_rgba(124,58,237,0.4)] border border-violet-500/50"
      }`}
    >
      <Play size={14} className={orderedTxns.length > 0 ? "fill-current group-hover:text-white" : ""} />
      <span>Execute All</span>
    </button>
  );
};

export default ExecuteAllButton;