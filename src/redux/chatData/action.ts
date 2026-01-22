import { chatDataSlice } from "./reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";

import { IRootState } from "../store";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { formatLLMResponse } from "@/utility/formatLLMResponse";
import { dataOutputFormatters } from "@/utility/chatDataFormatters";
import { LLMResponseEnum } from "@/enum/llm.enum";
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
  setHistoryLoading,
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
    network?: string;
    address: string;
    token: string;
  },
  { state: IRootState }
>(
  "chatData/streamChatPrompt",
  async (
    { prompt, messageType = MessageTypeEnum.HUMAN, abortSignal, network = "sei", address, token },
    { dispatch, getState }
  ) => {
    if (!token) throw new Error("Missing auth token");


    const controller = new AbortController();
    abortSignal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });
    const params = new URLSearchParams({ prompt, messageType, network, address });

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
        openWhenHidden: true, // Prevent stream restart on tab switch
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
              payload.tool_output.map((tool: any) => {
                // Check if this is crypto market data
                if (tool) {
                  // Regular tool output (transactions, etc.)
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
                }
              });
            } else if (payload.type === "data" && payload.data_output) {
              const data = payload.data_output;
              const dataType = data.type || (data.summary ? "DCA_SIMULATION" : "");
              
              const formatter = dataOutputFormatters[dataType];
              if (formatter) {
                const formattedData = formatter(data);
                if (formattedData) {
                  hasReceivedResponse = true;
                  dispatch(
                    updateResponse({
                      index: chatIndex,
                      response: { data_output: formattedData },
                    })
                  );
                }
              }
            }
          } catch (err) {
            console.error("Failed to parse SSE payload", err);
          }
        },
        onerror: (err: any) => {
          // Ignore AbortError - this is expected when stream closes normally
          if (err?.name === "AbortError" || controller.signal.aborted) {
            return;
          }
          // Only track real errors, not abort errors
          console.error("SSE error:", err);
          streamError = err instanceof Error ? err : new Error(String(err));
          // controller.abort();
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
        if (errorName !== "AbortError") {
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
  { prompt: string; network?: string },
  { state: IRootState }
>("chatData/sendChatPrompt", async ({ prompt, network = "sei" }, { dispatch, getState }) => {
  // Add prompt to chat list
  dispatch(addPrompt(prompt));
  const index = getState().chatData.chats.length - 1;
  try {
    const response = await axiosInstance.post(`/llm/chat?network=${network}`, { prompt });
    const apiData = response?.data;
    if (apiData?.status === 200 && apiData?.data) {
      const chat = apiData.data.chat || "";
      const tools = apiData.data.tools;
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
  { network?: string, address:string },
  { state: IRootState }
>("chatData/getChatHistory", async ({ network = "sei", address }, { dispatch, getState }) => {
  try {
    dispatch(setHistoryLoading(true));
    const response = await axiosInstance.get(`/llm/getChatHistory?network=${network}&address=${address}`);
    const apiData = response?.data;
    if (apiData?.status === 200 && apiData?.data) {
      const data = apiData?.data?.items;
      if (data && data.length > 0) {
        // Clear existing chats first
        dispatch(resetChat());

        let currentChatIndex = -1;
        for (let i = 0; i < data.length; i++) {
          const formattedMessage = formatLLMResponse(data[i]);
          if (!formattedMessage) continue;

          if (formattedMessage.type === LLMResponseEnum.HUMANMESSAGE) {
            dispatch(addPrompt(formattedMessage.content));
            currentChatIndex = getState().chatData.chats.length - 1;
            continue;
          }

          if (currentChatIndex < 0) continue;

          const currentChat = getState().chatData.chats[currentChatIndex];
          const existingResponse = currentChat?.response || { chat: "", tool_outputs: [] };
          let updatedResponse = { ...existingResponse };

          // Handle Text Content
          const contentToAdd = typeof formattedMessage.content === "string" ? formattedMessage.content : "";
          if (contentToAdd) {
            updatedResponse.chat = (updatedResponse.chat || "") + (updatedResponse.chat ? " " : "") + contentToAdd;
          }

          // Handle Tool Outputs
          if (formattedMessage.tool_output) {
            updatedResponse.tool_outputs = [
              ...(updatedResponse.tool_outputs || []),
              ...formattedMessage.tool_output,
            ];
          }

          // Handle Data Outputs
          if (formattedMessage.data_output) {
            const data = formattedMessage.data_output;
            const dataType = data.type || (data.summary ? "DCA_SIMULATION" : "");
            const formatter = dataOutputFormatters[dataType];
            if (formatter) {
              const formattedData = formatter(data);
              if (formattedData) updatedResponse.data_output = formattedData;
            }
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
  } catch (err) {
    console.log("err", err);
    dispatch(resetChat());
  } finally {
    dispatch(setHistoryLoading(false));
  }
});


export const abortTool = createAsyncThunk<
  void,
  { toolId: string; network?: string },
  { state: IRootState }
>("chatData/abortTool", async ({ toolId, network = "sei" }) => {
  try {
    const response = await axiosInstance.post("/llm/abortTool", {
      toolId,
      network,
    });
    const apiData = response?.data;
    if (apiData?.success) {
    } else {
      console.error(`Failed to mark tool ${toolId} as aborted`);
    }
  } catch (err) {
    console.error(`Error aborting tool ${toolId}:`, err);
  }
});

export const clearChat = createAsyncThunk<void, { network?: string, address:string }, { state: IRootState }>(
  "chatData/clearChat",
  async ({ network = "sei", address }, { dispatch }) => {
    try {
      await axiosInstance.get(`/llm/clearChat?network=${network}&address=${address}`);
      dispatch(resetChat());
    } catch (err) {
      console.error("Error clearing chat:", err);
      // Still reset the local state even if API fails
      dispatch(resetChat());
    }
  }
);

export const updateMessageState = createAsyncThunk<
  void,
  {
    executionId: string;
    executionState: "completed" | "failed";
    txnHash?: string;
    network?: string;
    address: string;
  },
  { state: IRootState }
>(
  "chatData/updateMessageState",
  async ({ executionId, executionState, txnHash, network = "sei", address }) => {
    try {
      const response = await axiosInstance.post(`/llm/updateMessageState?network=${network}&address=${address}`, {
        executionId,
        executionState,
        ...(txnHash && { txnHash }),
      });
      const apiData = response?.data;
      if (apiData?.success) {
        console.log(
          `Message state updated for execution ${executionId}: ${executionState}`
        );
      } else {
        console.error(
          `Failed to update message state for execution ${executionId}`
        );
      }
    } catch (err) {
      console.error(`Error updating message state for ${executionId}:`, err);
    }
  }
);
