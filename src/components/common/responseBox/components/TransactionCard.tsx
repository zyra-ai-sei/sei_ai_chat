import React from "react";
import { ToolOutput } from "@/redux/chatData/reducer";
import { StatusEnum } from "@/enum/status.enum";
import {
  ChevronDown,
  Play,
  Zap,
  ExternalLink,
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
} from "lucide-react";
import TransactionForm from "./TransactionForm";
import { useTransactionNavigation } from "@/contexts/TransactionNavigationContext";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { getChainByIdentifier } from "@/config/chains";
import { getTxnNetwork, getTxnFunction } from "@/utility/transactionUtils";
import { getTokensByChainId } from "@/constants/token";

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

const StatusBadge = ({ status }: { status: StatusEnum | undefined }) => {
  if (status === StatusEnum.SUCCESS) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(16,185,129,0.3)]">
        <CheckCircle2 size={10} className="text-emerald-400" />
        <span>Completed</span>
      </div>
    );
  }
  if (status === StatusEnum.ERROR || status === StatusEnum.SIMULATION_FAILED) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(239,68,68,0.3)]">
        <XCircle size={10} />
        <span>
          {status === StatusEnum.SIMULATION_FAILED ? "Sim Failed" : "Failed"}
        </span>
      </div>
    );
  }
  if (status === StatusEnum.SIMULATION_SUCCESS) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium shadow-[0_0_8px_-2px_rgba(16,185,129,0.3)]">
        <CheckCircle2 size={10} className="text-emerald-400" />
        <span>Sim Passed</span>
      </div>
    );
  }
  if (status === StatusEnum.PENDING || status === StatusEnum.SIMULATING) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium animate-pulse">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
        <span>
          {status === StatusEnum.SIMULATING ? "Simulating..." : "Executing..."}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-medium">
      <div className="w-2 h-2 rounded-full bg-slate-500" />
      <span>Pending</span>
    </div>
  );
};

const BridgeNetworks = ({ txn }: { txn: ToolOutput }) => {
  const metaData = txn.metaData || txn.metadata;
  if (!metaData?.srcNetwork || !metaData?.dstNetwork) return null;

  const srcChain = getChainByIdentifier(metaData.srcNetwork.toLowerCase());
  const dstChain = getChainByIdentifier(metaData.dstNetwork.toLowerCase());

  return (
    <div className="flex items-center gap-1.5 px-2 py-2 border rounded-full border-white/10 overflow-hidden mx-1 ">
      <div className="flex items-center gap-1 min-w-0">
        {srcChain?.logo ? (
          <img
            src={srcChain.logo}
            alt={srcChain.name}
            className="w-5 h-5 rounded-full flex-shrink-0"
          />
        ) : (
          <span className="text-[9px] text-slate-400 font-medium uppercase truncate max-w-[40px]">
            {srcChain?.name || metaData.srcNetwork}
          </span>
        )}
       
      </div>

      <ArrowRight size={10} className="text-slate-400 flex-shrink-0" />

      <div className="flex items-center gap-1 min-w-0">
        {dstChain?.logo ? (
          <img
            src={dstChain.logo}
            alt={dstChain.name}
            className="w-5 h-5 rounded-full flex-shrink-0"
          />
        ) : (
          <span className="text-[9px] text-slate-400 font-medium uppercase truncate max-w-[40px]">
            {dstChain?.name || metaData.dstNetwork}
          </span>
        )}
      </div>
    </div>
  );
};

const BridgeTokens = ({ txn }: { txn: ToolOutput }) => {
  const metaData = txn.metaData || txn.metadata;
  if (!metaData?.srcToken || !metaData?.dstToken) return null;

  const srcChain = getChainByIdentifier(metaData.srcNetwork?.toLowerCase());
  const dstChain = getChainByIdentifier(metaData.dstNetwork?.toLowerCase());

  const getDetails = (chainId?: number, address?: string) => {
    if (!chainId || !address) return { logo: null, symbol: null };
    const tokens = getTokensByChainId(chainId);
    const token = tokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase()
    );
    return { logo: token?.imageUrl, symbol: token?.symbol };
  };

  const srcDetails = getDetails(srcChain?.chainId, metaData.srcToken);
  const dstDetails = getDetails(dstChain?.chainId, metaData.dstToken);

  if (!srcDetails.symbol && !dstDetails.symbol) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-2 border rounded-full border-white/10 overflow-hidden mx-1">
      <div className="flex items-center gap-1 min-w-0">
        {srcDetails.logo ? (
          <img
            src={srcDetails.logo}
            alt={srcDetails.symbol || "src"}
            className="w-5 h-5 rounded-full flex-shrink-0"
          />
        ) : (
          <span className="text-[9px] text-slate-400 font-medium uppercase truncate max-w-[40px]">
            {srcDetails.symbol}
          </span>
        )}
      </div>

      <ArrowRight size={10} className="text-slate-400 flex-shrink-0" />

      <div className="flex items-center gap-1 min-w-0">
        {dstDetails.logo ? (
          <img
            src={dstDetails.logo}
            alt={dstDetails.symbol || "dst"}
            className="w-5 h-5 rounded-full flex-shrink-0"
          />
        ) : (
          <span className="text-[9px] text-slate-400 font-medium uppercase truncate max-w-[40px]">
            {dstDetails.symbol}
          </span>
        )}
      </div>
    </div>
  );
};

const BridgeActionDetails = ({ txn }: { txn: ToolOutput }) => {
  const metaData = txn.metaData || txn.metadata;
  if (txn.type !== "bridge" || !metaData) return null;

  const {
    function: funcType,
    srcAmount,
    dstAmount,
    srcDecimals,
    dstDecimals,
    srcToken,
    dstToken,
    srcNetwork,
    dstNetwork,
  } = metaData;

  const srcChain = getChainByIdentifier(srcNetwork?.toLowerCase());
  const dstChain = getChainByIdentifier(dstNetwork?.toLowerCase());

  const getDetails = (chainId?: number, address?: string) => {
    if (!chainId || !address) return { logo: null, symbol: null };
    const tokens = getTokensByChainId(chainId);
    const token = tokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase()
    );
    return { logo: token?.imageUrl, symbol: token?.symbol };
  };

  const srcDetails = getDetails(srcChain?.chainId, srcToken);
  const dstDetails = getDetails(dstChain?.chainId, dstToken);

  const formatAmountVal = (amount: any, decimals: any) => {
    if (!amount || decimals === undefined) return "0.00";
    try {
      return (Number(amount) / Math.pow(10, decimals)).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }
      );
    } catch (e) {
      return "0.00";
    }
  };

  if (funcType === "approve") {
    return (
      <div className="flex items-center gap-3 p-3 mb-3 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
        <div className="flex flex-col gap-1 w-full">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Approval Amount
          </span>
          <div className="flex items-center gap-2">
            <div className="relative">
              {srcDetails.logo && (
                <img
                  src={srcDetails.logo}
                  alt="token"
                  className="w-6 h-6 rounded-full border border-white/10"
                />
              )}
              {srcChain?.logo && (
                <img
                  src={srcChain.logo}
                  alt="chain"
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-[#0a0b0f] bg-[#0a0b0f]"
                />
              )}
            </div>
            <span className="text-base font-semibold text-blue-400">
              {formatAmountVal(srcAmount, srcDecimals)}{" "}
              <span className="text-[10px] text-slate-400 font-normal">
                {srcDetails.symbol || ""}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (funcType === "bridge") {
    return (
      <div className="flex flex-col gap-4 p-3 mb-3 rounded-lg bg-violet-500/10 border border-violet-500/20 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Send From {srcChain?.name}
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative flex-shrink-0">
                {srcDetails.logo && (
                  <img
                    src={srcDetails.logo}
                    alt="token"
                    className="w-6 h-6 rounded-full border border-white/10"
                  />
                )}
                {srcChain?.logo && (
                  <img
                    src={srcChain.logo}
                    alt="chain"
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-[#0a0b0f] bg-[#0a0b0f]"
                  />
                )}
              </div>
              <span className="text-sm font-semibold text-slate-100 truncate">
                {formatAmountVal(srcAmount, srcDecimals)}{" "}
                <span className="text-[9px] text-slate-400 font-normal">
                  {srcDetails.symbol || ""}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center p-1.5 rounded-full bg-white/5 border border-white/10">
            <ArrowRight size={14} className="text-violet-400" />
          </div>

          <div className="flex flex-col gap-1 items-end min-w-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-right">
              Receive at {dstChain?.name}
            </span>
            <div className="flex items-center gap-2 justify-end min-w-0">
              <span className="text-sm font-semibold text-emerald-400 truncate">
                {formatAmountVal(dstAmount, dstDecimals)}{" "}
                <span className="text-[9px] text-slate-400 font-normal">
                  {dstDetails.symbol || ""}
                </span>
              </span>
              <div className="relative flex-shrink-0">
                {dstDetails.logo && (
                  <img
                    src={dstDetails.logo}
                    alt="token"
                    className="w-6 h-6 rounded-full border border-white/10"
                  />
                )}
                {dstChain?.logo && (
                  <img
                    src={dstChain.logo}
                    alt="chain"
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-[#0a0b0f] bg-[#0a0b0f]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const ActionButton = ({
  onClick,
  variant = "primary",
  children,
  icon: Icon,
  className = "",
  disabled = false,
}: any) => {
  const variants: any = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_12px_-3px_rgba(124,58,237,0.4)] border border-violet-500/50",
    secondary:
      "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50 hover:border-slate-600",
    ghost:
      "bg-transparent hover:bg-slate-800/30 text-slate-400 hover:text-slate-200",
    disabled:
      "bg-slate-800/30 text-slate-500 border border-slate-700/30 cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-medium transition-all duration-300 active:scale-95 ${disabled ? variants.disabled : variants[variant]} ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </button>
  );
};

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
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Check if transaction network matches current chain
  const networkLabel = getTxnNetwork(txn);
  const txnChain = networkLabel ? getChainByIdentifier(networkLabel) : null;
  const isWrongNetwork = txnChain && txnChain.chainId !== currentChainId;

  const handleSwitchChain = () => {
    if (txnChain) {
      switchChain({ chainId: txnChain.chainId });
    }
  };

  // Get explorer URL for transaction hash
  const getExplorerUrl = (hash: string) => {
    const explorerUrl = chain?.blockExplorers?.default?.url;
    if (explorerUrl) {
      return `${explorerUrl}/tx/${hash}`;
    }
    // Fallback to a default explorer if chain explorer not available
    return `https://seitrace.com/tx/${hash}`;
  };

  const functionLabel = getTxnFunction(txn);
  const actionCount = txn?.transaction?.args?.length || 0;
  const isFailed =
    txn.status === StatusEnum.ERROR ||
    txn.status === StatusEnum.SIMULATION_FAILED;
  const isCompleted =
    txn.status === StatusEnum.SUCCESS ||
    txn.status === StatusEnum.SIMULATION_SUCCESS;

  return (
    <div
      id={txnId}
      className={`
      relative rounded-lg transition-all duration-300 group
      bg-[#0a0b0f] border border-white/5 hover:border-white/10
      ${isFailed ? "shadow-[inset_0_0_15px_-10px_rgba(239,68,68,0.15)]" : ""}
      ${isCompleted ? "shadow-[inset_0_0_15px_-10px_rgba(16,185,129,0.15)]" : ""}
      ${isHighlighted ? "border-violet-500/50 shadow-[0_0_20px_rgba(124,58,237,0.2)]" : ""}
    `}
    >
      {/* Decorative left border accent */}
      <div
        className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full transition-colors duration-300 
        ${
          isFailed
            ? "bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            : isCompleted
              ? "bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              : isWrongNetwork
                ? "bg-amber-500/60"
                : "bg-slate-700"
        }`}
      />

      <div className="relative py-2 px-3 pl-5 flex flex-col lg:flex-row justify-between lg:items-center gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-[10px] font-mono text-slate-600">
            #{String(index + 1).padStart(2, "0")}
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <h4 className="text-[11px] font-bold text-slate-200 tracking-wider uppercase truncate">
              {functionLabel}
            </h4>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-slate-400 px-1.5 py-px rounded bg-slate-800/40 border border-slate-700/30">
                <Layers size={8} /> {networkLabel}
              </span>
              {isWrongNetwork && (
                <span className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle size={8} /> Wrong Chain
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <BridgeNetworks txn={txn} />
          <BridgeTokens txn={txn} />
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-2 w-full lg:w-auto mt-1 lg:mt-0 pl-2 lg:pl-0 border-t lg:border-t-0 border-white/5 pt-2 lg:pt-0">
          <StatusBadge status={txn.status} />


          <div className="flex items-center gap-1.5">
            {isWrongNetwork &&
              !isCurrentlyExecuting &&
              !isCurrentlySimulating && (
                <ActionButton
                  variant="primary"
                  icon={ArrowLeftRight}
                  onClick={handleSwitchChain}
                  className="!py-0.5 !px-2 !h-6"
                >
                  Switch
                </ActionButton>
              )}

            {!isWrongNetwork &&
              !isCurrentlyExecuting &&
              !isCurrentlySimulating && (
                <>
                  {(txn?.status === StatusEnum.IDLE ||
                    !txn?.status ||
                    txn?.status === StatusEnum.SIMULATION_SUCCESS ||
                    txn?.status === StatusEnum.SIMULATION_FAILED) && (
                    <>
                      <ActionButton
                        variant="secondary"
                        icon={Zap}
                        onClick={onSimulateTransaction}
                        className="!py-0.5 !px-2 !h-6"
                      >
                        Simulate
                      </ActionButton>
                      <ActionButton
                        variant="primary"
                        icon={Play}
                        onClick={onExecuteTransaction}
                        className="!py-0.5 !px-2 !h-6"
                      >
                        Execute
                      </ActionButton>
                    </>
                  )}

                  {txn?.status === StatusEnum.SUCCESS && txn.txHash && (
                    <a
                      href={getExplorerUrl(txn.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-violet-400 transition-colors px-1.5"
                    >
                      View Tx <ExternalLink size={8} />
                    </a>
                  )}
                </>
              )}

            <button
              onClick={onToggleExpanded}
              className="p-1 text-slate-600 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronDown
                size={12}
                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div className="mx-3 mb-2 p-3 rounded-lg bg-[#050505]/40 border border-white/5">
              <BridgeActionDetails txn={txn} />
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono mb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px]">
                    Origin
                  </span>
                  <span className="text-slate-300 truncate">
                    {txn?.transaction?.from || "0x—"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px]">
                    Target
                  </span>
                  <span className="text-slate-300 truncate">
                    {txn?.transaction?.to || txn?.transaction?.address || "0x—"}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5 flex gap-4">
                  <span className="text-slate-500">
                    Args: <span className="text-slate-400">{actionCount}</span>
                  </span>
                  <span className="text-slate-500">
                    Value:{" "}
                    <span className="text-slate-400">
                      {txn?.transaction?.value
                        ? `${txn.transaction.value} wei`
                        : "0"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <TransactionForm
                  txn={txn}
                  txnIndex={index}
                  chatIndex={chatIndex}
                  isExecuting={isCurrentlyExecuting}
                  hideExecuteButton={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
