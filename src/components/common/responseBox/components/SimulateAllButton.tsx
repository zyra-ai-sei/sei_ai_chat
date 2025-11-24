import React from "react";
import { Zap } from "lucide-react";
import { ToolOutput } from "@/redux/chatData/reducer";

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

  // Simulating state
  if (simulationState.isSimulating) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-1.5 text-xs font-medium text-yellow-300/90"
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
        className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-300/90"
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
        className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-300/90"
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
      className={`group flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
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
