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
} from "@/redux/chatData/action";
import { addTxn } from "@/redux/transactionData/action";
import { setGlobalData } from "@/redux/globalData/action";
import GradientBorder from "../../GradientBorder";

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
  
  // Simulation state
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

  // Update orderedTxns when txns prop changes or when Redux store updates
  React.useEffect(() => {
    const latestTxns = chats[chatIndex]?.response?.tool_outputs || txns || [];
    setOrderedTxns(latestTxns);
  }, [txns, chats[chatIndex]?.response?.tool_outputs, chatIndex]);

  // Auto-update execution state based on tool_outputs status
  React.useEffect(() => {
    const toolOutputs = chats[chatIndex]?.response?.tool_outputs;
    if (toolOutputs && toolOutputs.length > 0) {
      const hasErrors = toolOutputs.some(
        (txn) => txn.status === StatusEnum.ERROR
      );
      const hasPending = toolOutputs.some(
        (txn) => txn.status === StatusEnum.PENDING
      );
      const successCount = toolOutputs.filter(
        (txn) => txn.status === StatusEnum.SUCCESS
      ).length;
      const allCompleted = toolOutputs.every(
        (txn) =>
          txn.status === StatusEnum.SUCCESS || txn.status === StatusEnum.ERROR
      );

      // Only update if all transactions are completed and we're not currently executing
      if (allCompleted && !hasPending && !executionState.isExecuting) {
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

    for (let i = 0; i < currentTxns.length; i++) {
      const txn = currentTxns[i];

      // Skip if transaction is already successful
      if (txn.status === StatusEnum.SUCCESS) {
        completedCount++;
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
        // Mark transaction as failed and stop execution
        dispatch(
          updateExecutionState({
            index: chatIndex,
            response: {
              isExecuting: false,
              currentIndex: null,
              hasErrors: true,
              completedCount,
            },
          })
        );
        return; // Stop executing subsequent transactions
      }
    }

    dispatch(
      updateExecutionState({
        index: chatIndex,
        response: {
          isExecuting: false,
          currentIndex: null,
          isCompleted: true,
          completedCount,
        },
      })
    );
  };

  const handleExecuteTransaction = (txn: ToolOutput) => {
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

    // Execute individual transaction
    if (txn?.transaction?.abi) {
      writeContract({
        abi: txn.transaction.abi,
        address: txn.transaction.address as Address,
        functionName: txn.transaction.functionName,
        args: txn.transaction.args || [],
      });
    } else {
      sendTransaction({
        to: txn.transaction!.to as Address,
        value: BigInt(txn.transaction!.value || "0"),
      });
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
  const simulateTransaction = async (txn: ToolOutput): Promise<{ success: boolean; error?: string }> => {
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

  const handleSimulateTransaction = async (txn: ToolOutput, txnIndex: number) => {
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
    <GradientBorder
      borderWidth={0}
      borderRadius="16px"
      gradientFrom="#7CABF9"
      gradientTo="#B37AE8"
      gradientDirection="to-r"
      className="flex items-center justify-center p-[1px]"
      innerClassName="p-3 flex flex-col gap-3 w-full bg-[#17161B] p-[20px] rounded-[16px]"
    >
      <div className="">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Transaction Queue ({orderedTxns.length})
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
                              handleExecuteTransaction(txn)
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
    </GradientBorder>
  );
};

export default TransactionCanvas;
