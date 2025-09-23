import React, { useState, useCallback } from "react";
import { ToolOutput } from "@/redux/chatData/reducer";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSendTransaction, useWriteContract } from "wagmi";
import TransactionForm from "./TransactionForm";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { updateTransactionStatus, reorderTransactions } from "@/redux/chatData/action";

interface FormValues {
  to: { value: string; type: string };
  address: { value: string; type: string };
  functionName: { value: string; type: string };
  value: { value: string; type: string };
  args: any[];
}

const TransactionCanvas = ({ txns, chatIndex }: { txns?: ToolOutput[] | undefined; chatIndex: number }) => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chatData.chats);
  const currentTxns = chats[chatIndex]?.response?.tool_outputs || [];
  
  const [orderedTxns, setOrderedTxns] = useState<ToolOutput[]>(txns || []);
  const [formValuesMap, setFormValuesMap] = useState<Record<string, FormValues>>({});
  const [executionState, setExecutionState] = useState<{
    isExecuting: boolean;
    currentIndex: number | null;
    completedCount: number;
    hasErrors: boolean;
    isCompleted: boolean;
  }>({
    isExecuting: false,
    currentIndex: null,
    completedCount: 0,
    hasErrors: false,
    isCompleted: false,
  });

  // Update orderedTxns when txns prop changes or when Redux store updates
  React.useEffect(() => {
    const latestTxns = currentTxns.length > 0 ? currentTxns : (txns || []);
    setOrderedTxns(latestTxns);
  }, [txns, currentTxns]);

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        console.log("Transaction success:", data);
        setExecutionState(prev => ({
          ...prev,
          completedCount: prev.completedCount + 1
        }));
      },
      onError: (error) => {
        console.error("Transaction failed:", error);
      },
      onSettled: (data, error) => {
        if (error) {
          console.error("Transaction settled with error:", error);
        } else {
          console.log("Transaction settled:", data);
        }
      }
    }
  });

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: (data) => {
        console.log("Send transaction success:", data);
        setExecutionState(prev => ({
          ...prev,
          completedCount: prev.completedCount + 1
        }));
      },
      onError: (error) => {
        console.error("Send transaction failed:", error);
      },
      onSettled: (data, error) => {
        if (error) {
          console.error("Send transaction settled with error:", error);
        } else {
          console.log("Send transaction settled:", data);
        }
      }
    }
  });
 
  const reorder = (list: ToolOutput[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      orderedTxns,
      result.source.index,
      result.destination.index
    );
    setOrderedTxns(items);
    
    // Update Redux store with reordered transactions
    dispatch(reorderTransactions({
      chatIndex,
      reorderedTxns: items
    }));
  };

  // Handle form value updates from individual TransactionForm components
  const handleFormValuesChange = useCallback((txnId: string, values: FormValues) => {
    setFormValuesMap(prev => ({
      ...prev,
      [txnId]: values
    }));
  }, []);

  // Execute all transactions sequentially
  const executeAllTransactions = async () => {
    if (orderedTxns.length === 0) return;

    setExecutionState({
      isExecuting: true,
      currentIndex: 0,
      completedCount: 0,
      hasErrors: false,
      isCompleted: false,
    });

    for (let i = 0; i < orderedTxns.length; i++) {
      const txn = orderedTxns[i];
      
      // Skip if transaction is already successful
      if (txn.status === StatusEnum.SUCCESS) {
        console.log(`Skipping transaction ${i} - already successful`);
        setExecutionState(prev => ({
          ...prev,
          completedCount: prev.completedCount + 1
        }));
        continue;
      }

      setExecutionState(prev => ({ ...prev, currentIndex: i }));

      const formValues = formValuesMap[i.toString()];

      if (!formValues) {
        console.error(`No form values found for transaction ${i}`);
        continue;
      }

      try {
        // Execute the transaction and wait for it to complete
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Transaction timeout"));
          }, 30000); // 30 second timeout

          if (txn.transaction?.abi) {
            writeContract({
              abi: txn.transaction!.abi!,
              address: formValues.address.value as Address,
              functionName: formValues.functionName.value,
              args: formValues.args,
            }, {
              onSuccess: (data) => {
                clearTimeout(timeout);
                console.log(`Transaction ${i} success:`, data);
                setExecutionState(prev => ({
                  ...prev,
                  completedCount: prev.completedCount + 1
                }));
                // Update status in Redux store
                dispatch(updateTransactionStatus({
                  chatIndex,
                  toolOutputIndex: i,
                  status: StatusEnum.SUCCESS,
                  txHash: data as string
                }));
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
                reject(error);
              }
            });
          } else {
            sendTransaction({
              to: formValues.to.value as Address,
              value: BigInt(formValues.value.value),
            }, {
              onSuccess: (data) => {
                clearTimeout(timeout);
                console.log(`Transaction ${i} success:`, data);
                setExecutionState(prev => ({
                  ...prev,
                  completedCount: prev.completedCount + 1
                }));
                // Update status in Redux store
                dispatch(updateTransactionStatus({
                  chatIndex,
                  toolOutputIndex: i,
                  status: StatusEnum.SUCCESS,
                  txHash: data as string
                }));
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
        setExecutionState(prev => ({
          ...prev,
          isExecuting: false,
          currentIndex: null,
          hasErrors: true,
        }));
        break; // Stop executing subsequent transactions
      }
    }

    setExecutionState(prev => ({
      ...prev,
      isExecuting: false,
      currentIndex: null,
      isCompleted: true,
    }));
  };
  return (
    <div className="w-full max-w-[1280px]">
      {/* Execute All Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Transaction Queue ({orderedTxns.length})
        </h2>
        <button
          onClick={executeAllTransactions}
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
                        onFormValuesChange={handleFormValuesChange}
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
