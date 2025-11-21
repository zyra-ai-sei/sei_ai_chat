import React from "react";
import { ToolOutput } from "@/redux/chatData/reducer";
import { StatusEnum } from "@/enum/status.enum";
import { ChevronDown, ChevronUp, Play, Zap } from "lucide-react";
import TransactionForm from "./TransactionForm";
import { useAppDispatch } from "@/hooks/useRedux";
import { updateTransactionData } from "@/redux/chatData/action";

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
  const dispatch = useAppDispatch();

  // Handle changes for collapsed view inputs
  const handleToChange = (value: string) => {
    dispatch(
      updateTransactionData({
        chatIndex,
        toolOutputIndex: index,
        field: "to",
        value,
      })
    );
  };

  const handleValueChange = (value: string) => {
    dispatch(
      updateTransactionData({
        chatIndex,
        toolOutputIndex: index,
        field: "value",
        value,
      })
    );
  };

  const handleAddressChange = (value: string) => {
    dispatch(
      updateTransactionData({
        chatIndex,
        toolOutputIndex: index,
        field: "address",
        value,
      })
    );
  };

  // Helper to get key field for collapsed view
  const getKeyField = () => {
    if (txn?.transaction?.to) {
      return { label: "To Address", value: txn.transaction.to };
    }
    if (txn?.transaction?.address) {
      return { label: "Contract", value: txn.transaction.address };
    }
    return { label: "From", value: "" };
  };

  const getRelevantAmount = () => {
    if (txn?.transaction?.value) {
      return { label: "Amount", value: txn.transaction.value };
    }
    // Check if there's a significant first arg that looks like an amount
    if (txn?.transaction?.args && txn.transaction.args.length > 0) {
      const firstArg = txn.transaction.args[0];
      if (typeof firstArg === "string" || typeof firstArg === "number") {
        return { label: "Amount", value: firstArg.toString() };
      }
    }
    return null;
  };

  const getStatusColor = () => {
    switch (txn.status) {
      case StatusEnum.SUCCESS:
        return {
          border: "border-green-500",
          bg: "bg-green-500/10",
          dot: "bg-green-500",
        };
      case StatusEnum.ERROR:
        return {
          border: "border-red-500",
          bg: "bg-red-500/10",
          dot: "bg-red-500",
        };
      case StatusEnum.PENDING:
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-500/10",
          dot: "bg-yellow-500",
        };
      case StatusEnum.SIMULATING:
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-500/10",
          dot: "bg-yellow-500 animate-pulse",
        };
      case StatusEnum.SIMULATION_SUCCESS:
        return {
          border: "border-blue-500",
          bg: "bg-blue-500/10",
          dot: "bg-blue-500",
        };
      case StatusEnum.SIMULATION_FAILED:
        return {
          border: "border-orange-500",
          bg: "bg-orange-500/10",
          dot: "bg-orange-500",
        };
      default:
        return { border: "", bg: "", dot: "bg-purple-500" };
    }
  };

  const getStatusText = () => {
    switch (txn.status) {
      case StatusEnum.SUCCESS:
        return "Completed";
      case StatusEnum.ERROR:
        return "Failed";
      case StatusEnum.PENDING:
        return "Pending";
      case StatusEnum.SIMULATING:
        return "Simulating...";
      case StatusEnum.SIMULATION_SUCCESS:
        return "Simulation Passed";
      case StatusEnum.SIMULATION_FAILED:
        return "Simulation Failed";
      default:
        return "Pending";
    }
  };

  const keyField = getKeyField();
  const amountField = getRelevantAmount();
  const statusColors = getStatusColor();
  const statusText = getStatusText();

  return (
    <div className="bg-[#201F24] px-[24px] py-[20px] rounded-[12px]">
      {/* Transaction Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">
          Unsigned transaction {index + 1}
        </p>
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded-full border ${statusColors.border} ${statusColors.bg}`}
        >
          <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
          <span className="text-[10px] text-white font-normal">
            {statusText}
          </span>
        </div>
      </div>

      {/* Collapsed View - Show key fields */}
      {!isExpanded && (
        <div className="flex gap-4 mb-4">
          {/* Key Field (Address/To/Contract) */}
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-xs text-white/60">{keyField.label}</label>
            <input
              type="text"
              value={keyField.value || ""}
              onChange={(e) => {
                if (txn?.transaction?.to) {
                  handleToChange(e.target.value);
                } else if (txn?.transaction?.address) {
                  handleAddressChange(e.target.value);
                }
              }}
              disabled={!!txn?.transaction?.address} // Disable if it's a contract address
              className="bg-black/20 border border-white/60 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 outline-none focus:border-white/80 focus:text-white transition-colors disabled:text-white/40 disabled:cursor-not-allowed"
            />
          </div>

          {/* Amount Field (if exists) */}
          {amountField && (
            <div className="flex flex-col w-[124px]">
              <label className="mb-1 text-xs text-white/60">{amountField.label}</label>
              <input
                type="text"
                value={amountField.value}
                onChange={(e) => handleValueChange(e.target.value)}
                className="bg-black/20 border border-white/60 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 outline-none focus:border-white/80 focus:text-white transition-colors"
              />
            </div>
          )}
        </div>
      )}

      {/* Expanded View - Show full TransactionForm */}
      {isExpanded && (
        <div className="mb-4">
          <TransactionForm
            txn={txn}
            txnIndex={index}
            chatIndex={chatIndex}
            isExecuting={isCurrentlyExecuting}
            hideExecuteButton={true}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Expand/Collapse Settings Button */}
        <button
          onClick={onToggleExpanded}
          className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors border border-white rounded-full hover:bg-white/10"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              <span>Collapse Settings</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              <span>Expand Settings</span>
            </>
          )}
        </button>

        {/* Simulate Transaction Button - Show simulation passed state */}
        {txn?.status === StatusEnum.SIMULATION_SUCCESS &&
          !isCurrentlySimulating &&
          !isCurrentlyExecuting && (
            <button
              onClick={onSimulateTransaction}
              disabled
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-semibold text-white border border-blue-500 rounded-full cursor-not-allowed bg-blue-500/20"
            >
              <Zap size={16} fill="white" />
              <span>Simulation Passed</span>
            </button>
          )}

        {/* Simulate Transaction Button - Show simulation failed state */}
        {txn?.status === StatusEnum.SIMULATION_FAILED &&
          !isCurrentlySimulating &&
          !isCurrentlyExecuting && (
            <button
              onClick={onSimulateTransaction}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-semibold text-white transition-opacity border border-orange-500 rounded-full hover:opacity-90 bg-orange-500/20"
            >
              <Zap size={16} fill="white" />
              <span>Simulation Failed</span>
            </button>
          )}

        {/* Simulate Transaction Button - Default state */}
        {(txn?.status === StatusEnum.PENDING || !txn?.status) &&
          !isCurrentlySimulating &&
          !isCurrentlyExecuting && (
            <button
              onClick={onSimulateTransaction}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-white rounded-full bg-gradient-to-r from-[#87872b] to-[#d4af37] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0px_0px_6px_0px_inset_rgba(255,255,255,0.4),0px_0px_18px_0px_inset_rgba(255,255,255,0.16)]"
            >
              <Zap size={16} fill="white" />
              <span>Simulate</span>
            </button>
          )}

        {/* Execute Transaction Button - Always show except when executing/simulating or already completed */}
        {(txn?.status === StatusEnum.PENDING || 
          txn?.status === StatusEnum.SIMULATION_SUCCESS || 
          txn?.status === StatusEnum.SIMULATION_FAILED ||
          !txn?.status) &&
          !isCurrentlyExecuting &&
          !isCurrentlySimulating && (
            <button
              onClick={onExecuteTransaction}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-white rounded-full bg-gradient-to-r from-[#204887] to-[#3b82f6] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0px_0px_6px_0px_inset_rgba(255,255,255,0.4),0px_0px_18px_0px_inset_rgba(255,255,255,0.16)]"
            >
              <Play size={16} fill="white" />
              <span>Execute</span>
            </button>
          )}

        {/* Show simulating state */}
        {isCurrentlySimulating && (
          <div className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-semibold text-yellow-300 border border-yellow-500 rounded-full bg-yellow-500/20">
            <div className="w-4 h-4 border-2 border-yellow-300 rounded-full animate-spin border-t-transparent" />
            <span>Simulating...</span>
          </div>
        )}

        {/* Show executing state */}
        {isCurrentlyExecuting && (
          <div className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-semibold text-purple-300 border border-purple-500 rounded-full bg-purple-500/20">
            <div className="w-4 h-4 border-2 border-purple-300 rounded-full animate-spin border-t-transparent" />
            <span>Executing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
