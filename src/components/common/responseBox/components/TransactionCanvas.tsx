import React, { useState } from "react";
import { ToolOutput, updateExecutionState } from "@/redux/chatData/reducer";
import {
  useSendTransaction,
  useWriteContract,
  useChainId,
  useAccount,
} from "wagmi";
import TransactionQueueHeader from "./TransactionQueueHeader";
import TransactionList from "./TransactionList";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import {
  updateTransactionStatus,
  reorderTransactions,
  abortTool,
  updateMessageState,
} from "@/redux/chatData/action";
import { addTxn } from "@/redux/transactionData/action";
import { getTxnNetwork } from "@/utility/transactionUtils";

const TransactionCanvas = ({
  txns,
  chatIndex,
}: {
  txns?: ToolOutput[] | undefined;
  chatIndex: number;
}) => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chatData.chats);
  const chainId = useChainId();
  const { address } = useAccount();

  const executionState = chats[chatIndex]?.response?.execution_state || {
    isExecuting: false,
    currentIndex: null,
    completedCount: 0,
    hasErrors: false,
    isCompleted: false,
  };

  const [simulationState, setSimulationState] = useState({
    isSimulating: false,
    currentIndex: null as number | null,
    completedCount: 0,
    hasErrors: false,
    isCompleted: false,
  });

  const [orderedTxns, setOrderedTxns] = useState<ToolOutput[]>(txns || []);
  const [expandedTxns, setExpandedTxns] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedTxns);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTxns(newExpanded);
  };

  React.useEffect(() => {
    const latestTxns = chats[chatIndex]?.response?.tool_outputs || txns || [];
    setOrderedTxns(latestTxns);
  }, [txns, chats[chatIndex]?.response?.tool_outputs, chatIndex]);

  // Update execution state when all transactions complete (but don't send notifications here)
  React.useEffect(() => {
    const toolOutputs = chats[chatIndex]?.response?.tool_outputs;
    if (toolOutputs && toolOutputs.length > 0) {
      const hasErrors = toolOutputs.some(
        (txn) => txn.status === StatusEnum.ERROR,
      );
      const hasPending = toolOutputs.some(
        (txn) => txn.status === StatusEnum.PENDING,
      );
      const hasIdle = toolOutputs.some(
        (txn) => !txn.status || txn.status === StatusEnum.IDLE,
      );
      const successCount = toolOutputs.filter(
        (txn) => txn.status === StatusEnum.SUCCESS,
      ).length;
      const allCompleted = toolOutputs.every(
        (txn) =>
          txn.status === StatusEnum.SUCCESS || txn.status === StatusEnum.ERROR,
      );

      // Only update execution state, don't send notifications from here
      if (
        allCompleted &&
        !hasPending &&
        !hasIdle &&
        !executionState.isExecuting
      ) {
        dispatch(
          updateExecutionState({
            index: chatIndex,
            response: {
              hasErrors,
              isCompleted: !hasErrors,
              completedCount: successCount,
            },
          }),
        );
      }
    }
  }, [
    chats[chatIndex]?.response?.tool_outputs,
    chatIndex,
    dispatch,
    executionState.isExecuting,
  ]);

  const { writeContract } = useWriteContract();

  const { sendTransaction } = useSendTransaction();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedTxns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedTxns(items);
    dispatch(
      reorderTransactions({
        chatIndex,
        reorderedTxns: items,
      }),
    );
  };

  // Execute all transactions sequentially
  const executeAllTransactions = async () => {
    const currentTxns = chats[chatIndex]?.response?.tool_outputs || [];
    if (currentTxns.length === 0) return;

    dispatch(
      updateExecutionState({
        index: chatIndex,
        response: {
          isExecuting: true,
          currentIndex: 0,
          completedCount: 0,
          hasErrors: false,
          isCompleted: false,
        },
      }),
    );

    // Use local counter instead of reading from closure
    let completedCount = 0;
    // Collect successful transaction hashes
    const successfulTxHashes: string[] = [];

    for (let i = 0; i < currentTxns.length; i++) {
      const txn = currentTxns[i];

      // Skip if transaction is already successful
      if (txn.status === StatusEnum.SUCCESS) {
        completedCount++;
        if (txn.txHash) {
          successfulTxHashes.push(txn.txHash);
        }
        dispatch(
          updateExecutionState({
            index: chatIndex,
            response: { completedCount },
          }),
        );
        continue;
      }

      // Mark as pending before execution
      dispatch(
        updateTransactionStatus({
          chatIndex,
          toolOutputIndex: i,
          status: StatusEnum.PENDING,
        }),
      );

      dispatch(
        updateExecutionState({
          index: chatIndex,
          response: { currentIndex: i },
        }),
      );

      try {
        // Execute the transaction and wait for it to complete
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Transaction timeout"));
          }, 30000); // 30 second timeout

          if (txn.transaction?.abi) {
            writeContract(
              {
                abi: txn.transaction!.abi!,
                address: txn.transaction!.address as Address,
                functionName: txn.transaction!.functionName,
                args: txn.transaction!.args || [],
              },
              {
                onSuccess: (data) => {
                  clearTimeout(timeout);
                  completedCount++;
                  successfulTxHashes.push(data as string);
                  dispatch(
                    updateExecutionState({
                      index: chatIndex,
                      response: { completedCount },
                    }),
                  );
                  // Update status in Redux store
                  dispatch(
                    updateTransactionStatus({
                      chatIndex,
                      toolOutputIndex: i,
                      status: StatusEnum.SUCCESS,
                      txHash: data as string,
                    }),
                  );
                  // Add transaction to transaction store
                  dispatch(
                    addTxn({
                      txHash: data,
                      network: getTxnNetwork(txn),
                      address: address as string,
                    }),
                  );

                  // Update message state for this execution
                  if (txn.executionId) {
                    dispatch(
                      updateMessageState({
                        executionId: txn.executionId,
                        executionState: "completed",
                        txnHash: data as string,
                        network: getTxnNetwork(txn),
                        address: address!,
                        transactionIndex: txn.transactionIndex ?? 0,
                      }),
                    );
                  }
                  resolve();
                },
                onError: (error) => {
                  clearTimeout(timeout);
                  console.error(`Transaction ${i} failed:`, error);
                  // Update status in Redux store
                  dispatch(
                    updateTransactionStatus({
                      chatIndex,
                      toolOutputIndex: i,
                      status: StatusEnum.ERROR,
                    }),
                  );
                  // Mark tool as aborted
                  if (txn.id) {
                    dispatch(abortTool({ toolId: txn.id.toString() }));
                  }
                  // Update message state for this execution
                  if (txn.executionId) {
                    dispatch(
                      updateMessageState({
                        executionId: txn.executionId,
                        executionState: "failed",
                        network: getTxnNetwork(txn),
                        address: address!,
                        transactionIndex: txn.transactionIndex ?? 0,
                      }),
                    );
                  }
                  reject(error);
                },
              },
            );
          } else {
            sendTransaction(
              {
                to: txn.transaction!.to as Address,
                value: txn.transaction!.value
                  ? BigInt(txn.transaction!.value)
                  : undefined,
                data: txn.transaction!.data as `0x${string}` | undefined,
              },
              {
                onSuccess: (data) => {
                  clearTimeout(timeout);
                  completedCount++;
                  successfulTxHashes.push(data as string);
                  dispatch(
                    updateExecutionState({
                      index: chatIndex,
                      response: { completedCount },
                    }),
                  );
                  // Update status in Redux store
                  dispatch(
                    updateTransactionStatus({
                      chatIndex,
                      toolOutputIndex: i,
                      status: StatusEnum.SUCCESS,
                      txHash: data as string,
                    }),
                  );
                  // Add transaction to transaction store
                  dispatch(
                    addTxn({
                      txHash: data,
                      network: getTxnNetwork(txn),
                      address: address as string,
                    }),
                  );

                  // Update message state for this execution
                  if (txn.executionId) {
                    dispatch(
                      updateMessageState({
                        executionId: txn.executionId,
                        executionState: "completed",
                        txnHash: data as string,
                        network: getTxnNetwork(txn),
                        address: address!,
                        transactionIndex: txn.transactionIndex ?? 0,
                      }),
                    );
                  }
                  resolve();
                },
                onError: (error) => {
                  clearTimeout(timeout);
                  console.error(`Transaction ${i} failed:`, error);
                  // Update status in Redux store
                  dispatch(
                    updateTransactionStatus({
                      chatIndex,
                      toolOutputIndex: i,
                      status: StatusEnum.ERROR,
                    }),
                  );
                  // Mark tool as aborted
                  if (txn.id) {
                    dispatch(abortTool({ toolId: txn.id.toString() }));
                  }
                  // Update message state for this execution
                  if (txn.executionId) {
                    dispatch(
                      updateMessageState({
                        executionId: txn.executionId,
                        executionState: "failed",
                        network: getTxnNetwork(txn),
                        address: address!,
                        transactionIndex: txn.transactionIndex ?? 0,
                      }),
                    );
                  }
                  reject(error);
                },
              },
            );
          }
        });

        // Wait a bit between transactions to ensure proper sequencing
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to execute transaction ${i}:`, error);
        // Continue to next transaction instead of stopping
      }
    }

    const hasErrors = successfulTxHashes.length < currentTxns.length;
    dispatch(
      updateExecutionState({
        index: chatIndex,
        response: {
          isExecuting: false,
          currentIndex: null,
          hasErrors,
          isCompleted: !hasErrors,
          completedCount,
        },
      }),
    );
  };

  const handleExecuteTransaction = (txn: ToolOutput, txnIndex: number) => {
    // Check if user is on wrong network
    // Mark as pending before execution
    dispatch(
      updateTransactionStatus({
        chatIndex,
        toolOutputIndex: txnIndex,
        status: StatusEnum.PENDING,
      }),
    );

    // Execute individual transaction
    if (txn?.transaction?.abi) {
      writeContract(
        {
          abi: txn.transaction.abi,
          address: txn.transaction.address as Address,
          functionName: txn.transaction.functionName,
          args: txn.transaction.args || [],
        },
        {
          onSuccess: (data) => {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.SUCCESS,
                txHash: data as string,
              }),
            );
            dispatch(
              addTxn({
                txHash: data,
                network: getTxnNetwork(txn),
                address: address as string,
              }),
            );

            // Update message state for this execution
            if (txn.executionId) {
              dispatch(
                updateMessageState({
                  executionId: txn.executionId,
                  executionState: "completed",
                  txnHash: data as string,
                  network: getTxnNetwork(txn),
                  address: address!,
                  transactionIndex: txn.transactionIndex ?? 0,
                }),
              );
            }
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.ERROR,
              }),
            );
            if (txn.id) {
              dispatch(abortTool({ toolId: txn.id.toString() }));
            }
            // Update message state for this execution
            if (txn.executionId) {
              dispatch(
                updateMessageState({
                  executionId: txn.executionId,
                  executionState: "failed",
                  network: getTxnNetwork(txn),
                  address: address!,
                  transactionIndex: txn.transactionIndex ?? 0,
                }),
              );
            }
          },
        },
      );
    } else {
      sendTransaction(
        {
          to: txn.transaction!.to as Address,
          value: txn.transaction!.value
            ? BigInt(txn.transaction!.value)
            : undefined,
          data: txn.transaction!.data as `0x${string}` | undefined,
        },
        {
          onSuccess: (data) => {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.SUCCESS,
                txHash: data as string,
              }),
            );
            dispatch(
              addTxn({
                txHash: data,
                network: getTxnNetwork(txn),
                address: address as string,
              }),
            );

            // Update message state for this execution
            if (txn.executionId) {
              dispatch(
                updateMessageState({
                  executionId: txn.executionId,
                  executionState: "completed",
                  txnHash: data as string,
                  network: getTxnNetwork(txn),
                  address: address!,
                  transactionIndex: txn.transactionIndex ?? 0,
                }),
              );
            }
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.ERROR,
              }),
            );
            if (txn.id) {
              dispatch(abortTool({ toolId: txn.id.toString() }));
            }
            // Update message state for this execution
            if (txn.executionId) {
              dispatch(
                updateMessageState({
                  executionId: txn.executionId,
                  executionState: "failed",
                  network: getTxnNetwork(txn),
                  address: address!,
                  transactionIndex: txn.transactionIndex ?? 0,
                }),
              );
            }
          },
        },
      );
    }
  };

  // Simulate all transactions sequentially
  const simulateAllTransactions = async () => {
    // Check if user is on wrong network

    const currentTxns = chats[chatIndex]?.response?.tool_outputs || [];
    if (currentTxns.length === 0) return;

    setSimulationState({
      isSimulating: true,
      currentIndex: 0,
      completedCount: 0,
      hasErrors: false,
      isCompleted: false,
    });

    let completedCount = 0;

    for (let i = 0; i < currentTxns.length; i++) {
      const txn = currentTxns[i];

      // Mark as simulating
      dispatch(
        updateTransactionStatus({
          chatIndex,
          toolOutputIndex: i,
          status: StatusEnum.SIMULATING,
        }),
      );

      setSimulationState((prev) => ({
        ...prev,
        currentIndex: i,
      }));

      try {
        // Simulate the transaction
        const simulationResult = await simulateTransaction(txn);

        if (simulationResult.success) {
          completedCount++;
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: i,
              status: StatusEnum.SIMULATION_SUCCESS,
            }),
          );
        } else {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: i,
              status: StatusEnum.SIMULATION_FAILED,
            }),
          );
          // Stop on first failure
          setSimulationState({
            isSimulating: false,
            currentIndex: null,
            completedCount,
            hasErrors: true,
            isCompleted: true,
          });
          return;
        }

        // Wait a bit between simulations
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to simulate transaction ${i}:`, error);
        dispatch(
          updateTransactionStatus({
            chatIndex,
            toolOutputIndex: i,
            status: StatusEnum.SIMULATION_FAILED,
          }),
        );
        setSimulationState({
          isSimulating: false,
          currentIndex: null,
          completedCount,
          hasErrors: true,
          isCompleted: true,
        });
        return;
      }
    }

    setSimulationState({
      isSimulating: false,
      currentIndex: null,
      completedCount,
      hasErrors: false,
      isCompleted: true,
    });
  };

  // Simulate individual transaction
  const simulateTransaction = async (
    txn: ToolOutput,
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      try {
        if (txn?.transaction?.abi) {
          // Use wagmi's simulateContract internally
          fetch("/api/simulate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              abi: txn.transaction.abi,
              address: txn.transaction.address,
              functionName: txn.transaction.functionName,
              args: txn.transaction.args || [],
              chainId,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                resolve({ success: true });
              } else {
                resolve({ success: false, error: data.error });
              }
            })
            .catch((error) => {
              resolve({ success: false, error: error.message });
            });
        } else {
          // For simple transfers and bridge transactions without ABI
          if (
            txn.type === "bridge" ||
            (txn.transaction?.to &&
              (txn.transaction?.value || txn.transaction?.data))
          ) {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: "Invalid transaction structure" });
          }
        }
      } catch (error: any) {
        resolve({ success: false, error: error.message });
      }
    });
  };

  const handleSimulateTransaction = async (
    txn: ToolOutput,
    txnIndex: number,
  ) => {
    // Check if user is on wrong network

    // Mark as simulating
    dispatch(
      updateTransactionStatus({
        chatIndex,
        toolOutputIndex: txnIndex,
        status: StatusEnum.SIMULATING,
      }),
    );

    try {
      const result = await simulateTransaction(txn);

      if (result.success) {
        dispatch(
          updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.SIMULATION_SUCCESS,
          }),
        );
      } else {
        dispatch(
          updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.SIMULATION_FAILED,
          }),
        );
      }
    } catch (error) {
      console.error("Simulation failed:", error);
      dispatch(
        updateTransactionStatus({
          chatIndex,
          toolOutputIndex: txnIndex,
          status: StatusEnum.SIMULATION_FAILED,
        }),
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="relative group rounded-xl bg-[#0d0d10] border border-white/5 p-[1px] shadow-xl">
        <div className="absolute -top-[1px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="px-4 py-3">
          <TransactionQueueHeader
            chatIndex={chatIndex}
            pendingCount={orderedTxns.length}
            simulationState={simulationState}
            executionState={executionState}
            orderedTxns={orderedTxns}
            onSimulateAll={simulateAllTransactions}
            onExecuteAll={executeAllTransactions}
          />

          <TransactionList
            orderedTxns={orderedTxns}
            executionState={executionState}
            simulationState={simulationState}
            onDragEnd={onDragEnd}
            expandedTxns={expandedTxns}
            toggleExpanded={toggleExpanded}
            chatIndex={chatIndex}
            onExecuteTransaction={handleExecuteTransaction}
            onSimulateTransaction={handleSimulateTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionCanvas;
