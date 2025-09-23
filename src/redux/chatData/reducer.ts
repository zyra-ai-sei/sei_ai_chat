import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusEnum } from "@/enum/status.enum";

export interface ToolOutput {
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
        state.chats[action.payload.index].loading = false;
      }
    },
    updateResponse(
      state,
      action: PayloadAction<{ index: number; response: ChatResponse }>
    ) {
      if (state.chats[action.payload.index]) {
        state.chats[action.payload.index].response.chat +=
          action.payload.response.chat;
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
        state.chats[chatIndex].response.tool_outputs[toolOutputIndex].status = status;
        if (txHash) {
          state.chats[chatIndex].response.tool_outputs[toolOutputIndex].txHash = txHash;
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
} = chatDataSlice.actions;
export default chatDataSlice.reducer;
export { chatDataSlice };
