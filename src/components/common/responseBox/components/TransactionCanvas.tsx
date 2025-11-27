import React, { useState } from "react";
import { ToolOutput, updateExecutionState } from "@/redux/chatData/reducer";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSendTransaction, useWriteContract, useChainId } from "wagmi";
import ExecuteAllButton from "./ExecuteAllButton";
import SimulateAllButton from "./SimulateAllButton";
import TransactionCard from "./TransactionCard";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import {
  updateTransactionStatus,
  reorderTransactions,
  completeTool,
  abortTool,
  updateMessageState,
} from "@/redux/chatData/action";
import { addTxn } from "@/redux/transactionData/action";
import { setGlobalData } from "@/redux/globalData/action";

const TransactionCanvas = ({
  txns,
  chatIndex,
}: {
  txns?: ToolOutput[] | undefined;
  chatIndex: number;
}) => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chatData.chats);
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token } = globalData || {};
  const chainId = useChainId();
  const correctChainId = Number(import.meta.env?.VITE_BASE_CHAIN_ID);
  const isWrongNetwork = Boolean(token && chainId !== correctChainId);
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
        (txn) => txn.status === StatusEnum.ERROR
      );
      const hasPending = toolOutputs.some(
        (txn) => txn.status === StatusEnum.PENDING
      );
      const hasIdle = toolOutputs.some(
        (txn) => !txn.status || txn.status === StatusEnum.IDLE
      );
      const successCount = toolOutputs.filter(
        (txn) => txn.status === StatusEnum.SUCCESS
      ).length;
      const allCompleted = toolOutputs.every(
        (txn) =>
          txn.status === StatusEnum.SUCCESS || txn.status === StatusEnum.ERROR
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
          })
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
      })
    );
  };

  // Execute all transactions sequentially
  const executeAllTransactions = async () => {
    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(
        setGlobalData({
          ...globalData,
          isNetworkSwitchWarningTriggered: true,
        })
      );
      return;
    }

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
      })
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
          })
        );
        continue;
      }

      // Mark as pending before execution
      dispatch(
        updateTransactionStatus({
          chatIndex,
          toolOutputIndex: i,
          status: StatusEnum.PENDING,
        })
      );

      dispatch(
        updateExecutionState({
          index: chatIndex,
          response: { currentIndex: i },
        })
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
                    })
                  );
                  // Update status in Redux store
                  dispatch(
                    updateTransactionStatus({
                      chatIndex,
                      toolOutputIndex: i,
                      status: StatusEnum.SUCCESS,
                      txHash: data as string,
                    })
                  );
                  // Add transaction to transaction store
                  dispatch(addTxn(data as string));
                  // Mark tool as completed
                  if (txn.id) {
                    dispatch(
                      completeTool({
                        toolId: txn.id.toString(),
                        hash: data as string,
                      })
                    );
                  }
                  // Update message state for this execution
                  if (txn.executionId) {
                    dispatch(
                      updateMessageState({
                        executionId: txn.executionId,
                        executionState: "completed",
                        txnHash: data as string,
                      })
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
                    })
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
                      })
                    );
                  }
                  reject(error);
                },
              }
            );
          } else {
            sendTransaction(
              {
                to: txn.transaction!.to as Address,
                value: BigInt(txn.transaction!.value || "0"),
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
                    })
                  );
                  // Update status in Redux store
                  dispatch(
                    updateTransactionStatus({
                      chatIndex,
                      toolOutputIndex: i,
                      status: StatusEnum.SUCCESS,
                      txHash: data as string,
                    })
                  );
                  // Add transaction to transaction store
                  dispatch(addTxn(data as string));
                  // Mark tool as completed
                  if (txn.id) {
                    dispatch(
                      completeTool({
                        toolId: txn.id.toString(),
                        hash: data as string,
                      })
                    );
                  }
                  // Update message state for this execution
                  if (txn.executionId) {
                    dispatch(
                      updateMessageState({
                        executionId: txn.executionId,
                        executionState: "completed",
                        txnHash: data as string,
                      })
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
                    })
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
                      })
                    );
                  }
                  reject(error);
                },
              }
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
      })
    );
  };

  const handleExecuteTransaction = (txn: ToolOutput, txnIndex: number) => {
    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(
        setGlobalData({
          ...globalData,
          isNetworkSwitchWarningTriggered: true,
        })
      );
      return;
    }

    // Mark as pending before execution
    dispatch(
      updateTransactionStatus({
        chatIndex,
        toolOutputIndex: txnIndex,
        status: StatusEnum.PENDING,
      })
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
              })
            );
            dispatch(addTxn(data as string));
            // Mark tool as completed
            if (txn.id) {
              dispatch(
                completeTool({
                  toolId: txn.id.toString(),
                  hash: data as string,
                })
              );
            }
            // Update message state for this execution
            if (txn.executionId) {
              dispatch(
                updateMessageState({
                  executionId: txn.executionId,
                  executionState: "completed",
                  txnHash: data as string,
                })
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
              })
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
                })
              );
            }
          },
        }
      );
    } else {
      sendTransaction(
        {
          to: txn.transaction!.to as Address,
          value: BigInt(txn.transaction!.value || "0"),
        },
        {
          onSuccess: (data) => {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.SUCCESS,
                txHash: data as string,
              })
            );
            dispatch(addTxn(data as string));
            // Mark tool as completed
            if (txn.id) {
              dispatch(
                completeTool({
                  toolId: txn.id.toString(),
                  hash: data as string,
                })
              );
            }
            // Update message state for this execution
            if (txn.executionId) {
              dispatch(
                updateMessageState({
                  executionId: txn.executionId,
                  executionState: "completed",
                  txnHash: data as string,
                })
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
              })
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
                })
              );
            }
          },
        }
      );
    }
  };

  // Simulate all transactions sequentially
  const simulateAllTransactions = async () => {
    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(
        setGlobalData({
          ...globalData,
          isNetworkSwitchWarningTriggered: true,
        })
      );
      return;
    }

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
        })
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
            })
          );
        } else {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: i,
              status: StatusEnum.SIMULATION_FAILED,
            })
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
          })
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
    txn: ToolOutput
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
          // For simple transfers, just validate the transaction structure
          if (txn.transaction?.to && txn.transaction?.value) {
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
    txnIndex: number
  ) => {
    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(
        setGlobalData({
          ...globalData,
          isNetworkSwitchWarningTriggered: true,
        })
      );
      return;
    }

    // Mark as simulating
    dispatch(
      updateTransactionStatus({
        chatIndex,
        toolOutputIndex: txnIndex,
        status: StatusEnum.SIMULATING,
      })
    );

    try {
      const result = await simulateTransaction(txn);

      if (result.success) {
        dispatch(
          updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.SIMULATION_SUCCESS,
          })
        );
      } else {
        dispatch(
          updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.SIMULATION_FAILED,
          })
        );
      }
    } catch (error) {
      console.error("Simulation failed:", error);
      dispatch(
        updateTransactionStatus({
          chatIndex,
          toolOutputIndex: txnIndex,
          status: StatusEnum.SIMULATION_FAILED,
        })
      );
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 p-5 shadow-[0_15px_35px_rgba(2,6,23,0.65)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-white/60">
          Transaction Queue [{" "}
          <span className="text-white/90">{orderedTxns.length}</span> ]
        </h2>
        <div className="flex gap-3">
          <SimulateAllButton
            simulationState={simulationState}
            orderedTxns={orderedTxns}
            onSimulateAll={simulateAllTransactions}
          />
          <ExecuteAllButton
            executionState={executionState}
            orderedTxns={orderedTxns}
            onExecuteAll={executeAllTransactions}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-1" type="PERSON">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-3"
            >
              {orderedTxns.map((txn, index) => {
                const isExpanded = expandedTxns.has(index);
                const isCurrentlyExecuting =
                  executionState.isExecuting &&
                  executionState.currentIndex === index;
                const isCurrentlySimulating =
                  simulationState.isSimulating &&
                  simulationState.currentIndex === index;

                return (
                  <Draggable
                    key={`draggable-${index}`}
                    draggableId={`draggable-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TransactionCard
                          txn={txn}
                          index={index}
                          chatIndex={chatIndex}
                          isExpanded={isExpanded}
                          isCurrentlyExecuting={isCurrentlyExecuting}
                          isCurrentlySimulating={isCurrentlySimulating}
                          onToggleExpanded={() => toggleExpanded(index)}
                          onExecuteTransaction={() =>
                            handleExecuteTransaction(txn, index)
                          }
                          onSimulateTransaction={() =>
                            handleSimulateTransaction(txn, index)
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TransactionCanvas;
