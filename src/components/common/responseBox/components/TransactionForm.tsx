import { useState } from "react";
import { ToolOutput } from "@/redux/chatData/reducer";
import { getArgNames } from "@/utility/getArgNames";
import { useAccount, useSendTransaction, useWriteContract, useChainId, useSwitchChain, usePublicClient } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import TextInput from "../../input/TextInput";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  updateTransactionStatus,
  updateTransactionData,
  abortTool,
} from "@/redux/chatData/action";
import { Address, encodeFunctionData } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import { headerWalletAddressShrinker } from "@/utility/walletAddressShrinker";
import TickIcon from "@/assets/popup/Tick.svg?react";
import ErrorIcon from "@/assets/popup/failed.svg?react";
import ExternalIcon from "@/assets/button/external.svg?react";
import GetInputComponent from "./GetInputComponent";
import { addTxn } from "@/redux/transactionData/action";
import { setGlobalData } from "@/redux/globalData/action";
import { Play, ArrowLeftRight, Clock, Target } from "lucide-react";
import { isSupportedChainId, getChainByIdentifier } from "@/config/chains";
import { createDelegatedOrder } from "@/services/delegatedTransactionApi";

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
  const { token } = globalData || {};
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { wallets } = useWallets();
  const [isDelegatedLoading, setIsDelegatedLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const publicClient = usePublicClient();
  const { writeContractAsync: approveAsync } = useWriteContract();
  const isWrongNetwork = Boolean(token && !isSupportedChainId(chainId));

  // Check if this is a conditional/delegated order
  const isConditionalOrder = txn?.transactionType && txn.transactionType !== 'immediate';
  const executionConditions = txn?.executionConditions;

  // Debug: Log transaction type on every render
  console.log('[TransactionForm] Render - txn data:', {
    transactionType: txn?.transactionType,
    isConditionalOrder,
    hasExecutionConditions: !!executionConditions,
    executionConditions: executionConditions,
  });

  // Get the embedded Privy wallet for delegated transactions
  const embeddedWallet = wallets.find(wallet => wallet.connectorType === 'embedded');

  // Check if transaction network matches current chain
  const networkLabel = txn?.metadata?.network;
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
          dispatch(addTxn({txHash: data, network: txn.metadata.network}));
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
          dispatch(addTxn({txHash: data, network: txn.metadata?.network}));
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

  const handleSubmission = async () => {
    console.log('[TransactionForm] handleSubmission called', {
      transactionType: txn?.transactionType,
      isConditionalOrder,
      hasAbi: !!txn?.transaction?.abi,
      hasData: !!txn?.transaction?.data,
      hasApprovalNeeded: !!txn?.transaction?.approvalNeeded,
      executionConditions: txn?.executionConditions,
    });

    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(setGlobalData({
        ...globalData,
        isNetworkSwitchWarningTriggered: true,
      }));
      return;
    }

    // Handle conditional/delegated orders
    if (isConditionalOrder) {
      await handleDelegatedSubmission();
      return;
    }

    // Handle inline ERC-20 approval if needed (e.g., before Uniswap swaps)
    if (txn?.transaction?.approvalNeeded) {
      try {
        setIsApproving(true);
        const approvalData = txn.transaction.approvalNeeded;
        const approvalHash = await approveAsync({
          abi: approvalData.abi,
          address: approvalData.address as Address,
          functionName: approvalData.functionName,
          args: approvalData.args || [],
        });
        // Wait for approval to be confirmed on-chain
        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: approvalHash });
        }
        setIsApproving(false);
      } catch (error) {
        console.error("Approval failed:", error);
        setIsApproving(false);
        if (txnIndex !== undefined) {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.ERROR,
            })
          );
        }
        return; // Don't proceed with swap if approval failed
      }
    }

    // Handle immediate orders (existing logic)
    if (txn?.transaction?.abi) {
      // Debug: Log transaction details before sending
      console.log('[TransactionForm] writeContract params:', {
        address: txn?.transaction?.address,
        functionName: txn?.transaction?.functionName,
        args: txn?.transaction?.args,
        value: txn?.transaction?.value,
        valueBigInt: txn?.transaction?.value ? BigInt(txn.transaction.value).toString() : 'undefined',
        gas: txn?.transaction?.gas,
      });

      writeContract({
        abi: txn?.transaction?.abi!,
        address: txn?.transaction?.address as Address,
        functionName: txn?.transaction?.functionName,
        args: txn?.transaction?.args || [],
        value: txn?.transaction?.value ? BigInt(txn.transaction.value) : undefined,
        gas: txn?.transaction?.gas ? BigInt(txn.transaction.gas) : undefined,
      });
    } else {
      sendTransaction({
        to: txn?.transaction?.to as Address,
        value: BigInt(txn?.transaction?.value || "0"),
        data: txn?.transaction?.data as `0x${string}` | undefined,
        gas: txn?.transaction?.gas ? BigInt(txn.transaction.gas) : undefined,
      });
    }
  };

  const handleDelegatedSubmission = async () => {
    if (!embeddedWallet) {
      console.error("No embedded wallet found for delegated transaction");
      if (txnIndex !== undefined) {
        dispatch(
          updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.ERROR,
          })
        );
      }
      return;
    }

    setIsDelegatedLoading(true);

    try {
      // Encode the transaction data if we have ABI
      let encodedData = txn?.transaction?.data;
      if (!encodedData && txn?.transaction?.abi && txn?.transaction?.functionName) {
        encodedData = encodeFunctionData({
          abi: txn.transaction.abi,
          functionName: txn.transaction.functionName,
          args: txn.transaction.args || [],
        });
      }

      const response = await createDelegatedOrder({
        walletId: embeddedWallet.address,
        transactionType: txn.transactionType!,
        transactionData: {
          to: (txn.transaction.to || txn.transaction.address) as string,
          value: txn.transaction.value,
          data: encodedData,
          chainId: txn.transaction.chainId || chainId,
        },
        executionConditions: txn.executionConditions || {},
        description: txn.label || `${txn.transactionType} order`,
      });

      if (response.success && response.orderId) {
        // Update status to show order was created successfully
        if (txnIndex !== undefined) {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.SUCCESS,
              txHash: response.orderId, // Store orderId as reference
            })
          );
        }
      } else {
        throw new Error(response.error || "Failed to create delegated order");
      }
    } catch (error) {
      console.error("Error creating delegated order:", error);
      if (txnIndex !== undefined) {
        dispatch(
          updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.ERROR,
          })
        );
      }
    } finally {
      setIsDelegatedLoading(false);
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

      {/* Execution Conditions Card - Only shown for conditional orders */}
      {isConditionalOrder && executionConditions && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              <p className="text-xs font-medium tracking-widest uppercase text-amber-200/80">
                Execution Conditions
              </p>
            </div>
            <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-amber-200">
              {txn.transactionType?.replace('_', ' ')}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {executionConditions.targetPrice && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20">
                <Target size={16} className="text-amber-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Target Price</p>
                  <p className="text-sm font-medium text-white">
                    {executionConditions.priceDirection === 'above' ? '≥' : '≤'} ${executionConditions.targetPrice}
                    {executionConditions.targetTokenSymbol && (
                      <span className="ml-1 text-white/60">({executionConditions.targetTokenSymbol})</span>
                    )}
                  </p>
                </div>
              </div>
            )}
            {executionConditions.stopPrice && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20">
                <Target size={16} className="text-red-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Stop Price</p>
                  <p className="text-sm font-medium text-white">
                    ≤ ${executionConditions.stopPrice}
                  </p>
                </div>
              </div>
            )}
            {executionConditions.executeAt && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20">
                <Clock size={16} className="text-blue-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Execute At</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(executionConditions.executeAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            {executionConditions.expiresAt && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20">
                <Clock size={16} className="text-orange-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Expires At</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(executionConditions.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!hideExecuteButton && (
        <div className={`rounded-2xl border ${isConditionalOrder ? 'border-amber-500/30' : 'border-white/10'} bg-gradient-to-br from-white/[0.03] to-transparent p-4 backdrop-blur-sm transition-all hover:border-white/20`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-1.5 w-1.5 rounded-full ${isConditionalOrder ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]'}`} />
                <p className="text-xs font-medium tracking-widest uppercase text-white/60">
                  {isConditionalOrder ? 'Schedule Order' : 'Execution'}
                </p>
              </div>
              <p className="text-sm text-white/40">
                {isWrongNetwork
                  ? "Switch to a supported chain to continue"
                  : isWrongTxnNetwork
                    ? `Switch to ${txnChain?.name} to execute this transaction`
                    : isConditionalOrder
                      ? "This order will be executed automatically when conditions are met."
                      : "Validate the call data above before executing on-chain."}
              </p>
            </div>
            {/* Switch Chain button when transaction is on different network */}
            {isWrongTxnNetwork &&
              (txn?.status === StatusEnum.PENDING || !txn?.status) &&
              !isExecuting &&
              !isDelegatedLoading &&
              !isWrongNetwork && (
              <button
                onClick={handleSwitchChain}
                className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-3 text-sm font-semibold text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.25)] transition hover:opacity-95"
              >
                <ArrowLeftRight size={16} />
                Switch to {txnChain?.name}
              </button>
            )}
            {/* Execute/Schedule button when on correct network */}
            {!isWrongTxnNetwork &&
              (txn?.status === StatusEnum.PENDING || !txn?.status) &&
              !isExecuting &&
              !isDelegatedLoading &&
              !isApproving &&
              !isWrongNetwork && (
              <button
                onClick={handleSubmission}
                className={`flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 ${
                  isConditionalOrder
                    ? 'border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_25px_rgba(251,191,36,0.35)]'
                    : 'border-white/10 bg-gradient-to-r from-[#1F8BFF] to-[#8859FF] shadow-[0_0_25px_rgba(136,89,255,0.35)]'
                }`}
              >
                {isConditionalOrder ? (
                  <>
                    <Clock size={16} />
                    Schedule Order
                  </>
                ) : (
                  <>
                    <Play size={16} fill="white" />
                    Execute Transaction
                  </>
                )}
              </button>
            )}
            {(isExecuting || isDelegatedLoading || isApproving || isWrongNetwork) && (
              <div className="flex items-center gap-2 px-6 py-3 text-sm font-semibold border rounded-2xl border-white/10 bg-white/5 text-white/70">
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/40 border-t-transparent" />
                {isWrongNetwork
                  ? "Awaiting network switch"
                  : isApproving
                    ? "Approving token..."
                    : isDelegatedLoading
                      ? "Scheduling order..."
                      : "Executing in queue..."}
              </div>
            )}
          </div>
        </div>
      )}

      {txn?.status === StatusEnum.SUCCESS && (
        <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border rounded-2xl ${
          isConditionalOrder
            ? 'border-amber-400/50 bg-amber-500/5'
            : 'border-emerald-400/50 bg-emerald-500/5'
        }`}>
          <div className={`flex items-center gap-2 ${isConditionalOrder ? 'text-amber-200' : 'text-emerald-200'}`}>
            {isConditionalOrder ? (
              <Clock size={20} className="p-1 rounded-full bg-amber-500/30" />
            ) : (
              <TickIcon className="p-1 rounded-full bg-emerald-500/30" />
            )}
            <h1 className="text-sm font-medium">
              {isConditionalOrder ? 'Order Scheduled Successfully' : 'Transaction Successful'}
            </h1>
          </div>
          {isConditionalOrder ? (
            <span className="text-xs text-amber-200/80">
              Order ID: {headerWalletAddressShrinker(txn?.txHash || "")}
            </span>
          ) : (
            explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                className="flex items-center gap-2 text-xs transition text-emerald-200/80 hover:text-emerald-100"
                rel="noreferrer"
              >
                <span>{headerWalletAddressShrinker(txn?.txHash || "")}</span>
                <ExternalIcon className="w-4 h-4" />
              </a>
            )
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
