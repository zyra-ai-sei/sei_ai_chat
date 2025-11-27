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
        className="flex items-center gap-1.5 rounded-full border border-[#2AF598]/50 bg-gradient-to-tr from-[#2AF598]/25 to-[#009EFD]/25 px-4 py-1.5 text-xs font-medium text-[#2AF598]"
      >
        <span>✓ {completedCount}/{totalTxns}</span>
      </button>
    );
  }
  
  // Default executable state
  return (
    <button
      onClick={onExecuteAll}
      disabled={orderedTxns.length === 0}
      className={`group flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
        orderedTxns.length === 0
          ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-white/30"
          : "border-blue-500/20 bg-blue-500/5 text-blue-300/80 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-200"
      }`}
    >
      <Play size={12} className={orderedTxns.length === 0 ? "" : "group-hover:scale-110 transition-transform"} />
      <span>Execute all</span>
    </button>
  );
};

export default ExecuteAllButton;