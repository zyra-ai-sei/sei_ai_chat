import { chatDataSlice } from "./reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import { IRootState } from "../store";
import { getTransactions } from "../transactionData/action";

export const {
  addPrompt,
  setResponse,
  setError,
  resetChat,
  addSessionId,
  eraseLatestToolOutput,
  updateResponse,
  updateTransactionStatus,
  reorderTransactions,
  updateTransactionData,
} = chatDataSlice.actions;
// Thunk to call chat API with txdata as prompt and append response to latest chat
export const appendTxChatResponseToLatestChat = createAsyncThunk<
  void,
  { txdata: string },
  { state: IRootState }
>(
  "chatData/appendTxChatResponseToLatestChat",
  async ({ txdata }, { dispatch, getState }) => {
    const state = getState();
    const index = state.chatData.chats.length - 1;
    if (index < 0) return;
    try {

      // check if tx is successful
      
      const response = await axiosInstance.post("/llm/addtxn", {
        prompt: txdata,
      });
      const apiData = response?.data;
      if (apiData?.status === 200 && apiData?.data) {
        const chat = apiData.data.chat || "";
        const tools = apiData.data.tools;
        console.log("these are the tools", tools);
        let tool_outputs = [];
        if (tools) {
          for (let i = 0; i < tools.length; i++) {   
            if (tools[i]!=null && (tools[i].tool_output != undefined || tools[i].tool_output != null))
              tool_outputs.push(tools[i].tool_output);
          }
        }
        console.log("tool output", tool_outputs)
        dispatch(
          setResponse({
            index,
            response: {
              chat,
              ...(tool_outputs ? { tool_outputs } : {}),
            },
          })
        );
        dispatch(getTransactions());
      } else {
        // Optionally, you can append an error message
        dispatch(
          updateResponse({
            index,
            response: { chat: "\nOops, error after transaction." },
          })
        );
      }
    } catch (err) {
      dispatch(
        updateResponse({
          index,
          response: { chat: "\nOops, error after transaction." },
        })
      );
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
          if (tools[i]!=null && (tools[i].tool_output != undefined || tools[i].tool_output != null))
            tool_outputs.push(tools[i].tool_output);
        }
      }
      console.log("tool output sendchat", tool_outputs)

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
          console.log("processing message", message["type"], message["content"]);
          
          if (message["type"] === "HumanMessage") {
            // Create a new chat item for each human message
            dispatch(addPrompt(message["content"]));
            currentChatIndex = getState().chatData.chats.length - 1;
            console.log("created new chat item at index", currentChatIndex);
          } else if (message["type"] === "ToolMessage" || message["type"] === "AIMessage") {
            // Add to the current chat item's response
            if (currentChatIndex >= 0) {
              const currentChat = getState().chatData.chats[currentChatIndex];
              const existingResponse = currentChat?.response || { chat: "", tool_outputs: [] };
              
              let updatedResponse = { ...existingResponse };
              
              if (message["type"] === "AIMessage") {
                // Append AI message content
                updatedResponse.chat = (updatedResponse.chat || "") + (message["content"] || "");
              } else if (message["type"] === "ToolMessage" && message["tool_output"]) {
                // Add tool_output to the array
                const existingToolOutputs = updatedResponse.tool_outputs || [];
                updatedResponse.tool_outputs = [...existingToolOutputs, message["tool_output"]];
              }
              
              console.log("updating chat item", currentChatIndex, "with", message["type"], "response:", updatedResponse);
              
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
      hash
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
      toolId
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
