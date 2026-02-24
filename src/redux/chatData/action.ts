import { chatDataSlice } from "./reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import {
  fetchToolData,
  batchFetchToolData,
  fetchToolDataByRequestIds,
} from "@/services/llmApi";
import { StatusEnum } from "@/enum/status.enum";

import { IRootState } from "../store";
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
  addPendingAsyncData,
  updatePendingAsyncData,
  resolvePendingAsyncData,
  addUnfetchedAsyncData,
  removeUnfetchedAsyncData,
} = chatDataSlice.actions;

// ─── SSE event router ────────────────────────────────────────────────────────
// Dispatched from sseManager for every incoming SSE message.
// Expected event shapes (from /api/v1/llm/toolDataStream):
//
//  { type: "token",       text: "...",       requestId: "..." }
//  { type: "tool_result", result: {...},     toolCallId: "...", requestId: "..." }
//  { type: "tool_data",   executionId: "...", toolName: "...",
//                         dataType: "...",   status: "completed"|"pending"|"failed" }
//  { type: "end",         requestId: "..." }
// ─────────────────────────────────────────────────────────────────────────────

export const routeSSEEvent = createAsyncThunk<
  void,
  { event: string; payload: any; network?: string },
  { state: IRootState }
>(
  "chatData/routeSSEEvent",
  async ({ event, payload, network = "sei" }, { dispatch, getState }) => {
    switch (event) {
      case "token": {
        // Append streamed token text to the matching chat item (by requestId)
        const { text, requestId } = payload as {
          text: string;
          requestId: string;
        };
        const chats = getState().chatData.chats;
        const chatIndex = chats.findIndex((c) => c.id === requestId);
        if (chatIndex === -1) return;
        dispatch(
          updateResponse({ index: chatIndex, response: { chat: text } }),
        );
        break;
      }

      case "tool_result": {
        // The LLM issued a tool call and got back a (possibly async) result.
        // If the result is async / pending, register it as pending async data.
        const { result, requestId } = payload as {
          result: {
            kind?: string;
            executionId?: string;
            toolName?: string;
            text?: string;
            isError?: boolean;
            dataType?: string;
            dataStatus?: string;
            transactions?: any[];
            transactionStatus?: string;
          };
          requestId: string;
        };

        const chats = getState().chatData.chats;
        const chatIndex = chats.findIndex((c) => c.id === requestId);
        if (chatIndex === -1) return;

        if (result.kind === "async" && result.executionId) {
          dispatch(
            addPendingAsyncData({
              index: chatIndex,
              asyncData: {
                executionId: result.executionId,
                toolName: result.toolName ?? "unknown",
                dataType: result.dataType ?? "UNKNOWN",
                summary: result.text ?? "",
                status: "pending",
              },
            }),
          );
        } else if (result.kind === "transaction" && result.transactions) {
          const toolOutputs = result.transactions.map(
            (tx: any, idx: number) => {
              const rawStatus = tx.status || result.transactionStatus;
              const mappedStatus =
                rawStatus === "completed"
                  ? StatusEnum.SUCCESS
                  : rawStatus === "failed"
                    ? StatusEnum.ERROR
                    : rawStatus === "pending"
                      ? StatusEnum.PENDING
                      : StatusEnum.IDLE;

              return {
                id: idx + 1,
                label: tx.label || result.toolName || `Transaction #${idx + 1}`,
                transaction: {
                  to: tx.to,
                  data: tx.data,
                  value: tx.value,
                  chainId: tx.chainId,
                },
                metadata: tx.meta || {},
                metaData: tx.meta || {},
                executionId: result.executionId,
                type: result.toolName,
                status: mappedStatus,
                transactionIndex: idx,
              };
            },
          );

          dispatch(
            updateResponse({
              index: chatIndex,
              response: {
                tool_outputs: toolOutputs,
              },
            }),
          );
        }
        break;
      }

      case "tool_data": {
        // Tool execution on the server has finished (status: "completed").
        // Look up the chat that owns this executionId, then fetch the full data.
        const { executionId, dataType, status } = payload as {
          executionId: string;
          toolName: string;
          dataType: string;
          status: "pending" | "completed" | "failed";
        };

        if (status !== "completed") return;

        const chats = getState().chatData.chats;
        // Find the chat that has this executionId in its pending async data or tool_outputs
        const chatIndex = chats.findIndex((chat) => {
          const inPending = chat.response?.pending_async_data?.some(
            (d) => d.executionId === executionId,
          );
          const inToolOut = chat.response?.tool_outputs?.some(
            (t) => t.executionId === executionId,
          );
          return inPending || inToolOut;
        });

        if (chatIndex === -1) {
          // The tool_data event may arrive before tool_result registers the pending entry.
          // Schedule a single retry after a short delay.
          setTimeout(() => {
            const freshChats = getState().chatData.chats;
            const retryIndex = freshChats.findIndex((chat) => {
              const inPending = chat.response?.pending_async_data?.some(
                (d) => d.executionId === executionId,
              );
              const inToolOut = chat.response?.tool_outputs?.some(
                (t) => t.executionId === executionId,
              );
              return inPending || inToolOut;
            });

            // If still not found, fallback to the latest chat for streaming resiliency
            const finalIndex =
              retryIndex !== -1 ? retryIndex : freshChats.length - 1;
            if (finalIndex >= 0) {
              dispatch(
                fetchAsyncToolData({
                  chatIndex: finalIndex,
                  executionId,
                  dataType,
                  network,
                }),
              );
            }
          }, 500);
          return;
        }

        dispatch(
          fetchAsyncToolData({ chatIndex, executionId, dataType, network }),
        );
        break;
      }

      case "end": {
        // Stream finished – mark the chat as no longer loading.
        const { requestId } = payload as { requestId: string };
        const chats = getState().chatData.chats;
        const chatIndex = chats.findIndex((c) => c.id === requestId);
        if (chatIndex === -1) return;
        dispatch(setLoading({ index: chatIndex, loading: false }));
        break;
      }

      default:
        break;
    }
  },
);

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
    {
      prompt,
      messageType = MessageTypeEnum.HUMAN,
      abortSignal,
      network = "sei",
      address,
      token,
    },
    { dispatch, getState },
  ) => {
    if (!token) throw new Error("Missing auth token");

    const controller = new AbortController();
    abortSignal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });
    const requestId = crypto.randomUUID();

    // Add prompt to chat and show response (same for both human and system messages)
    dispatch(addPrompt({ prompt, requestId }));

    const chatIndex = getState().chatData.chats.length - 1;
    dispatch(setLoading({ index: chatIndex, loading: true }));
    const response = await fetch(
      `/api/v1/llm/chat?network=${network}&address=${address}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-network": network, // If handled by NetworkMiddleware
        },
        body: JSON.stringify({
          prompt,
          requestId,
          messageType,
          address, // Passed in body or query depending on your AddressMiddleware
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    // The 202 response just confirms the server received the prompt
    return await response.json();
  },
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
>(
  "chatData/sendChatPrompt",
  async ({ prompt, network = "sei" }, { dispatch, getState }) => {
    // Add prompt to chat list
    const sendRequestId = crypto.randomUUID();
    dispatch(addPrompt({ prompt, requestId: sendRequestId }));
    const index = getState().chatData.chats.length - 1;
    try {
      const response = await axiosInstance.post(
        `/llm/chat?network=${network}`,
        { prompt },
      );
      const apiData = response?.data;
      if (apiData?.status === 200 && apiData?.data) {
        const chat = apiData.data.chat || "";
        const tools = apiData.data.tools;
        let tool_outputs = [];
        if (tools) {
          for (let i = 0; i < tools.length; i++) {
            if (
              tools[i] != null &&
              (tools[i].tool_output != undefined ||
                tools[i].tool_output != null)
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
          }),
        );
      } else {
        dispatch(setError({ index }));
      }
    } catch (err) {
      dispatch(setError({ index }));
    }
  },
);

export const getChatHistory = createAsyncThunk<
  void,
  { network?: string; address: string },
  { state: IRootState }
>(
  "chatData/getChatHistory",
  async ({ network = "sei", address }, { dispatch, getState }) => {
    try {
      dispatch(setHistoryLoading(true));
      const response = await axiosInstance.get(
        `/llm/getChatHistory?network=${network}&address=${address}`,
      );
      const apiData = response?.data;
      if (apiData?.status === 200 && apiData?.data) {
        const data = apiData?.data?.items;
        if (data && data.length > 0) {
          // Clear existing chats first
          dispatch(resetChat());

          // Track requestIds from AIMessageChunk for fetching tool outputs
          const requestIdMap: Map<number, string[]> = new Map();

          let currentChatIndex = -1;
          for (let i = 0; i < data.length; i++) {
            const rawMessage = data[i];
            console.log("playstation", rawMessage);
            const formattedMessage = formatLLMResponse(rawMessage);
            if (!formattedMessage) continue;

            if (formattedMessage.type === LLMResponseEnum.HUMANMESSAGE) {
              dispatch(
                addPrompt({
                  prompt: formattedMessage.content,
                  requestId: rawMessage.requestId ?? crypto.randomUUID(),
                }),
              );
              currentChatIndex = getState().chatData.chats.length - 1;
              continue;
            }

            if (currentChatIndex < 0) continue;

            // Extract requestId from AIMessageChunk for fetching tool outputs
            if (
              rawMessage.type === LLMResponseEnum.AIMESSAGECHUNK &&
              rawMessage.requestId
            ) {
              if (!requestIdMap.has(currentChatIndex)) {
                requestIdMap.set(currentChatIndex, []);
              }
              requestIdMap.get(currentChatIndex)!.push(rawMessage.requestId);
            }

            const currentChat = getState().chatData.chats[currentChatIndex];
            const existingResponse = currentChat?.response || {
              chat: "",
              tool_outputs: [],
            };
            let updatedResponse = { ...existingResponse };

            // Handle Text Content
            const contentToAdd =
              typeof formattedMessage.content === "string"
                ? formattedMessage.content
                : "";
            if (contentToAdd) {
              updatedResponse.chat =
                (updatedResponse.chat || "") +
                (updatedResponse.chat ? " " : "") +
                contentToAdd;
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
              const dataOutput = formattedMessage.data_output;
              const dataType =
                dataOutput.type || (dataOutput.summary ? "DCA_SIMULATION" : "");
              const formatter = dataOutputFormatters[dataType];
              if (formatter) {
                const formattedData = formatter(dataOutput);
                if (formattedData) updatedResponse.data_output = formattedData;
              }
            }

            dispatch(
              setResponse({
                index: currentChatIndex,
                response: updatedResponse,
              }),
            );
          }

          // Collect unique requestIds from AIMessageChunk for fetching tool outputs
          const allRequestIds: Array<{ chatIndex: number; requestId: string }> =
            [];
          requestIdMap.forEach((requestIds, chatIndex) => {
            requestIds.forEach((requestId) => {
              allRequestIds.push({ chatIndex, requestId });
            });
          });

          console.log("Collected requestIds for batch fetch:", allRequestIds);

          // Fetch tool outputs using requestIds - take recent 20 immediately, defer older
          if (allRequestIds.length > 0) {
            const MAX_IMMEDIATE_FETCH = 20;

            // Sort by chatIndex descending (most recent first)
            allRequestIds.sort((a, b) => b.chatIndex - a.chatIndex);

            const recentItems = allRequestIds.slice(0, MAX_IMMEDIATE_FETCH);
            const olderItems = allRequestIds.slice(MAX_IMMEDIATE_FETCH);

            // Fetch recent items immediately
            if (recentItems.length > 0) {
              const requestIdsToFetch = [
                ...new Set(recentItems.map((item) => item.requestId)),
              ];
              try {
                const batchResponse = await fetchToolDataByRequestIds(
                  requestIdsToFetch,
                  network,
                );
                console.log("Batch response from byRequestIds:", batchResponse);

                if (batchResponse.success && batchResponse.results) {
                  // Process results - each requestId maps to an array of tool data items
                  Object.entries(batchResponse.results).forEach(
                    ([requestId, toolDataItems]: [string, any]) => {
                      // Find which chatIndex this requestId belongs to
                      const chatItem = recentItems.find(
                        (item) => item.requestId === requestId,
                      );
                      if (!chatItem) return;

                      // toolDataItems is an array of tool data
                      const itemsArray = Array.isArray(toolDataItems)
                        ? toolDataItems
                        : [toolDataItems];

                      itemsArray.forEach((toolData: any) => {
                        // Check dataType to determine how to handle
                        const dataType = toolData?.dataType || "ORDER_TX";

                        if (
                          (dataType === "ORDER_TX" ||
                            dataType === "TRANSACTION") &&
                          toolData?.payload?.transactions
                        ) {
                          // Map execution status from API to StatusEnum
                          const transactions =
                            toolData.payload.transactions.map(
                              (tx: any, idx: number) => {
                                const rawStatus =
                                  tx.status ||
                                  toolData.execution?.status ||
                                  toolData.status;
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
                                  id: idx + 1,
                                  label:
                                    tx.metadata?.order?.type ||
                                    tx.label ||
                                    `Order #${idx + 1}`,
                                  transaction: tx.transaction || {
                                    to: tx.to,
                                    data: tx.data,
                                    value: tx.value,
                                    chainId: tx.chainId,
                                  },
                                  metadata: tx.metadata || tx.meta || {},
                                  metaData: tx.metadata || tx.meta || {},
                                  executionId: toolData.executionId,
                                  type: "ORDER_TX",
                                  status: mappedStatus,
                                  transactionIndex: idx,
                                };
                              },
                            );

                          const state = getState();
                          const currentChat =
                            state.chatData.chats[chatItem.chatIndex];
                          if (currentChat && transactions.length > 0) {
                            const existingToolOutputs =
                              currentChat.response?.tool_outputs || [];
                            dispatch(
                              setResponse({
                                index: chatItem.chatIndex,
                                response: {
                                  ...currentChat.response,
                                  tool_outputs: [
                                    ...existingToolOutputs,
                                    ...transactions,
                                  ],
                                },
                              }),
                            );
                          }
                        } else if (toolData?.payload) {
                          // Other data types go to data_output
                          const formatter = dataOutputFormatters[dataType];
                          const formattedData = formatter
                            ? formatter(toolData.payload)
                            : toolData.payload;

                          const state = getState();
                          const currentChat =
                            state.chatData.chats[chatItem.chatIndex];
                          if (currentChat && formattedData) {
                            dispatch(
                              setResponse({
                                index: chatItem.chatIndex,
                                response: {
                                  ...currentChat.response,
                                  data_output: formattedData,
                                },
                              }),
                            );
                          }
                        }
                      });
                    },
                  );
                }
              } catch (batchErr) {
                console.error(
                  "Failed to batch fetch tool data by request IDs:",
                  batchErr,
                );
              }
            }

            // Store older items for lazy loading
            if (olderItems.length > 0) {
              const unfetchedItems = olderItems.map((item) => ({
                chatIndex: item.chatIndex,
                executionId: item.requestId, // Using requestId as the identifier
                dataType: "ORDER_TX",
                network,
              }));
              dispatch(addUnfetchedAsyncData(unfetchedItems));
            }
          }
        }
      }
    } catch (err) {
      console.log("err", err);
      dispatch(resetChat());
    } finally {
      dispatch(setHistoryLoading(false));
    }
  },
);

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

export const clearChat = createAsyncThunk<
  void,
  { network?: string; address: string },
  { state: IRootState }
>("chatData/clearChat", async ({ network = "sei", address }, { dispatch }) => {
  try {
    await axiosInstance.get(
      `/llm/clearChat?network=${network}&address=${address}`,
    );
    dispatch(resetChat());
  } catch (err) {
    console.error("Error clearing chat:", err);
    // Still reset the local state even if API fails
    dispatch(resetChat());
  }
});

export const updateMessageState = createAsyncThunk<
  void,
  {
    executionId: string;
    executionState: "completed" | "failed";
    txnHash?: string;
    network?: string;
    address: string;
    transactionIndex?: number;
  },
  { state: IRootState }
>(
  "chatData/updateMessageState",
  async ({
    executionId,
    executionState,
    txnHash,
    network = "sei",
    address,
    transactionIndex,
  }) => {
    try {
      const response = await axiosInstance.post(
        `/llm/updateTransactionStatus?network=${network}&address=${address}`,
        {
          executionId,
          status: executionState,
          ...(txnHash && { txnHash }),
          ...(transactionIndex !== undefined && { transactionIndex }),
        },
      );
      const apiData = response?.data;
      if (apiData?.success) {
        console.log(
          `Message state updated for execution ${executionId}: ${executionState}`,
        );
      } else {
        console.error(
          `Failed to update message state for execution ${executionId}`,
        );
      }
    } catch (err) {
      console.error(`Error updating message state for ${executionId}:`, err);
    }
  },
);

/**
 * Fetches async tool data by execution ID and resolves it in the chat state.
 * Used when tool_data SSE event has status: "completed" or when polling.
 */
export const fetchAsyncToolData = createAsyncThunk<
  void,
  {
    chatIndex: number;
    executionId: string;
    dataType: string;
    network?: string;
  },
  { state: IRootState }
>(
  "chatData/fetchAsyncToolData",
  async (
    { chatIndex, executionId, dataType, network = "sei" },
    { dispatch },
  ) => {
    try {
      const response = await fetchToolData(executionId, network);
      if (response.success && response.data) {
        // If the execution is still pending, don't resolve — let the polling continue
        const executionStatus = response.data.execution?.status;
        if (executionStatus === "pending") {
          return;
        }

        const formatter = dataOutputFormatters[dataType];
        const formattedData = formatter
          ? formatter(response.data.payload)
          : response.data.payload;

        dispatch(
          resolvePendingAsyncData({
            index: chatIndex,
            executionId,
            dataType,
            data: formattedData,
            executionStatus: executionStatus,
          }),
        );
      } else {
        dispatch(
          updatePendingAsyncData({
            index: chatIndex,
            executionId,
            status: "failed",
            error: response.error || "Failed to fetch data",
          }),
        );
      }
    } catch (err) {
      dispatch(
        updatePendingAsyncData({
          index: chatIndex,
          executionId,
          status: "failed",
          error: err instanceof Error ? err.message : "Failed to fetch data",
        }),
      );
    }
  },
);

const MAX_BATCH_SIZE = 20;

/**
 * Fetches pending async data for specified chat indices in batches.
 * Used for lazy loading when scrolling or clicking on pending data.
 */
export const fetchPendingBatchForChats = createAsyncThunk<
  void,
  { chatIndices: number[]; network?: string },
  { state: IRootState }
>(
  "chatData/fetchPendingBatchForChats",
  async ({ chatIndices, network = "sei" }, { dispatch, getState }) => {
    const state = getState();
    const unfetchedData = state.chatData.unfetchedAsyncData;

    // Filter to only items matching the requested chat indices
    const itemsToFetch = unfetchedData.filter((item) =>
      chatIndices.includes(item.chatIndex),
    );

    if (itemsToFetch.length === 0) return;

    // Remove from unfetched list before fetching (prevent duplicate fetches)
    const executionIdsToRemove = itemsToFetch.map((item) => item.executionId);
    dispatch(removeUnfetchedAsyncData(executionIdsToRemove));

    // Process in batches of MAX_BATCH_SIZE
    for (let i = 0; i < itemsToFetch.length; i += MAX_BATCH_SIZE) {
      const batch = itemsToFetch.slice(i, i + MAX_BATCH_SIZE);
      const executionIds = batch.map((item) => item.executionId);

      try {
        const batchResponse = await batchFetchToolData(executionIds, network);

        if (batchResponse.success && batchResponse.results) {
          batch.forEach((item) => {
            const result = batchResponse.results?.[item.executionId];
            if (result && result.status === "completed") {
              const formatter = dataOutputFormatters[item.dataType];
              const formattedData = formatter
                ? formatter(result.payload)
                : result.payload;

              dispatch(
                resolvePendingAsyncData({
                  index: item.chatIndex,
                  executionId: item.executionId,
                  data: formattedData,
                }),
              );
            } else if (result && result.status === "failed") {
              dispatch(
                updatePendingAsyncData({
                  index: item.chatIndex,
                  executionId: item.executionId,
                  status: "failed",
                  error: "Data fetch failed",
                }),
              );
            }
            // If still pending, we could re-add to unfetched or leave in pending_async_data
          });
        }
      } catch (batchErr) {
        console.error("Failed to batch fetch async tool data:", batchErr);
        // Mark all items in this batch as failed
        batch.forEach((item) => {
          dispatch(
            updatePendingAsyncData({
              index: item.chatIndex,
              executionId: item.executionId,
              status: "failed",
              error: "Batch fetch failed",
            }),
          );
        });
      }
    }
  },
);
