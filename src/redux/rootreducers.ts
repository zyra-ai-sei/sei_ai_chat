import { combineReducers } from "@reduxjs/toolkit";
import globalDataReducer from "./globalData/reducer";
import SocketReducer from "./socket/reducer";
import chatDataReducer from "./chatData/reducer";
import transactionReducer from "./transactionData/reducer";
import tokenReducer from "./tokenData/reducer";
import tokenVisualizationReducer from "./tokenVisualization/reducer";
import portfolioReducer from "./portfolioData/reducer";
import defiReducer from "./portfolioData/defiReducer";
import portfolioSummaryReducer from "./portfolioData/summaryReducer";

export const rootReducers = combineReducers({

  SocketData: SocketReducer,
  globalData: globalDataReducer,
  chatData: chatDataReducer,
  transactionData: transactionReducer,
  tokenData: tokenReducer,
  tokenVisualization: tokenVisualizationReducer,
  portfolioData: portfolioReducer,
  defiData: defiReducer,
  portfolioSummary: portfolioSummaryReducer,
});
export type RootState = ReturnType<typeof rootReducers>;