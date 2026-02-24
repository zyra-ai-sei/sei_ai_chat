import React from "react";
import { Activity } from "lucide-react";
import SimulateAllButton from "./SimulateAllButton";
import ExecuteAllButton from "./ExecuteAllButton";
import { ToolOutput } from "@/redux/chatData/reducer";

interface TransactionQueueHeaderProps {
  chatIndex: number;
  pendingCount: number;
  simulationState: any;
  executionState: any;
  orderedTxns: ToolOutput[];
  onSimulateAll: () => void;
  onExecuteAll: () => void;
}

const TransactionQueueHeader: React.FC<TransactionQueueHeaderProps> = ({
  chatIndex,
  pendingCount,
  simulationState,
  executionState,
  orderedTxns,
  onSimulateAll,
  onExecuteAll,
}) => {
  console.log("orderedTxns", orderedTxns);
  return (
    <div className="flex flex-col justify-between gap-2 mb-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
          <Activity size={14} />
        </div>
        <div>
          <h2 className="text-[11px] font-bold text-slate-200 uppercase tracking-[0.2em]">
            Transaction Queue
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] text-slate-500 font-mono">
              QID: {chatIndex}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
            <span className="text-[9px] text-violet-400 font-mono">
              {pendingCount} PENDING
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SimulateAllButton
          simulationState={simulationState}
          orderedTxns={orderedTxns}
          onSimulateAll={onSimulateAll}
        />
        <ExecuteAllButton
          executionState={executionState}
          orderedTxns={orderedTxns}
          onExecuteAll={onExecuteAll}
        />
      </div>
    </div>
  );
};

export default TransactionQueueHeader;
