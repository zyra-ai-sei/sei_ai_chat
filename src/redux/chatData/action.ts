import { chatDataSlice } from "./reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";

import { IRootState } from "../store";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { formatLLMResponse } from "@/utility/formatLLMResponse";
import { LLMResponseEnum } from "@/enum/llm.enum";
import { setTokenVisualization } from "../tokenVisualization/action";
import { MessageTypeEnum } from "@/enum/messageType.enum";
// Use the native AbortController instead of the package
// import {AbortController} from 'abort-controller'

export const {
  addPrompt,
  setResponse,
  setError,
  resetChat,
  addSessionId,
  eraseLatestToolOutput,
  setLoading,
  updateResponse,
  updateTransactionStatus,
  reorderTransactions,
  updateTransactionData,
} = chatDataSlice.actions;

export const streamChatPrompt = createAsyncThunk<
  void,
  {
    prompt: string;
    messageType?: MessageTypeEnum;
    abortSignal?: AbortSignal;
  },
  { state: IRootState }
>(
  "chatData/streamChatPrompt",
  async ({ prompt, messageType = MessageTypeEnum.HUMAN, abortSignal }, { dispatch, getState }) => {
    const state = getState();
    const token = state.globalData?.data?.token;

    if (!token) throw new Error("Missing auth token");

    const controller = new AbortController();
    abortSignal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });
    console.log('prompt:::',prompt)
    const params = new URLSearchParams({ prompt, messageType });

    // Add prompt to chat and show response (same for both human and system messages)
    dispatch(addPrompt(prompt));

    const chatIndex = getState().chatData.chats.length - 1;
    dispatch(setLoading({ index: chatIndex, loading: true }));

    // Track if we received any successful response
    let hasReceivedResponse = false;
    let streamError: Error | DOMException | null = null;

    try {
      await fetchEventSource(`/api/v1/llm/stream?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        signal: controller.signal,
        onmessage: (event: EventSourceMessage) => {
          if (!event.data) return;
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === "token") {
              hasReceivedResponse = true;
              dispatch(
                updateResponse({
                  index: chatIndex,
                  response: { chat: payload.text ?? "" },
                })
              );
            } else if (
              payload.type === "tool" &&
              payload.tool_output != undefined
            ) {
              hasReceivedResponse = true;
              payload.tool_output.map((tool:any)=>{

                const sanitizedToolOutput = JSON.parse(
                  JSON.stringify(tool, (_, value) =>
                    typeof value === "bigint" ? value.toString() : value
                  )
                );
                dispatch(
                  updateResponse({
                    index: chatIndex,
                    response: { tool_outputs: [sanitizedToolOutput] },
                  })
                );
              })
            } else if (payload.type === "token_data" && payload.token_data) {
              // Handle token visualization data from backend
              dispatch(setTokenVisualization(payload.token_data));
            }
          } catch (err) {
            console.error("Failed to parse SSE payload", err);
          }
        },
        onerror: (err: any) => {
          // Ignore AbortError - this is expected when stream closes normally
          if (err?.name === 'AbortError' || controller.signal.aborted) {
            return;
          }
          // Only track real errors, not abort errors
          console.error("SSE error:", err);
          streamError = err instanceof Error ? err : new Error(String(err));
          controller.abort();
        },
        onclose: () => {
          // Normal close - this is expected behavior, not an error
        },
      });
    } finally {
      dispatch(setLoading({ index: chatIndex, loading: false }));
      
      // Only dispatch error if:
      // 1. There was an actual stream error (not AbortError)
      // 2. We never received any successful response
      if (streamError && !hasReceivedResponse) {
        const errorName = (streamError as any)?.name;
        if (errorName !== 'AbortError') {
          dispatch(setError({ index: chatIndex }));
        }
      }
      
      if (!controller.signal.aborted) {
        controller.abort();
      }
    }
  }
);

// Thunk to erase tool_output of the latest chat session
export const eraseLatestToolOutputThunk = createAsyncThunk<
  void,
  void,
  { state: IRootState }
>("chatData/eraseLatestToolOutput", async (_, { dispatch }) => {
  dispatch(eraseLatestToolOutput());
});

// Thunk to send prompt and handle response
export const sendChatPrompt = createAsyncThunk<
  void,
  { prompt: string },
  { state: IRootState }
>("chatData/sendChatPrompt", async ({ prompt }, { dispatch, getState }) => {
  // Add prompt to chat list
  dispatch(addPrompt(prompt));
  const index = getState().chatData.chats.length - 1;
  try {
    const response = await axiosInstance.post("/llm/chat", { prompt });
    const apiData = response?.data;
    if (apiData?.status === 200 && apiData?.data) {
      const chat = apiData.data.chat || "";
      const tools = apiData.data.tools;
      console.log("these are the tools", tools);
      let tool_outputs = [];
      if (tools) {
        for (let i = 0; i < tools.length; i++) {
          if (
            tools[i] != null &&
            (tools[i].tool_output != undefined || tools[i].tool_output != null)
          )
            tool_outputs.push(tools[i].tool_output);
        }
      }
      console.log("tool output sendchat", tool_outputs);

      dispatch(
        setResponse({
          index,
          response: {
            chat,
            ...(tool_outputs ? { tool_outputs } : {}),
          },
        })
      );
    } else {
      dispatch(setError({ index }));
    }
  } catch (err) {
    dispatch(setError({ index }));
  }
});

export const getChatHistory = createAsyncThunk<
  void,
  void,
  { state: IRootState }
>("chatData/getChatHistory", async (_, { dispatch, getState }) => {
  try {
    const response = await axiosInstance.get("/llm/getChatHistory");
    const apiData = response?.data;
    if (apiData?.status === 200 && apiData?.data) {
      const data = apiData?.data?.items;
      console.log("chatHistory", data);
      if (data && data.length > 0) {
        // Clear existing chats first
        dispatch(resetChat());

        let currentChatIndex = -1;
        for (let i = 0; i < data.length; i++) {
          const message = data[i];
          console.log(JSON.stringify(message, null, 2));
          console.log(
            "processing message",
            message["type"],
            message["content"]
          );
          const formattedMessage = formatLLMResponse(message);
          if (formattedMessage?.type == LLMResponseEnum.HUMANMESSAGE) {
            dispatch(addPrompt(formattedMessage.content));
            currentChatIndex = getState().chatData.chats.length - 1;
          } else if (formattedMessage?.type == LLMResponseEnum.TOOLMESSAGE) {
            if (currentChatIndex >= 0) {
              const currentChat = getState().chatData.chats[currentChatIndex];
              const existingResponse = currentChat?.response || {
                chat: "",
                tool_outputs: [],
              };
              let updatedResponse = { ...existingResponse };

              const existingToolOutputs = updatedResponse.tool_outputs || [];
              updatedResponse.tool_outputs = [
                ...existingToolOutputs,
                ...formattedMessage.tool_output,
              ];
              
              // Only append content if it's a non-empty string
              const contentToAdd = typeof formattedMessage.content === 'string' ? formattedMessage.content : '';
              const existingChat = typeof updatedResponse.chat === 'string' ? updatedResponse.chat : '';
              updatedResponse.chat = existingChat + (contentToAdd ? ' ' + contentToAdd : '');

              dispatch(
                setResponse({
                  index: currentChatIndex,
                  response: updatedResponse,
                })
              );
            }
          } else if (
            formattedMessage?.type == LLMResponseEnum.AIMESSAGE ||
            formattedMessage?.type == LLMResponseEnum.AIMESSAGECHUNK
          ) {
            if (currentChatIndex >= 0) {
              const currentChat = getState().chatData.chats[currentChatIndex];
              const existingResponse = currentChat?.response || {
                chat: "",
                tool_outputs: [],
              };
              let updatedResponse = { ...existingResponse };
              
              // Ensure we're working with strings and add a space between consecutive AI messages
              const existingChat = typeof updatedResponse.chat === 'string' ? updatedResponse.chat : '';
              const contentToAdd = typeof formattedMessage.content === 'string' ? formattedMessage.content : '';
              
              // Add space between messages if both exist
              if (existingChat && contentToAdd) {
                updatedResponse.chat = existingChat + ' ' + contentToAdd;
              } else {
                updatedResponse.chat = existingChat + contentToAdd;
              }

              dispatch(
                setResponse({
                  index: currentChatIndex,
                  response: updatedResponse,
                })
              );
            }
          }
        }
      }
    }
  } catch (err) {
    console.log("err", err);
    dispatch(resetChat())
  }
});

export const initializePrompt = createAsyncThunk<
  void,
  void,
  { state: IRootState }
>("chatData/initializePrompt", async (_, { dispatch }) => {
  try {
    const response = await axiosInstance.post("/llm/init");
    const apiData = response?.data;
    if (apiData?.status === 200 && apiData?.data) {
      const sessionId = apiData.data.sessionId;
      dispatch(addSessionId(sessionId));
    } else {
      dispatch(resetChat());
    }
  } catch (err) {
    dispatch(resetChat());
  }
});

export const completeTool = createAsyncThunk<
  void,
  { toolId: string; hash: string },
  { state: IRootState }
>("chatData/completeTool", async ({ toolId, hash }) => {
  try {
    const response = await axiosInstance.post("/llm/completeTool", {
      toolId,
      hash,
    });
    const apiData = response?.data;
    if (apiData?.success) {
      console.log(`Tool ${toolId} marked as completed`);
    } else {
      console.error(`Failed to mark tool ${toolId} as completed`);
    }
  } catch (err) {
    console.error(`Error completing tool ${toolId}:`, err);
  }
});

export const abortTool = createAsyncThunk<
  void,
  { toolId: string },
  { state: IRootState }
>("chatData/abortTool", async ({ toolId }) => {
  try {
    const response = await axiosInstance.post("/llm/abortTool", {
      toolId,
    });
    const apiData = response?.data;
    if (apiData?.success) {
      console.log(`Tool ${toolId} marked as aborted`);
    } else {
      console.error(`Failed to mark tool ${toolId} as aborted`);
    }
  } catch (err) {
    console.error(`Error aborting tool ${toolId}:`, err);
  }
});

export const clearChat = createAsyncThunk<
  void,
  void,
  { state: IRootState }
>("chatData/clearChat", async (_, { dispatch }) => {
  try {
    await axiosInstance.get("/llm/clearChat");
    dispatch(resetChat());
    dispatch(initializePrompt());
  } catch (err) {
    console.error("Error clearing chat:", err);
    // Still reset the local state even if API fails
    dispatch(resetChat());
  }
});

export const updateMessageState = createAsyncThunk<
  void,
  { executionId: string; executionState: "completed" | "failed"; txnHash?: string },
  { state: IRootState }
>("chatData/updateMessageState", async ({ executionId, executionState, txnHash }) => {
  try {
    const response = await axiosInstance.post("/llm/updateMessageState", {
      executionId,
      executionState,
      ...(txnHash && { txnHash }),
    });
    const apiData = response?.data;
    if (apiData?.success) {
      console.log(`Message state updated for execution ${executionId}: ${executionState}`);
    } else {
      console.error(`Failed to update message state for execution ${executionId}`);
    }
  } catch (err) {
    console.error(`Error updating message state for ${executionId}:`, err);
  }
});
