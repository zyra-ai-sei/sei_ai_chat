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
    abortSignal?: AbortSignal;
  },
  { state: IRootState }
>(
  "chatData/streamChatPrompt",
  async ({ prompt, abortSignal }, { dispatch, getState }) => {
    const state = getState();
    const token = state.globalData?.data?.token;

    if (!token) throw new Error("Missing auth token");

    dispatch(addPrompt(prompt));

    const chatIndex = getState().chatData.chats.length - 1;
    dispatch(setLoading({ index: chatIndex, loading: true }));

    const controller = new AbortController();
    abortSignal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });

    const params = new URLSearchParams({ prompt });

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
            console.log('ultimate',payload)
            if (payload.type === "token") {
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
              payload.tool_output.map((tool:any)=>{
                // Check if this is crypto market data
                if (tool.type === "crypto_market_data") {
                  console.log('[StreamChat] Received crypto market data:', {
                    coinId: tool.coinId,
                    timeframe: tool.timeframe,
                    dataPoints: tool.dataPoints
                  });

                  // Dispatch chart data to token visualization
                  if (tool.chartData && Array.isArray(tool.chartData)) {
                    // Map the CoinGecko API response to our frontend format
                    const marketData = tool.market_data || {};
                    const tickers = tool.tickers || [];
                    const topTicker = tickers[0] || {};

                    const tokenData = {
                      id: tool.coinId || tool.id,
                      symbol: tool.symbol || tool.coinId.toUpperCase(),
                      name: tool.name || (tool.coinId.charAt(0).toUpperCase() + tool.coinId.slice(1)),
                      image: {
                        thumb: tool.image?.thumb || `https://assets.coingecko.com/coins/images/1/thumb/${tool.coinId}.png`,
                        large: tool.image?.large || `https://assets.coingecko.com/coins/images/1/large/${tool.coinId}.png`,
                      },
                      categories: tool.categories || [],
                      market: {
                        price_usd: marketData.current_price?.usd || tool.chartData[tool.chartData.length - 1][1],
                        price_change_1h: marketData.price_change_percentage_1h_in_currency?.usd || 0,
                        price_change_24h: marketData.price_change_percentage_24h_in_currency?.usd || 0,
                        price_change_7d: marketData.price_change_percentage_7d_in_currency?.usd || 0,
                        price_change_30d: marketData.price_change_percentage_30d_in_currency?.usd || 0,
                        high_24h: marketData.high_24h?.usd || Math.max(...tool.chartData.map((d: any) => d[1])),
                        low_24h: marketData.low_24h?.usd || Math.min(...tool.chartData.map((d: any) => d[1])),
                        ath_usd: marketData.ath?.usd || Math.max(...tool.chartData.map((d: any) => d[1])),
                        ath_change_pct: marketData.ath_change_percentage?.usd || 0,
                        ath_date: marketData.ath_date?.usd || new Date().toISOString(),
                        market_cap: marketData.market_cap?.usd || tool.chartData[tool.chartData.length - 1][2],
                        market_cap_rank: marketData.market_cap_rank || 0,
                        volume_24h: marketData.total_volume?.usd || 0,
                        circulating_supply: marketData.circulating_supply || 0,
                        max_supply: marketData.max_supply || 0,
                        supply_pct_mined: marketData.max_supply > 0
                          ? marketData.circulating_supply / marketData.max_supply
                          : 0,
                      },
                      chart: {
                        prices: tool.chartData,
                      },
                      sentiment: {
                        positive_pct: tool.sentiment_votes_up_percentage || 50,
                        negative_pct: tool.sentiment_votes_down_percentage || 50,
                        watchlist_count: tool.watchlist_portfolio_users || 0,
                      },
                      liquidity: {
                        top_exchange: topTicker.market?.name || "N/A",
                        last_traded_price: topTicker.last || marketData.current_price?.usd || 0,
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
                } else {
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
              })
            } else if (payload.type === "token_data" && payload.token_data) {
              // Handle token visualization data from backend
              dispatch(setTokenVisualization(payload.token_data));
            }
          } catch (err) {
            console.error("Failed to parse SSE payload", err);
          }
        },
        onerror: (err) => {
          controller.abort();
          console.error("SSE error:", err);
          dispatch(setError({ index: chatIndex }));
        },
        onclose: () => {
          controller.abort();
        },
      });
    } finally {
      dispatch(setLoading({ index: chatIndex, loading: false }));
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
              updatedResponse.chat =
                (updatedResponse.chat || " ") + formattedMessage.content;

              // Check if any tool output is crypto market data
              formattedMessage.tool_output.forEach((tool: any) => {
                if (tool.type === "crypto_market_data" && tool.chartData) {
                  // Map the CoinGecko API response to our frontend format
                  const marketData = tool.market_data || {};
                  const tickers = tool.tickers || [];
                  const topTicker = tickers[0] || {};

                  const tokenData = {
                    id: tool.coinId || tool.id,
                    symbol: tool.symbol || tool.coinId.toUpperCase(),
                    name: tool.name || (tool.coinId.charAt(0).toUpperCase() + tool.coinId.slice(1)),
                    image: {
                      thumb: tool.image?.thumb || `https://assets.coingecko.com/coins/images/1/thumb/${tool.coinId}.png`,
                      large: tool.image?.large || `https://assets.coingecko.com/coins/images/1/large/${tool.coinId}.png`,
                    },
                    categories: tool.categories || [],
                    market: {
                      price_usd: marketData.current_price?.usd || tool.chartData[tool.chartData.length - 1][1],
                      price_change_1h: marketData.price_change_percentage_1h_in_currency?.usd || 0,
                      price_change_24h: marketData.price_change_percentage_24h_in_currency?.usd || 0,
                      price_change_7d: marketData.price_change_percentage_7d_in_currency?.usd || 0,
                      price_change_30d: marketData.price_change_percentage_30d_in_currency?.usd || 0,
                      high_24h: marketData.high_24h?.usd || Math.max(...tool.chartData.map((d: any) => d[1])),
                      low_24h: marketData.low_24h?.usd || Math.min(...tool.chartData.map((d: any) => d[1])),
                      ath_usd: marketData.ath?.usd || Math.max(...tool.chartData.map((d: any) => d[1])),
                      ath_change_pct: marketData.ath_change_percentage?.usd || 0,
                      ath_date: marketData.ath_date?.usd || new Date().toISOString(),
                      market_cap: marketData.market_cap?.usd || tool.chartData[tool.chartData.length - 1][2],
                      market_cap_rank: marketData.market_cap_rank || 0,
                      volume_24h: marketData.total_volume?.usd || 0,
                      circulating_supply: marketData.circulating_supply || 0,
                      max_supply: marketData.max_supply || 0,
                      supply_pct_mined: marketData.max_supply > 0
                        ? marketData.circulating_supply / marketData.max_supply
                        : 0,
                    },
                    chart: {
                      prices: tool.chartData,
                    },
                    sentiment: {
                      positive_pct: tool.sentiment_votes_up_percentage || 50,
                      negative_pct: tool.sentiment_votes_down_percentage || 50,
                      watchlist_count: tool.watchlist_portfolio_users || 0,
                    },
                    liquidity: {
                      top_exchange: topTicker.market?.name || "N/A",
                      last_traded_price: topTicker.last || marketData.current_price?.usd || 0,
                      volume_on_top_exchange: topTicker.volume || 0,
                      spread_pct: topTicker.bid_ask_spread_percentage || 0,
                      trust_score: topTicker.trust_score || "white",
                    },
                  };
                  updatedResponse.data_output = tokenData;
                  // Also dispatch to token visualization store when loading from history
                  dispatch(setTokenVisualization(tokenData));
                }
              });

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
            const currentChat = getState().chatData.chats[currentChatIndex];
            const existingResponse = currentChat?.response || {
              chat: "",
              tool_outputs: [],
            };
            let updatedResponse = { ...existingResponse };
            updatedResponse.chat =
               formattedMessage.content;

            dispatch(
              setResponse({
                index: currentChatIndex,
                response: updatedResponse,
              })
            );
          }
          // if (message["type"] === "HumanMessage") {
          //   // Create a new chat item for each human message
          //   dispatch(addPrompt(message["content"]));
          //   currentChatIndex = getState().chatData.chats.length - 1;
          //   console.log("created new chat item at index", currentChatIndex);
          // } else if (
          //   message["type"] === "ToolMessage" ||
          //   message["type"] === "AIMessage" ||
          //   message["type"] === "AIMessageChunk"
          // ) {
          //   // Add to the current chat item's response
          //   if (currentChatIndex >= 0) {
          //     const currentChat = getState().chatData.chats[currentChatIndex];
          //     const existingResponse = currentChat?.response || {
          //       chat: "",
          //       tool_outputs: [],
          //     };

          //     let updatedResponse = { ...existingResponse };

          //     if (message["type"] === "AIMessage" || "AIMessageChunk") {
          //       // Append AI message content
          //       updatedResponse.chat =
          //         (updatedResponse.chat || "") + (message["content"] || "");
          //     } else if (
          //       message["type"] === "ToolMessage" &&
          //       message["tool_output"]
          //     ) {
          //       // Add tool_output to the array
          //       const existingToolOutputs = updatedResponse.tool_outputs || [];
          //       updatedResponse.tool_outputs = [
          //         ...existingToolOutputs,
          //         message["tool_output"],
          //       ];
          //       updatedResponse.chat =
          //         (updatedResponse.chat || " ") + message["content"];
          //     }

          //     console.log(
          //       "updating chat item",
          //       currentChatIndex,
          //       "with",
          //       message["type"],
          //       "response:",
          //       updatedResponse
          //     );

          //     dispatch(
          //       setResponse({
          //         index: currentChatIndex,
          //         response: updatedResponse,
          //       })
          //     );
          //   }
          // }
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
