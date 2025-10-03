import React from "react";
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
  return (
    <button
      onClick={onExecuteAll}
      disabled={executionState.isExecuting || orderedTxns.length === 0}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        executionState.isExecuting
          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
          : executionState.isCompleted
          ? executionState.hasErrors
            ? "bg-red-600 hover:bg-red-700 text-white cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white cursor-not-allowed"
          : orderedTxns.length === 0
          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700 text-white"
      }`}
    >
      {executionState.isExecuting
        ? `Executing ${executionState.currentIndex !== null ? executionState.currentIndex + 1 : 0}/${orderedTxns.length}`
        : executionState.isCompleted
        ? executionState.hasErrors
          ? "Aborted"
          : "Completed"
        : "Execute All"
      }
    </button>
  );
};

export default ExecuteAllButton;