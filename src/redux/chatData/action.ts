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
    network?: string;
  },
  { state: IRootState }
>(
  "chatData/streamChatPrompt",
  async (
    { prompt, messageType = MessageTypeEnum.HUMAN, abortSignal, network = "sei" },
    { dispatch, getState }
  ) => {
    const state = getState();
    const token = state.globalData?.data?.token;

    if (!token) throw new Error("Missing auth token");

    console.log('chain chain chain',network)

    const controller = new AbortController();
    abortSignal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });
    console.log("prompt:::", prompt);
    const params = new URLSearchParams({ prompt, messageType, network });

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
              console.log("data output payload", data);
              // Check if this is DCA simulation data
              if (data.type === "DCA_Simulation" || data.summary) {
                console.log("[StreamChat] Received DCA simulation data:", {
                  total_investment: data.summary.total_investment,
                  buy_count: data.summary.buy_count,
                  return_pct: data.summary.return_pct,
                });

                hasReceivedResponse = true;

                // Store DCA data directly in chat response as data_output
                dispatch(
                  updateResponse({
                    index: chatIndex,
                    response: { data_output: data },
                  })
                );
              } else if (data.type === "crypto_market_data") {
                console.log("[StreamChat] Received crypto market data:", {
                  coinId: data.coinId,
                  timeframe: data.timeframe,
                  dataPoints: data.dataPoints,
                });

                // Dispatch chart data to token visualization
                if (data.chartData && Array.isArray(data.chartData)) {
                  // Map the CoinGecko API response to our frontend format
                  const marketData = data.market_data || {};
                  const tickers = data.tickers || [];
                  const topTicker = tickers[0] || {};

                  const tokenData = {
                    id: data.coinId || data.id,
                    symbol: data.symbol || data.coinId.toUpperCase(),
                    name:
                      data.name ||
                      data.coinId.charAt(0).toUpperCase() +
                        data.coinId.slice(1),
                    image: {
                      thumb:
                        data.image?.thumb ||
                        `https://assets.coingecko.com/coins/images/1/thumb/${data.coinId}.png`,
                      large:
                        data.image?.large ||
                        `https://assets.coingecko.com/coins/images/1/large/${data.coinId}.png`,
                    },
                    categories: data.categories || [],
                    market: {
                      price_usd:
                        marketData.current_price?.usd ||
                        data.chartData[data.chartData.length - 1][1],
                      price_change_1h:
                        marketData.price_change_percentage_1h_in_currency
                          ?.usd || 0,
                      price_change_24h:
                        marketData.price_change_percentage_24h_in_currency
                          ?.usd || 0,
                      price_change_7d:
                        marketData.price_change_percentage_7d_in_currency
                          ?.usd || 0,
                      price_change_30d:
                        marketData.price_change_percentage_30d_in_currency
                          ?.usd || 0,
                      high_24h:
                        marketData.high_24h?.usd ||
                        Math.max(...data.chartData.map((d: any) => d[1])),
                      low_24h:
                        marketData.low_24h?.usd ||
                        Math.min(...data.chartData.map((d: any) => d[1])),
                      ath_usd:
                        marketData.ath?.usd ||
                        Math.max(...data.chartData.map((d: any) => d[1])),
                      ath_change_pct:
                        marketData.ath_change_percentage?.usd || 0,
                      ath_date:
                        marketData.ath_date?.usd || new Date().toISOString(),
                      market_cap:
                        marketData.market_cap?.usd ||
                        data.chartData[data.chartData.length - 1][2],
                      market_cap_rank: marketData.market_cap_rank || 0,
                      volume_24h: marketData.total_volume?.usd || 0,
                      circulating_supply: marketData.circulating_supply || 0,
                      max_supply: marketData.max_supply || 0,
                      supply_pct_mined:
                        marketData.max_supply > 0
                          ? marketData.circulating_supply /
                            marketData.max_supply
                          : 0,
                    },
                    chart: {
                      prices: data.chartData,
                    },
                    sentiment: {
                      positive_pct: data.sentiment_votes_up_percentage || 50,
                      negative_pct: data.sentiment_votes_down_percentage || 50,
                      watchlist_count: data.watchlist_portfolio_users || 0,
                    },
                    liquidity: {
                      top_exchange: topTicker.market?.name || "N/A",
                      last_traded_price:
                        topTicker.last || marketData.current_price?.usd || 0,
                      volume_on_top_exchange: topTicker.volume || 0,
                      spread_pct: topTicker.bid_ask_spread_percentage || 0,
                      trust_score: topTicker.trust_score || "white",
                    },
                  };

                  // Store in token visualization
                  dispatch(setTokenVisualization(tokenData));

                  // Also store in chat response as data_output
                  dispatch(
                    updateResponse({
                      index: chatIndex,
                      response: { data_output: tokenData },
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
  { network?: string },
  { state: IRootState }
>("chatData/getChatHistory", async ({ network = "sei" } = {}, { dispatch, getState }) => {
  try {
    const response = await axiosInstance.get(`/llm/getChatHistory?network=${network}`);
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
          } 
          else if (formattedMessage?.type == LLMResponseEnum.TOOLMESSAGE && formattedMessage.tool_output) {
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
              const contentToAdd =
                typeof formattedMessage.content === "string"
                  ? formattedMessage.content
                  : "";
              const existingChat =
                typeof updatedResponse.chat === "string"
                  ? updatedResponse.chat
                  : "";
              updatedResponse.chat =
                existingChat + (contentToAdd ? " " + contentToAdd : "");
              

              dispatch(
                setResponse({
                  index: currentChatIndex,
                  response: updatedResponse,
                })
              );
            }
          }
           else if (formattedMessage?.type == LLMResponseEnum.TOOLMESSAGE && formattedMessage.data_output) {
            if (currentChatIndex >= 0) {
              const currentChat = getState().chatData.chats[currentChatIndex];
              const existingResponse = currentChat?.response || {
                chat: "",
                tool_outputs: [],
              };
              let updatedResponse = { ...existingResponse };
          
              // Only append content if it's a non-empty string
              const contentToAdd =
                typeof formattedMessage.content === "string"
                  ? formattedMessage.content
                  : "";
              const existingChat =
                typeof updatedResponse.chat === "string"
                  ? updatedResponse.chat
                  : "";
              updatedResponse.chat =
                existingChat + (contentToAdd ? " " + contentToAdd : "");

              // Check if this is DCA simulation data
              if (formattedMessage.data_output.type === "DCA_Simulation") {
                console.log("[getChatHistory] Received DCA simulation data:", {
                  total_investment: formattedMessage.data_output.summary?.total_investment,
                  buy_count: formattedMessage.data_output.summary?.buy_count,
                  return_pct: formattedMessage.data_output.summary?.return_pct,
                });

                // Store DCA data directly
                updatedResponse.data_output = formattedMessage.data_output;
              }
              // Check if this is Lump Sum simulation data
              else if (formattedMessage.data_output.type === "lump_sum_strategy") {
                console.log("[getChatHistory] Received Lump Sum simulation data:", {
                  total_investment: formattedMessage.data_output.summary?.total_investment,
                  buy_price: formattedMessage.data_output.summary?.buy_price,
                  tokens_bought: formattedMessage.data_output.summary?.tokens_bought,
                  return_pct: formattedMessage.data_output.summary?.return_pct,
                });

                // Store Lump Sum data directly
                updatedResponse.data_output = formattedMessage.data_output;
              }
              // Check if any tool output is crypto market data
              else if (formattedMessage.data_output.type === "crypto_market_data" && formattedMessage.data_output.chartData) {
                  // Map the CoinGecko API response to our frontend format
                  const marketData = formattedMessage.data_output.market_data || {};
                  const tickers = formattedMessage.data_output.tickers || [];
                  const topTicker = tickers[0] || {};

                  const tokenData = {
                    id: formattedMessage.data_output.coinId || formattedMessage.data_output.id,
                    symbol: formattedMessage.data_output.symbol || formattedMessage.data_output.coinId.toUpperCase(),
                    name:
                      formattedMessage.data_output.name ||
                      formattedMessage.data_output.coinId.charAt(0).toUpperCase() +
                        formattedMessage.data_output.coinId.slice(1),
                    image: {
                      thumb:
                        formattedMessage.data_output.image?.thumb ||
                        `https://assets.coingecko.com/coins/images/1/thumb/${formattedMessage.data_output.coinId}.png`,
                      large:
                        formattedMessage.data_output.image?.large ||
                        `https://assets.coingecko.com/coins/images/1/large/${formattedMessage.data_output.coinId}.png`,
                    },
                    categories: formattedMessage.data_output.categories || [],
                    market: {
                      price_usd:
                        marketData.current_price?.usd ||
                        formattedMessage.data_output.chartData[formattedMessage.data_output.chartData.length - 1][1],
                      price_change_1h:
                        marketData.price_change_percentage_1h_in_currency
                          ?.usd || 0,
                      price_change_24h:
                        marketData.price_change_percentage_24h_in_currency
                          ?.usd || 0,
                      price_change_7d:
                        marketData.price_change_percentage_7d_in_currency
                          ?.usd || 0,
                      price_change_30d:
                        marketData.price_change_percentage_30d_in_currency
                          ?.usd || 0,
                      high_24h:
                        marketData.high_24h?.usd ||
                        Math.max(...formattedMessage.data_output.chartData.map((d: any) => d[1])),
                      low_24h:
                        marketData.low_24h?.usd ||
                        Math.min(...formattedMessage.data_output.chartData.map((d: any) => d[1])),
                      ath_usd:
                        marketData.ath?.usd ||
                        Math.max(...formattedMessage.data_output.chartData.map((d: any) => d[1])),
                      ath_change_pct:
                        marketData.ath_change_percentage?.usd || 0,
                      ath_date:
                        marketData.ath_date?.usd || new Date().toISOString(),
                      market_cap:
                        marketData.market_cap?.usd ||
                        formattedMessage.data_output.chartData[formattedMessage.data_output.chartData.length - 1][2],
                      market_cap_rank: marketData.market_cap_rank || 0,
                      volume_24h: marketData.total_volume?.usd || 0,
                      circulating_supply: marketData.circulating_supply || 0,
                      max_supply: marketData.max_supply || 0,
                      supply_pct_mined:
                        marketData.max_supply > 0
                          ? marketData.circulating_supply /
                            marketData.max_supply
                          : 0,
                    },
                    chart: {
                      prices: formattedMessage.data_output.chartData,
                    },
                    sentiment: {
                      positive_pct: formattedMessage.data_output.sentiment_votes_up_percentage || 50,
                      negative_pct: formattedMessage.data_output.sentiment_votes_down_percentage || 50,
                      watchlist_count: formattedMessage.data_output.watchlist_portfolio_users || 0,
                    },
                    liquidity: {
                      top_exchange: topTicker.market?.name || "N/A",
                      last_traded_price:
                        topTicker.last || marketData.current_price?.usd || 0,
                      volume_on_top_exchange: topTicker.volume || 0,
                      spread_pct: topTicker.bid_ask_spread_percentage || 0,
                      trust_score: topTicker.trust_score || "white",
                    },
                  };
                  updatedResponse.data_output = tokenData;
                  // Also dispatch to token visualization store when loading from history
                  dispatch(setTokenVisualization(tokenData));
                }
              

              dispatch(
                setResponse({
                  index: currentChatIndex,
                  response: updatedResponse,
                })
              );
            }
          }
          else if (
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
              const existingChat =
                typeof updatedResponse.chat === "string"
                  ? updatedResponse.chat
                  : "";
              const contentToAdd =
                typeof formattedMessage.content === "string"
                  ? formattedMessage.content
                  : "";

              // Add space between messages if both exist
              if (existingChat && contentToAdd) {
                updatedResponse.chat = existingChat + " " + contentToAdd;
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
    dispatch(resetChat());
  }
});

export const initializePrompt = createAsyncThunk<
  void,
  { network?: string },
  { state: IRootState }
>("chatData/initializePrompt", async ({ network = "sei" } = {}, { dispatch }) => {
  try {
    const response = await axiosInstance.post(`/llm/init?network=${network}`,);
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
      console.log(`Tool ${toolId} marked as aborted`);
    } else {
      console.error(`Failed to mark tool ${toolId} as aborted`);
    }
  } catch (err) {
    console.error(`Error aborting tool ${toolId}:`, err);
  }
});

export const clearChat = createAsyncThunk<void, { network?: string }, { state: IRootState }>(
  "chatData/clearChat",
  async ({ network = "sei" } = {}, { dispatch }) => {
    try {
      await axiosInstance.get(`/llm/clearChat?network=${network}`);
      dispatch(resetChat());
      dispatch(initializePrompt({ network }));
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
  },
  { state: IRootState }
>(
  "chatData/updateMessageState",
  async ({ executionId, executionState, txnHash, network = "sei" }) => {
    try {
      const response = await axiosInstance.post(`/llm/updateMessageState?network=${network}`, {
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
