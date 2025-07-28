import { combineReducers } from "@reduxjs/toolkit";
import globalDataReducer from "./globalData/reducer";
import SocketReducer from "./socket/reducer";
import chatDataReducer from "./chatData/reducer";
export const rootReducers = combineReducers({

  SocketData: SocketReducer,
  globalData: globalDataReducer,
  chatData: chatDataReducer,

});
export type RootState = ReturnType<typeof rootReducers>;