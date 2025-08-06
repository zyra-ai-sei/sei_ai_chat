import { combineReducers } from "@reduxjs/toolkit";
import globalDataReducer from "./globalData/reducer";
import SocketReducer from "./socket/reducer";
import chatDataReducer from "./chatData/reducer";
import transactionReducer from "./transactionData/reducer";
export const rootReducers = combineReducers({

  SocketData: SocketReducer,
  globalData: globalDataReducer,
  chatData: chatDataReducer,
  transactionData: transactionReducer
});
export type RootState = ReturnType<typeof rootReducers>;