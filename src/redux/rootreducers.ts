import { combineReducers } from "@reduxjs/toolkit";
import globalDataReducer from "./globalData/reducer";
import SocketReducer from "./socket/reducer";
import chatDataReducer from "./chatData/reducer";
import transactionReducer from "./transactionData/reducer";
import orderReducer from "./orderData/reducer";
import tokenReducer from "./tokenData/reducer";
import tokenVisualizationReducer from "./tokenVisualization/reducer";
import portfolioReducer from "./portfolioData/reducer";
import defiReducer from "./portfolioData/defiReducer";
import portfolioSummaryReducer from "./portfolioData/summaryReducer";
import trackingReducer from "./trackingData/reducer";

export const rootReducers = combineReducers({

  SocketData: SocketReducer,
  globalData: globalDataReducer,
  chatData: chatDataReducer,
  transactionData: transactionReducer,
  orderData: orderReducer,
  tokenData: tokenReducer,
  tokenVisualizationData: tokenVisualizationReducer,
  portfolioData: portfolioReducer,
  defiData: defiReducer,
  portfolioSummaryData: portfolioSummaryReducer,
  trackingData: trackingReducer,
});
export type RootState = ReturnType<typeof rootReducers>;