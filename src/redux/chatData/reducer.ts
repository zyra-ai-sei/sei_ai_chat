import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ToolOutput {
  address?: string;
  abi?: any[];
  functionName?: string;
  args?: any[];
  value?: string;
  to?: string;
  [key: string]: any;
}

interface ChatResponse {
  chat: string;
  tool_outputs?: ToolOutput[];
}

export interface ChatItem {
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
  sessionId:null,
};


const chatDataSlice = createSlice({
  name: "chatData",
  initialState,
  reducers: {
    addSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    addPrompt(state, action: PayloadAction<string>) {
      state.chats.push({ prompt: action.payload, response: { chat: "" }, loading: true });
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
        state.chats[action.payload.index].response.chat += action.payload.response.chat;
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
  },
});

export const { addPrompt, setResponse, setError, resetChat, addSessionId, eraseLatestToolOutput,setLoading } = chatDataSlice.actions;
export default chatDataSlice.reducer;
export { chatDataSlice };
