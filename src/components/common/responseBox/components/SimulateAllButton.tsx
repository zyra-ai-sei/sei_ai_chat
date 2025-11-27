import React from "react";
import { Zap } from "lucide-react";
import { ToolOutput } from "@/redux/chatData/reducer";
import { StatusEnum } from "@/enum/status.enum";

interface SimulateAllButtonProps {
  simulationState: {
    isSimulating: boolean;
    currentIndex: number | null;
    completedCount: number;
    hasErrors: boolean;
    isCompleted: boolean;
  };
  orderedTxns: ToolOutput[];
  onSimulateAll: () => void;
}

const SimulateAllButton: React.FC<SimulateAllButtonProps> = ({
  simulationState,
  orderedTxns,
  onSimulateAll,
}) => {
  const totalTxns = orderedTxns.length;
  const completedCount = simulationState.completedCount || 0;
  const currentIndex =
    simulationState.currentIndex !== null
      ? simulationState.currentIndex + 1
      : completedCount;

  // Check if all transactions are in a final state (SUCCESS or ERROR from history)
  const allTransactionsFinalized = orderedTxns.length > 0 && orderedTxns.every(
    (txn) => txn.status === StatusEnum.SUCCESS || txn.status === StatusEnum.ERROR
  );

  // If all transactions are finalized (from history), show disabled state
  if (allTransactionsFinalized) {
    const successCount = orderedTxns.filter(txn => txn.status === StatusEnum.SUCCESS).length;
    const hasErrors = orderedTxns.some(txn => txn.status === StatusEnum.ERROR);
    
    if (hasErrors) {
      return (
        <button
          disabled
          className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/5 px-4 py-1.5 text-xs font-medium text-red-300/90 cursor-not-allowed"
        >
          <span>Completed {successCount}/{totalTxns}</span>
        </button>
      );
    }
    
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full border border-[#2AF598]/50 bg-gradient-to-tr from-[#2AF598]/25 to-[#009EFD]/25 px-4 py-1.5 text-xs font-medium text-[#2AF598] cursor-not-allowed"
      >
        <span>✓ Completed</span>
      </button>
    );
  }

  // Simulating state
  if (simulationState.isSimulating) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5 text-xs font-medium text-yellow-300/90"
      >
        <div className="w-3 h-3 border-2 border-yellow-400 rounded-full animate-spin border-t-transparent" />
        <span>
          {currentIndex}/{totalTxns}
        </span>
      </button>
    );
  }

  // Completed with errors state
  if (simulationState.isCompleted && simulationState.hasErrors) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/5 px-4 py-1.5 text-xs font-medium text-red-300/90"
      >
        <span>Failed {completedCount}/{totalTxns}</span>
      </button>
    );
  }

  // Completed successfully state
  if (simulationState.isCompleted) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full border border-[#2AF598]/50 bg-gradient-to-tr from-[#2AF598]/25 to-[#009EFD]/25 px-4 py-1.5 text-xs font-medium text-[#2AF598]"
      >
        <span>✓ {completedCount}/{totalTxns}</span>
      </button>
    );
  }

  // Default simulatable state
  return (
    <button
      onClick={onSimulateAll}
      disabled={orderedTxns.length === 0}
      className={`group flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
        orderedTxns.length === 0
          ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-white/30"
          : "border-yellow-500/20 bg-yellow-500/5 text-yellow-300/80 hover:border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-200"
      }`}
    >
      <Zap size={12} className={orderedTxns.length === 0 ? "" : "group-hover:scale-110 transition-transform"} />
      <span>Simulate all</span>
    </button>
  );
};

export default SimulateAllButton;
