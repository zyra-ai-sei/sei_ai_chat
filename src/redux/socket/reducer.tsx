// socketSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LiveScore {
  // Define the structure for live score data
}

export interface SocketState {
  liveScoreData: LiveScore | null;
  isEstablishingConnection: boolean;
  isConnected: boolean;
}

const initialState: SocketState = {
  liveScoreData: null,
  isEstablishingConnection: false,
  isConnected: false,
};

const socketSlice = createSlice({
  name: 'socketData',
  initialState,
  reducers: {
    connectLiveScore: state => {
      state.isEstablishingConnection = true;
    },
    disconnectLiveScore: state => {
      state.isConnected = false;
      state.isEstablishingConnection = false;
      state.liveScoreData = null;
    },
    connectionEstablished: state => {
      state.isConnected = true;
      state.isEstablishingConnection = false;
    },
    receiveLiveScoreData: (state, action: PayloadAction<{ liveScoreData: LiveScore }>) => {
      state.liveScoreData = action.payload.liveScoreData;
    },
  
  },
});

export const { connectLiveScore, disconnectLiveScore, connectionEstablished, receiveLiveScoreData } = socketSlice.actions;
export const socketActions = socketSlice.actions;
export default socketSlice.reducer;

