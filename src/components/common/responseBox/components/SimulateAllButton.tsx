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
        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-yellow-300 border border-yellow-500 rounded-full cursor-not-allowed bg-yellow-500/20"
      >
        <div className="w-4 h-4 border-2 border-yellow-300 rounded-full animate-spin border-t-transparent" />
        <span>
          Simulating {currentIndex}/{totalTxns} ({completedCount} completed)
        </span>
      </button>
    );
  }

  // Completed with errors state
  if (simulationState.isCompleted && simulationState.hasErrors) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-red-500 rounded-full cursor-not-allowed bg-red-500/20"
      >
        <span>
          Simulation Failed ({completedCount}/{totalTxns} succeeded)
        </span>
      </button>
    );
  }

  // Completed successfully state
  if (simulationState.isCompleted) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-green-500 rounded-full cursor-not-allowed bg-green-500/20"
      >
        <span>
          All Simulations Passed ({completedCount}/{totalTxns})
        </span>
      </button>
    );
  }

  // Default simulatable state
  return (
    <button
      onClick={onSimulateAll}
      disabled={orderedTxns.length === 0}
      className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-full text-white text-sm font-semibold transition-opacity ${
        orderedTxns.length === 0
          ? "border-white/30 bg-black/20 text-white/40 cursor-not-allowed"
          : "border-white bg-gradient-to-r from-[#87872b] to-[#d4af37] hover:opacity-90 shadow-[0px_0px_6px_0px_inset_rgba(255,255,255,0.4),0px_0px_18px_0px_inset_rgba(255,255,255,0.16)]"
      }`}
    >
      <Zap size={16} fill="white" />
      <span>Simulate All</span>
    </button>
  );
};

export default SimulateAllButton;
