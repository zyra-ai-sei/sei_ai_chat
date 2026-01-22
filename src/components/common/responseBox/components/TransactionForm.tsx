import { ToolOutput } from "@/redux/chatData/reducer";
import { getArgNames } from "@/utility/getArgNames";
import { useAccount, useSendTransaction, useWriteContract, useChainId, useSwitchChain } from "wagmi";
import TextInput from "../../input/TextInput";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  updateTransactionStatus,
  updateTransactionData,
  abortTool,
} from "@/redux/chatData/action";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import { headerWalletAddressShrinker } from "@/utility/walletAddressShrinker";
import TickIcon from "@/assets/popup/Tick.svg?react";
import ErrorIcon from "@/assets/popup/failed.svg?react";
import ExternalIcon from "@/assets/button/external.svg?react";
import GetInputComponent from "./GetInputComponent";
import { addTxn } from "@/redux/transactionData/action";
import { setGlobalData } from "@/redux/globalData/action";
import { Play, ArrowLeftRight } from "lucide-react";
import { isSupportedChainId, getChainByIdentifier } from "@/config/chains";
import { getTxnNetwork } from "@/utility/transactionUtils";

const TransactionForm = ({
  txn,
  txnIndex,
  chatIndex,
  isExecuting,
  hideExecuteButton = false,
}: {
  txn: ToolOutput;
  txnIndex?: number;
  chatIndex: number;
  isExecuting?: boolean;
  hideExecuteButton?: boolean;
}) => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = Boolean(!isSupportedChainId(chainId));

  // Check if transaction network matches current chain
  const networkLabel = getTxnNetwork(txn);
  const txnChain = networkLabel ? getChainByIdentifier(networkLabel) : null;
  const isWrongTxnNetwork = txnChain && txnChain.chainId !== chainId;

  const handleSwitchChain = () => {
    if (txnChain) {
      switchChain({ chainId: txnChain.chainId });
    }
  };
  const { writeContract } = useWriteContract({
    mutation: {
      onError: () => {
        // Update status in Redux store
        if (txnIndex !== undefined) {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.ERROR,
            })
          );
          dispatch(abortTool({ toolId: String(txn.id) }));
        }
      },
      onSuccess: (data) => {
        if (data) {
          dispatch(addTxn({txHash: data, network: getTxnNetwork(txn), address:address as string}));
        }
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
        if (data) {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.SUCCESS,
                txHash: data as string,
              })
            );
          }
        } else {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.ERROR,
              })
            );
          }
        }
      },
    },
  });

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onError: () => {
        // Update status in Redux store
        if (txnIndex !== undefined) {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.ERROR,
            })
          );
          dispatch(abortTool({ toolId: String(txn.id) }));
        }
      },
      onSuccess: (data) => {
        if (data) {
          dispatch(addTxn({txHash: data, network: getTxnNetwork(txn), address:address as string}));
        }
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
        if (data) {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.SUCCESS,
                txHash: data as string,
              })
            );
          }
        } else {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.ERROR,
              })
            );
          }
        }
      },
    },
  });

  // Handler functions for each field
  const handleToChange = (value: string) => {
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "to",
          value,
        })
      );
    }
  };

  const handleAddressChange = (value: string) => {
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "address",
          value,
        })
      );
    }
  };

  const handleFunctionNameChange = (e: any) => {
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "functionName",
          value: String(e.target.value),
        })
      );
    }
  };

  const handleValueChange = (value: string) => {
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "value",
          value,
        })
      );
    }
  };

  // Handle argument changes
  const handleArgChange = (index: number, value: string) => {
    if (txnIndex !== undefined) {
      const currentArgs = txn?.transaction?.args || [];
      const newArgs = [...currentArgs];

      // Check if args is an array of arrays (for complex arguments)
      if (Array.isArray(newArgs[0])) {
        const firstArgArray = [...newArgs[0]];
        firstArgArray[index] = value;
        newArgs[0] = firstArgArray;
      } else {
        // Simple args array - check if it's an object or direct value
        if (typeof newArgs[index] === "object" && newArgs[index] !== null) {
          // It's an object, update the value property
          newArgs[index] = { ...newArgs[index], value };
        } else {
          // It's a direct value, set it directly
          newArgs[index] = value;
        }
      }

      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "args",
          value: newArgs,
        })
      );
    }
  };

  const handleSubmission = () => {
    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(setGlobalData({
        ...globalData,
        isNetworkSwitchWarningTriggered: true,
      }));
      return;
    }

    if (txn?.transaction?.abi) {
      writeContract({
        abi: txn?.transaction?.abi!,
        address: txn?.transaction?.address as Address,
        functionName: txn?.transaction?.functionName,
        args: txn?.transaction?.args || [],
      });
    } else {
      sendTransaction({
        to: txn?.transaction?.to as Address,
        value: BigInt(txn?.transaction?.value || "0"),
      });
    }
  };

  const showArgs = Boolean(txn?.transaction?.args && txn.transaction?.args.length > 0);
  const targetAbiEntry = txn?.transaction?.abi?.find(
    (obj: any) =>
      obj?.name === txn?.transaction?.functionName && obj?.type === "function"
  );
  const hasComponentArgs = Boolean(
    targetAbiEntry?.inputs?.some((obj: any) => "components" in obj)
  );
  const rawArgs = Array.isArray(txn?.transaction?.args)
    ? ([...txn.transaction.args] as any[])
    : [];
  const complexArgs = hasComponentArgs && Array.isArray(rawArgs[0]) ? [...rawArgs[0]] : [];
  const argNames =
    (txn?.transaction?.abi && txn?.transaction?.functionName
      ? getArgNames(txn.transaction.abi, txn.transaction.functionName)
      : []) || [];
  const explorerUrl = txn?.txHash ? `https://seitrace.com/tx/${txn.txHash}` : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Participants Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-4 backdrop-blur-sm transition-all hover:border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
              <p className="text-xs font-medium tracking-widest uppercase text-white/60">Participants</p>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/40">
              Identity
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0 col-span-full">
              <TextInput
                disabled={true}
                title="From"
                val={address || ""}
                onChange={() => {}}
                className="w-full min-w-0 p-0"
              />
            </div>
            {txn?.transaction?.to && (
              <div className="min-w-0">
                <GetInputComponent
                  type={txn?.metadata?.types?.to || "address"}
                  title="To"
                  val={txn?.transaction?.to || ""}
                  onChange={handleToChange}
                  className="w-full min-w-0 p-0"
                />
              </div>
            )}
            {txn?.transaction?.address && (
              <div className="min-w-0 col-span-full">
                <GetInputComponent
                  disabled={true}
                  type={txn?.metadata?.types?.address || "address"}
                  title="Contract"
                  val={txn?.transaction?.address || ""}
                  onChange={handleAddressChange}
                  className="w-full min-w-0 p-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Call Configuration Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A0D19] via-[#0F1322] to-[#06080F] p-4 shadow-[0_20px_60px_rgba(4,6,14,0.8)] transition-all hover:border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
              <p className="text-xs font-medium tracking-widest uppercase text-white/60">Configuration</p>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/40">
              Params
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {txn?.transaction?.functionName && (
              <div className="min-w-0">
                <GetInputComponent
                  disabled={true}
                  type="string"
                  title="Function"
                  val={txn?.transaction?.functionName || ""}
                  onChange={handleFunctionNameChange}
                  className="w-full min-w-0 p-0"
                />
              </div>
            )}
            {txn?.transaction?.value && (
              <div className="min-w-0">
                <GetInputComponent
                  type="uint256"
                  title="Value"
                  val={txn?.transaction?.value || ""}
                  onChange={handleValueChange}
                  className="w-full min-w-0 p-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showArgs && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              <p className="text-xs font-medium tracking-widest uppercase text-white/60">Arguments</p>
            </div>
            <span className="text-[10px] font-medium text-white/40">
              {txn?.transaction?.args?.length || 0} INPUT{txn?.transaction?.args?.length === 1 ? "" : "S"}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {hasComponentArgs
              ? complexArgs.map((_, index) => {
                  const argType = txn?.metadata?.types?.args?.[index] || "default";
                  const argName = argNames[index] || `Arg ${index + 1}`;
                  const argValue = complexArgs[index] ?? "";
                  return (
                    <GetInputComponent
                      key={`complex-arg-${index}`}
                      disabled={false}
                      type={argType}
                      title={argName}
                      val={argValue}
                      onChange={(value: string) => handleArgChange(index, value)}
                      className="w-full min-w-0 p-0"
                    />
                  );
                })
              : rawArgs.map((_, index) => {
                  const argType = txn?.metadata?.types?.args?.[index] || "default";
                  const argName = argNames[index] || `Arg ${index + 1}`;
                  const argValue = rawArgs[index] ?? "";
                  return (
                    <GetInputComponent
                      key={`arg-${index}`}
                      disabled={false}
                      type={argType}
                      title={argName}
                      val={argValue}
                      onChange={(value: string) => handleArgChange(index, value)}
                      className="w-full min-w-0 p-0"
                    />
                  );
                })}
          </div>
        </div>
      )}

      {!hideExecuteButton && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-4 backdrop-blur-sm transition-all hover:border-white/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
                <p className="text-xs font-medium tracking-widest uppercase text-white/60">Execution</p>
              </div>
              <p className="text-sm text-white/40">
                {isWrongNetwork
                  ? "Switch to a supported chain to continue"
                  : isWrongTxnNetwork
                    ? `Switch to ${txnChain?.name} to execute this transaction`
                    : "Validate the call data above before executing on-chain."}
              </p>
            </div>
            {/* Switch Chain button when transaction is on different network */}
            {isWrongTxnNetwork &&
              (txn?.status === StatusEnum.PENDING || !txn?.status) &&
              !isExecuting &&
              !isWrongNetwork && (
              <button
                onClick={handleSwitchChain}
                className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-3 text-sm font-semibold text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.25)] transition hover:opacity-95"
              >
                <ArrowLeftRight size={16} />
                Switch to {txnChain?.name}
              </button>
            )}
            {/* Execute button when on correct network */}
            {!isWrongTxnNetwork &&
              (txn?.status === StatusEnum.PENDING || !txn?.status) &&
              !isExecuting &&
              !isWrongNetwork && (
              <button
                onClick={handleSubmission}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r from-[#1F8BFF] to-[#8859FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(136,89,255,0.35)] transition hover:opacity-95"
              >
                <Play size={16} fill="white" />
                Execute Transaction
              </button>
            )}
            {(isExecuting || isWrongNetwork) && (
              <div className="flex items-center gap-2 px-6 py-3 text-sm font-semibold border rounded-2xl border-white/10 bg-white/5 text-white/70">
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/40 border-t-transparent" />
                {isWrongNetwork ? "Awaiting network switch" : "Executing in queue..."}
              </div>
            )}
          </div>
        </div>
      )}

      {txn?.status === StatusEnum.SUCCESS && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border rounded-2xl border-emerald-400/50 bg-emerald-500/5">
          <div className="flex items-center gap-2 text-emerald-200">
            <TickIcon className="p-1 rounded-full bg-emerald-500/30" />
            <h1 className="text-sm font-medium">Transaction Successful</h1>
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              className="flex items-center gap-2 text-xs transition text-emerald-200/80 hover:text-emerald-100"
              rel="noreferrer"
            >
              <span>{headerWalletAddressShrinker(txn?.txHash || "")}</span>
              <ExternalIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      )}

      {txn?.status === StatusEnum.ERROR && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border rounded-2xl border-red-400/50 bg-red-500/5">
          <div className="flex items-center gap-2 text-red-200">
            <ErrorIcon className="p-1 rounded-full bg-red-500/30" />
            <h1 className="text-sm font-medium">Transaction Failed</h1>
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              className="flex items-center gap-2 text-xs transition text-red-200/80 hover:text-red-100"
              rel="noreferrer"
            >
              <span>{headerWalletAddressShrinker(txn?.txHash || "")}</span>
              <ExternalIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
