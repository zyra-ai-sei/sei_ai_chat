import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TransactionCard from "./TransactionCard";
import { ToolOutput } from "@/redux/chatData/reducer";

interface TransactionListProps {
  orderedTxns: ToolOutput[];
  executionState: any;
  simulationState: any;
  onDragEnd: (result: any) => void;
  expandedTxns: Set<number>;
  toggleExpanded: (index: number) => void;
  chatIndex: number;
  onExecuteTransaction: (txn: ToolOutput, index: number) => void;
  onSimulateTransaction: (txn: ToolOutput, index: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  orderedTxns,
  executionState,
  simulationState,
  onDragEnd,
  expandedTxns,
  toggleExpanded,
  chatIndex,
  onExecuteTransaction,
  onSimulateTransaction,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-1" type="PERSON">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2"
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
                          onExecuteTransaction(txn, index)
                        }
                        onSimulateTransaction={() =>
                          onSimulateTransaction(txn, index)
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
  );
};

export default TransactionList;
