import React from "react";
import { Play } from "lucide-react";
import { ToolOutput } from "@/redux/chatData/reducer";

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
  
  // Executing state
  if (executionState.isExecuting) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-purple-300 border border-purple-500 rounded-full cursor-not-allowed bg-purple-500/20"
      >
        <div className="w-4 h-4 border-2 border-purple-300 rounded-full animate-spin border-t-transparent" />
        <span>Executing {currentIndex}/{totalTxns} ({completedCount} completed)</span>
      </button>
    );
  }
  
  // Completed with errors state
  if (executionState.isCompleted && executionState.hasErrors) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-red-500 rounded-full cursor-not-allowed bg-red-500/20"
      >
        <span>Aborted ({completedCount}/{totalTxns} completed)</span>
      </button>
    );
  }
  
  // Completed successfully state
  if (executionState.isCompleted) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-green-500 rounded-full cursor-not-allowed bg-green-500/20"
      >
        <span>Completed ({completedCount}/{totalTxns})</span>
      </button>
    );
  }
  
  // Default executable state
  return (
    <button
      onClick={onExecuteAll}
      disabled={orderedTxns.length === 0}
      className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-full text-white text-sm font-semibold transition-opacity ${
        orderedTxns.length === 0
          ? "border-white/30 bg-black/20 text-white/40 cursor-not-allowed"
          : "border-white bg-gradient-to-r from-[#204887] to-[#3b82f6] hover:opacity-90 shadow-[0px_0px_6px_0px_inset_rgba(255,255,255,0.4),0px_0px_18px_0px_inset_rgba(255,255,255,0.16)]"
      }`}
    >
      <Play size={16} fill="white" />
      <span>Execute All</span>
    </button>
  );
};

export default ExecuteAllButton;