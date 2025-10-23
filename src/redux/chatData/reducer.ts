import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusEnum } from "@/enum/status.enum";

export interface ExecutionState {
  isExecuting: boolean;
  currentIndex: number | null;
  completedCount: number;
  hasErrors: boolean;
  isCompleted: boolean;
}

export interface ToolOutput {
  id:number;
  metadata: any;
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
}

export interface ChatItem {
  id: string;
  prompt: string;
  response: ChatResponse;
  loading?: boolean;
}

export interface ChatDataState {
  chats: ChatItem[];
  sessionId: string | null;
}

const initialState: ChatDataState = {
  chats: [],
  sessionId: null,
};

const chatDataSlice = createSlice({
  name: "chatData",
  initialState,
  reducers: {
    addSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    addPrompt(state, action: PayloadAction<string>) {
      state.chats.push({
        id: Date.now().toLocaleString(),
        prompt: action.payload,
        response: { chat: "" },
        loading: true,
      });
    },
    setResponse(
      state,
      action: PayloadAction<{ index: number; response: ChatResponse }>
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
      }
    },
    updateExecutionState(state,
      action: PayloadAction<{index: number; response: Partial<ExecutionState>}>
    ){
      if(state.chats[action.payload.index] && state.chats[action.payload.index].response.execution_state){
        const currentState = state.chats[action.payload.index].response.execution_state
        state.chats[action.payload.index].response.execution_state = {
          isExecuting: action.payload.response?.isExecuting ?? currentState?.isExecuting ?? false,
          currentIndex: action.payload.response?.currentIndex ?? currentState?.currentIndex ?? null,
          completedCount: action.payload.response?.completedCount ?? currentState?.completedCount ?? 0,
          hasErrors: action.payload.response?.hasErrors ?? currentState?.hasErrors ?? false,
          isCompleted: action.payload.response?.isCompleted ?? currentState?.isCompleted ?? false,
        }
      }
    },
    updateResponse(
      state,
      action: PayloadAction<{
        index: number;
        response: Partial<ChatResponse>;
      }>
    ) {
      const chatItem = state.chats[action.payload.index];
      if (!chatItem) return;

      const targetResponse = chatItem.response;

      if (typeof action.payload.response.chat === "string") {
        targetResponse.chat = `${targetResponse.chat || ""}${action.payload.response.chat}`;
      }

      if (action.payload.response.tool_outputs?.length) {
        const existingToolOutputs = targetResponse.tool_outputs || [];
        targetResponse.tool_outputs = [
          ...existingToolOutputs,
          ...action.payload.response.tool_outputs,
        ];
        
        // Initialize execution_state if it doesn't exist
        if (!targetResponse.execution_state) {
          targetResponse.execution_state = {
            isExecuting: false,
            currentIndex: null,
            completedCount: 0,
            hasErrors: false,
            isCompleted: false,
          };
        }
      }
    },
    setLoading(
      state,
      action: PayloadAction<{ index: number; loading: boolean }>
    ) {
      if (state.chats[action.payload.index]) {
        state.chats[action.payload.index].loading = action.payload.loading;
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
      }>
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
      }>
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
      }>
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
  updateExecutionState
} = chatDataSlice.actions;
export default chatDataSlice.reducer;
export { chatDataSlice };
