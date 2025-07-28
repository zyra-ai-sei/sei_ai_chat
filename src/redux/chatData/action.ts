import { chatDataSlice } from "./reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";
import { IRootState } from "../store";

export const { addPrompt, setResponse, setError, resetChat, addSessionId, eraseLatestToolOutput, updateResponse } = chatDataSlice.actions;
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
      const response = await axiosInstance.post("/llm/chat", { prompt: txdata });
      const apiData = response?.data;
      if (apiData?.status === 200 && apiData?.data) {
        const chat = apiData.data.chat || "";
        const tool_output = apiData.data.tool?.tool_output;
        dispatch(
          updateResponse({
            index,
            response: {
              chat,
              ...(tool_output ? { tool_output } : {}),
            },
          })
        );
      } else {
        // Optionally, you can append an error message
        dispatch(updateResponse({ index, response: { chat: "\nOops, error after transaction." } }));
      }
    } catch (err) {
      dispatch(updateResponse({ index, response: { chat: "\nOops, error after transaction." } }));
    }
  }
);

// Thunk to erase tool_output of the latest chat session
export const eraseLatestToolOutputThunk = createAsyncThunk<
  void,
  void,
  { state: IRootState }
>(
  "chatData/eraseLatestToolOutput",
  async (_, { dispatch }) => {
    dispatch(eraseLatestToolOutput());
  }
);

// Thunk to send prompt and handle response
export const sendChatPrompt = createAsyncThunk<
  void,
  { prompt: string },
  { state: IRootState }
>(
  "chatData/sendChatPrompt",
  async ({ prompt }, { dispatch, getState }) => {
    // Add prompt to chat list
    dispatch(addPrompt(prompt));
    const index = getState().chatData.chats.length - 1;
    try {
      const response = await axiosInstance.post("/llm/chat", { prompt });
      const apiData = response?.data;
      if (apiData?.status === 200 && apiData?.data) {
        const chat = apiData.data.chat || "";
        const tool_output = apiData.data.tool?.tool_output;
        dispatch(
          setResponse({
            index,
            response: {
              chat,
              ...(tool_output ? { tool_output } : {}),
            },
          })
        );
      } else {
        dispatch(setError({ index }));
      }
    } catch (err) {
      dispatch(setError({ index }));
    }
  }
);

export const initializePrompt = createAsyncThunk<
void,
void,
{state: IRootState}
>(
    "chatData/initializePrompt",
    async (_, { dispatch }) => {
        try{
            const response = await axiosInstance.post("/llm/init");
            const apiData = response?.data;
            if(apiData?.status === 200 && apiData?.data){
                const sessionId = apiData.data.sessionId;
                dispatch(
                    addSessionId(sessionId)
                )
            }else{
                dispatch(
                    resetChat()
                )
            }
        } catch(err){
            dispatch(resetChat());
        }
    }
);
