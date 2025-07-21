import { combineReducers } from "@reduxjs/toolkit";
import globalDataReducer from "./globalData/reducer";
import SocketReducer from "./socket/reducer";
import userStatsReducer from "./userStatsData/reducer";
import chatDataReducer from "./chatData/reducer";
export const rootReducers = combineReducers({

  SocketData: SocketReducer,
  globalData: globalDataReducer,
  userStatsData: userStatsReducer,
  chatData: chatDataReducer,

});
export type RootState = ReturnType<typeof rootReducers>;