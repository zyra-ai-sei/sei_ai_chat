import React, { useState } from "react";
import { ToolOutput, updateExecutionState } from "@/redux/chatData/reducer";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSendTransaction, useWriteContract } from "wagmi";
import TransactionForm from "./TransactionForm";
import ExecuteAllButton from "./ExecuteAllButton";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { updateTransactionStatus, reorderTransactions, completeTool, abortTool } from "@/redux/chatData/action";
import { addTxn } from "@/redux/transactionData/action";

const TransactionCanvas = ({ txns, chatIndex }: { txns?: ToolOutput[] | undefined; chatIndex: number }) => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chatData.chats);
  const executionState = chats[chatIndex]?.response?.execution_state || {
    isExecuting: false,
    currentIndex: null,
    completedCount: 0,
    hasErrors: false,
    isCompleted: false,
  };
  const [orderedTxns, setOrderedTxns] = useState<ToolOutput[]>(txns || []);

  // Update orderedTxns when txns prop changes or when Redux store updates
  React.useEffect(() => {
    const latestTxns = chats[chatIndex]?.response?.tool_outputs || (txns || []);
    setOrderedTxns(latestTxns);
  }, [txns, chats[chatIndex]?.response?.tool_outputs, chatIndex]);

  // Auto-update execution state based on tool_outputs status
  React.useEffect(() => {
    const toolOutputs = chats[chatIndex]?.response?.tool_outputs;
    if (toolOutputs && toolOutputs.length > 0) {
      const hasErrors = toolOutputs.some(txn => txn.status === StatusEnum.ERROR);
      const hasPending = toolOutputs.some(txn => txn.status === StatusEnum.PENDING);
      const successCount = toolOutputs.filter(txn => txn.status === StatusEnum.SUCCESS).length;
      const allCompleted = toolOutputs.every(txn =>
        txn.status === StatusEnum.SUCCESS || txn.status === StatusEnum.ERROR
      );

      // Only update if all transactions are completed and we're not currently executing
      if (allCompleted && !hasPending && !executionState.isExecuting) {
        dispatch(updateExecutionState({
          index: chatIndex,
          response: {
            hasErrors,
            isCompleted: !hasErrors,
            completedCount: successCount,
          }
        }));
      }
    }
  }, [chats[chatIndex]?.response?.tool_outputs, chatIndex, dispatch, executionState.isExecuting]);

  const { writeContract } = useWriteContract();

  const { sendTransaction } = useSendTransaction();
 
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedTxns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedTxns(items);
    dispatch(reorderTransactions({
      chatIndex,
      reorderedTxns: items
    }));
  };

  // Execute all transactions sequentially
  const executeAllTransactions = async () => {
        const currentTxns = chats[chatIndex]?.response?.tool_outputs || [];
        console.log('this is important', currentTxns)
    if (currentTxns.length === 0) return;

    dispatch(updateExecutionState({
      index: chatIndex,
      response: {
        isExecuting: true,
        currentIndex: 0,
        completedCount: 0,
        hasErrors: false,
        isCompleted: false,
      }
    }));

    // Use local counter instead of reading from closure
    let completedCount = 0;

    for (let i = 0; i < currentTxns.length; i++) {
      const txn = currentTxns[i];
      
      // Skip if transaction is already successful
      if (txn.status === StatusEnum.SUCCESS) {
        console.log(`Skipping transaction ${i} - already successful`);
        completedCount++;
        dispatch(updateExecutionState({
          index: chatIndex,
          response: { completedCount }
        }));
        continue;
      }

      // Mark as pending before execution
      dispatch(updateTransactionStatus({
        chatIndex,
        toolOutputIndex: i,
        status: StatusEnum.PENDING
      }));

      dispatch(updateExecutionState({
        index: chatIndex,
        response: { currentIndex: i }
      }));

      try {
        // Execute the transaction and wait for it to complete
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Transaction timeout"));
          }, 30000); // 30 second timeout

          if (txn.transaction?.abi) {
            writeContract({
              abi: txn.transaction!.abi!,
              address: txn.transaction!.address as Address,
              functionName: txn.transaction!.functionName,
              args: txn.transaction!.args || [],
            }, {
              onSuccess: (data) => {
                clearTimeout(timeout);
                console.log(`Transaction ${i} success:`, data);
                completedCount++;
                dispatch(updateExecutionState({
                  index: chatIndex,
                  response: { completedCount }
                }));
                // Update status in Redux store
                dispatch(updateTransactionStatus({
                  chatIndex,
                  toolOutputIndex: i,
                  status: StatusEnum.SUCCESS,
                  txHash: data as string
                }));
                // Add transaction to transaction store
                dispatch(addTxn(data as string));
                // Mark tool as completed
                if (txn.id) {
                  dispatch(completeTool({ 
                    toolId: txn.id.toString(), 
                    hash: data as string 
                  }));
                }
                resolve();
              },
              onError: (error) => {
                clearTimeout(timeout);
                console.error(`Transaction ${i} failed:`, error);
                // Update status in Redux store
                dispatch(updateTransactionStatus({
                  chatIndex,
                  toolOutputIndex: i,
                  status: StatusEnum.ERROR
                }));
                // Mark tool as aborted
                if (txn.id) {
                  dispatch(abortTool({ toolId: txn.id.toString() }));
                }
                reject(error);
              }
            });
          } else {
            sendTransaction({
              to: txn.transaction!.to as Address,
              value: BigInt(txn.transaction!.value || "0"),
            }, {
              onSuccess: (data) => {
                clearTimeout(timeout);
                console.log(`Transaction ${i} success:`, data);
                completedCount++;
                dispatch(updateExecutionState({
                  index: chatIndex,
                  response: { completedCount }
                }));
                // Update status in Redux store
                dispatch(updateTransactionStatus({
                  chatIndex,
                  toolOutputIndex: i,
                  status: StatusEnum.SUCCESS,
                  txHash: data as string
                }));
                // Add transaction to transaction store
                dispatch(addTxn(data as string));
                // Mark tool as completed
                if (txn.id) {
                  dispatch(completeTool({ 
                    toolId: txn.id.toString(), 
                    hash: data as string 
                  }));
                }
                resolve();
              },
              onError: (error) => {
                clearTimeout(timeout);
                console.error(`Transaction ${i} failed:`, error);
                // Update status in Redux store
                dispatch(updateTransactionStatus({
                  chatIndex,
                  toolOutputIndex: i,
                  status: StatusEnum.ERROR
                }));
                // Mark tool as aborted
                if (txn.id) {
                  dispatch(abortTool({ toolId: txn.id.toString() }));
                }
                reject(error);
              }
            });
          }
        });

        // Wait a bit between transactions to ensure proper sequencing
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Failed to execute transaction ${i}:`, error);
        // Mark transaction as failed and stop execution
        dispatch(updateExecutionState({
          index: chatIndex,
          response: {
            isExecuting: false,
            currentIndex: null,
            hasErrors: true,
            completedCount,
          }
        }));
        return; // Stop executing subsequent transactions
      }
    }

    dispatch(updateExecutionState({
      index: chatIndex,
      response: {
        isExecuting: false,
        currentIndex: null,
        isCompleted: true,
        completedCount,
      }
    }));
  };
  return (
    <div className="w-full max-w-[1280px]">
      {/* Execute All Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Transaction Queue ({orderedTxns.length})
        </h2>
        <ExecuteAllButton
          executionState={executionState}
          orderedTxns={orderedTxns}
          onExecuteAll={executeAllTransactions}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-1" type="PERSON">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-3 p-3"
            >
              {orderedTxns.map((txn, index) => (
                <Draggable key={`draggable-${index}`} draggableId={`draggable-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-2 text-white border rounded-lg border-white/10 transition-colors ${
                        txn.status === StatusEnum.ERROR
                          ? "border-red-500 bg-red-500/10"
                          : executionState.isExecuting && executionState.currentIndex === index
                          ? "border-purple-500 bg-purple-500/10"
                          : txn.status === StatusEnum.SUCCESS || executionState.completedCount > index
                          ? "border-green-500 bg-green-500/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-400">#{index + 1}</span>
                        {txn.status === StatusEnum.SUCCESS && (
                          <span className="text-sm text-green-400">✓ Completed</span>
                        )}
                        {txn.status === StatusEnum.ERROR && (
                          <span className="text-sm text-red-400">✗ Failed</span>
                        )}
                        {executionState.isExecuting && executionState.currentIndex === index && (
                          <span className="text-sm text-purple-400">⟳ Executing...</span>
                        )}
                      </div>
                      <TransactionForm
                        txn={txn}
                        txnIndex={index}
                        chatIndex={chatIndex}
                        isExecuting={executionState.isExecuting && executionState.currentIndex === index}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TransactionCanvas;
