import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusEnum } from "@/enum/status.enum";
import { PendingAsyncData } from "@/types/asyncToolData.types";
import { AsyncToolResponse } from "@/types/toolResponses.types";

export interface ExecutionState {
  isExecuting: boolean;
  currentIndex: number | null;
  completedCount: number;
  hasErrors: boolean;
  isCompleted: boolean;
}

export interface ToolOutput {
  id: number;
  label?: string;
  metadata?: any;
  metaData?: any;
  type?: string;
  executionId?: string;
  transactionIndex?: number;
  transaction: {
    address?: string;
    abi?: any[];
    functionName?: string;
    args?: any[];
    value?: string;
    to?: string;
    [key: string]: any;
  };
  status?: StatusEnum;
  txHash?: string;
}

interface ChatResponse {
  chat: string;
  tool_outputs?: ToolOutput[];
  execution_state?: ExecutionState;
  data_output?: any; // For crypto market data and other visualization data
  async_data?: AsyncToolResponse[]; // For async tool data that is still loading
  pending_async_data?: PendingAsyncData[]; // Async tool results awaiting completion
}

export interface ChatItem {
  id: string; // id == requestId
  prompt: string;
  response: ChatResponse;
  loading?: boolean;
  toolOutputsLoading?: boolean;
}

export interface UnfetchedAsyncDataItem {
  chatIndex: number;
  executionId: string;
  dataType: string;
  network?: string;
}

export interface ChatDataState {
  chats: ChatItem[];
  sessionId: string | null;
  historyLoading: boolean;
  unfetchedAsyncData: UnfetchedAsyncDataItem[];
}

const initialState: ChatDataState = {
  chats: [],
  sessionId: null,
  historyLoading: true,
  unfetchedAsyncData: [],
};

const chatDataSlice = createSlice({
  name: "chatData",
  initialState,
  reducers: {
    addSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    setHistoryLoading(state, action: PayloadAction<boolean>) {
      state.historyLoading = action.payload;
    },
    addPrompt(
      state,
      action: PayloadAction<{ prompt: string; requestId: string }>,
    ) {
      state.chats.push({
        id: action.payload.requestId,
        prompt: action.payload.prompt,
        response: { chat: "" },
        loading: true,
        toolOutputsLoading: true,
      });
    },
    setResponse(
      state,
      action: PayloadAction<{ index: number; response: ChatResponse }>,
    ) {
      if (state.chats[action.payload.index]) {
        state.chats[action.payload.index].response = action.payload.response;
        if (
          action.payload.response?.tool_outputs &&
          action.payload.response?.tool_outputs.length > 0
        ) {
          state.chats[action.payload.index].response.execution_state = {
            isExecuting: false,
            currentIndex: null,
            completedCount: 0,
            hasErrors: false,
            isCompleted: false,
          };
        }
        state.chats[action.payload.index].loading = false;
        state.chats[action.payload.index].toolOutputsLoading = false;
      }
    },
    updateExecutionState(
      state,
      action: PayloadAction<{
        index: number;
        response: Partial<ExecutionState>;
      }>,
    ) {
      if (
        state.chats[action.payload.index] &&
        state.chats[action.payload.index].response.execution_state
      ) {
        const currentState =
          state.chats[action.payload.index].response.execution_state;
        state.chats[action.payload.index].response.execution_state = {
          isExecuting:
            action.payload.response?.isExecuting ??
            currentState?.isExecuting ??
            false,
          currentIndex:
            action.payload.response?.currentIndex ??
            currentState?.currentIndex ??
            null,
          completedCount:
            action.payload.response?.completedCount ??
            currentState?.completedCount ??
            0,
          hasErrors:
            action.payload.response?.hasErrors ??
            currentState?.hasErrors ??
            false,
          isCompleted:
            action.payload.response?.isCompleted ??
            currentState?.isCompleted ??
            false,
        };
      }
    },
    updateResponse(
      state,
      action: PayloadAction<{
        index: number;
        response: Partial<ChatResponse>;
      }>,
    ) {
      const chatItem = state.chats[action.payload.index];
      if (!chatItem) return;

      if (typeof action.payload.response.chat === "string") {
        chatItem.response.chat =
          (chatItem.response.chat || "") + action.payload.response.chat;
      }

      if (action.payload.response.tool_outputs?.length) {
        const existingToolOutputs = chatItem.response.tool_outputs || [];
        chatItem.response.tool_outputs = [
          ...existingToolOutputs,
          ...action.payload.response.tool_outputs,
        ];

        // Turn off toolOutputsLoading when first tool_output arrives
        chatItem.toolOutputsLoading = false;

        // Initialize execution_state if it doesn't exist
        if (!chatItem.response.execution_state) {
          chatItem.response.execution_state = {
            isExecuting: false,
            currentIndex: null,
            completedCount: 0,
            hasErrors: false,
            isCompleted: false,
          };
        }
      }

      // Handle data_output for crypto market data and other visualizations
      if (action.payload.response.data_output !== undefined) {
        chatItem.response.data_output = action.payload.response.data_output;
      }

      // Handle pending_async_data
      if (action.payload.response.pending_async_data?.length) {
        const existingPendingData = chatItem.response.pending_async_data || [];
        chatItem.response.pending_async_data = [
          ...existingPendingData,
          ...action.payload.response.pending_async_data,
        ];
      }
    },
    setLoading(
      state,
      action: PayloadAction<{ index: number; loading: boolean }>,
    ) {
      if (state.chats[action.payload.index]) {
        state.chats[action.payload.index].loading = action.payload.loading;
        // Also turn off toolOutputsLoading when stream completes
        if (!action.payload.loading) {
          state.chats[action.payload.index].toolOutputsLoading = false;
        }
      }
    },
    setError(state, action: PayloadAction<{ index: number }>) {
      if (state.chats[action.payload.index]) {
        state.chats[action.payload.index].response = { chat: "oops error" };
        state.chats[action.payload.index].loading = false;
      }
    },
    resetChat(state) {
      state.chats = [];
    },
    eraseLatestToolOutput(state) {
      if (state.chats.length > 0) {
        state.chats[state.chats.length - 1].response.tool_outputs = [];
      }
    },
    updateTransactionStatus(
      state,
      action: PayloadAction<{
        chatIndex: number;
        toolOutputIndex: number;
        status: StatusEnum;
        txHash?: string;
      }>,
    ) {
      const { chatIndex, toolOutputIndex, status, txHash } = action.payload;
      if (
        state.chats[chatIndex] &&
        state.chats[chatIndex].response.tool_outputs &&
        state.chats[chatIndex].response.tool_outputs[toolOutputIndex]
      ) {
        state.chats[chatIndex].response.tool_outputs[toolOutputIndex].status =
          status;
        if (txHash) {
          state.chats[chatIndex].response.tool_outputs[toolOutputIndex].txHash =
            txHash;
        }
      }
    },
    reorderTransactions(
      state,
      action: PayloadAction<{
        chatIndex: number;
        reorderedTxns: ToolOutput[];
      }>,
    ) {
      const { chatIndex, reorderedTxns } = action.payload;
      if (state.chats[chatIndex]) {
        state.chats[chatIndex].response.tool_outputs = reorderedTxns;
      }
    },
    updateTransactionData(
      state,
      action: PayloadAction<{
        chatIndex: number;
        toolOutputIndex: number;
        field: string;
        value: any;
      }>,
    ) {
      const { chatIndex, toolOutputIndex, field, value } = action.payload;
      if (
        state.chats[chatIndex] &&
        state.chats[chatIndex]?.response?.tool_outputs &&
        state.chats[chatIndex]?.response?.tool_outputs[toolOutputIndex]
      ) {
        const transaction =
          state.chats[chatIndex].response.tool_outputs[toolOutputIndex]
            .transaction;
        if (transaction) {
          transaction[field] = value;
        }
      }
    },
    addPendingAsyncData(
      state,
      action: PayloadAction<{
        index: number;
        asyncData: PendingAsyncData;
      }>,
    ) {
      const chatItem = state.chats[action.payload.index];
      if (!chatItem) return;

      if (!chatItem.response.pending_async_data) {
        chatItem.response.pending_async_data = [];
      }

      // Check if this execution ID already exists
      const existingIndex = chatItem.response.pending_async_data.findIndex(
        (d) => d.executionId === action.payload.asyncData.executionId,
      );

      if (existingIndex === -1) {
        chatItem.response.pending_async_data.push(action.payload.asyncData);
      }
    },
    updatePendingAsyncData(
      state,
      action: PayloadAction<{
        index: number;
        executionId: string;
        status: "pending" | "completed" | "failed";
        error?: string;
      }>,
    ) {
      const chatItem = state.chats[action.payload.index];
      if (!chatItem?.response?.pending_async_data) return;

      const asyncData = chatItem.response.pending_async_data.find(
        (d) => d.executionId === action.payload.executionId,
      );

      if (asyncData) {
        asyncData.status = action.payload.status;
        if (action.payload.error) {
          asyncData.error = action.payload.error;
        }
      }
    },
    resolvePendingAsyncData(
      state,
      action: PayloadAction<{
        index: number;
        executionId: string;
        data: any;
        executionStatus?: string;
        dataType?: string;
      }>,
    ) {
      const chatItem = state.chats[action.payload.index];
      if (!chatItem) return;

      // Remove from pending list
      if (chatItem.response.pending_async_data) {
        chatItem.response.pending_async_data =
          chatItem.response.pending_async_data.filter(
            (d) => d.executionId !== action.payload.executionId,
          );
      }

      // Handle ORDER_TX or TRANSACTION: Add transactions to tool_outputs for TransactionCanvas
      if (
        (action.payload.dataType === "ORDER_TX" ||
          action.payload.dataType === "TRANSACTION" ||
          action.payload.data?.type === "ORDER_TX" ||
          action.payload.data?.type === "TRANSACTION" ||
          Array.isArray(action.payload.data?.transactions)) &&
        action.payload.data?.transactions
      ) {
        let existingToolOutputs = chatItem.response.tool_outputs || [];
        // Prevent duplicates from streaming tool_data resolving over tool_result payloads
        existingToolOutputs = existingToolOutputs.filter(
          (t) => t.executionId !== action.payload.executionId,
        );
        // Override per-transaction executionId with the parent executionId
        // The parent executionId is the one recognized by the backend DB
        // Map execution status from API to StatusEnum
        const transactionsWithCorrectId = action.payload.data.transactions.map(
          (txn: any, idx: number) => {
            const rawStatus = txn.status || action.payload.executionStatus;
            let mappedStatus: StatusEnum | undefined;
            if (rawStatus) {
              switch (rawStatus.toLowerCase()) {
                case "completed":
                  mappedStatus = StatusEnum.SUCCESS;
                  break;
                case "failed":
                  mappedStatus = StatusEnum.ERROR;
                  break;
                case "pending":
                  mappedStatus = StatusEnum.PENDING;
                  break;
                case "unsigned":
                  mappedStatus = StatusEnum.IDLE;
                  break;
              }
            }
            return {
              ...txn,
              executionId: action.payload.executionId,
              transactionIndex: idx,
              ...(mappedStatus && { status: mappedStatus }),
            };
          },
        );
        chatItem.response.tool_outputs = [
          ...existingToolOutputs,
          ...transactionsWithCorrectId,
        ];

        // Initialize execution_state if it doesn't exist
        if (!chatItem.response.execution_state) {
          chatItem.response.execution_state = {
            isExecuting: false,
            currentIndex: null,
            completedCount: 0,
            hasErrors: false,
            isCompleted: false,
          };
        }
      } else {
        // Other data types (TWEETS, CRYPTO_MARKET_DATA, etc.) go to data_output
        chatItem.response.data_output = action.payload.data;
      }
    },
    /**
     * Add unfetched async data items (for lazy loading from history)
     */
    addUnfetchedAsyncData(
      state,
      action: PayloadAction<UnfetchedAsyncDataItem[]>,
    ) {
      state.unfetchedAsyncData = [
        ...state.unfetchedAsyncData,
        ...action.payload,
      ];
    },
    /**
     * Remove unfetched async data items (when fetch starts or completes)
     */
    removeUnfetchedAsyncData(
      state,
      action: PayloadAction<string[]>, // Array of executionIds to remove
    ) {
      state.unfetchedAsyncData = state.unfetchedAsyncData.filter(
        (item) => !action.payload.includes(item.executionId),
      );
    },
  },
});

export const {
  addPrompt,
  setResponse,
  setError,
  resetChat,
  addSessionId,
  eraseLatestToolOutput,
  setLoading,
  updateTransactionStatus,
  reorderTransactions,
  updateTransactionData,
  updateExecutionState,
  setHistoryLoading,
  addPendingAsyncData,
  updatePendingAsyncData,
  resolvePendingAsyncData,
  addUnfetchedAsyncData,
  removeUnfetchedAsyncData,
} = chatDataSlice.actions;
export default chatDataSlice.reducer;
export { chatDataSlice };
