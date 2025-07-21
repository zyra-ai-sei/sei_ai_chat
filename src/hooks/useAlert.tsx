import React, { Context, useContext, useReducer } from "react";
import { FixTypeLater } from "react-redux";

export interface AlertState {
  type: "success" | "info" | "warning" | "error" | "loader" | "";
  title?: string;
  message?: string;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
const alertContext: Context<{
  state: AlertState;
  dispatch: (payload: AlertState) => void;
}> = React.createContext(null);

export const useAlert = (): {
  state: AlertState;
  dispatch: (payload: FixTypeLater) => void;
} => {
  return useContext(alertContext);
};

const defaultState: AlertState = {
  type: "",
  title: "",
  message: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer: React.Reducer<AlertState, any> = (
  state: AlertState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any
): AlertState => {
  const { title = "", message = "" } = action.payload;
  if (action.type === "SUCCESS") {
    return {
      ...state,
      type: "success",
      title,
      message,
    };
  }
  if (action.type === "INFO") {
    return {
      ...state,
      type: "info",
      title,
      message,
    };
  }
  if (action.type === "WARNING") {
    return {
      ...state,
      type: "warning",
      title,
      message,
    };
  }
  if (action.type === "ERROR") {
    return {
      ...state,
      type: "error",
      title,
      message,
    };
  }
  if (action.type === "LOADER") {
    return {
      ...state,
      type: "loader",
      title,
      message,
    };
  }

  if (action.type === "CLEAR") {
    return {
      ...state,
      type: "",
      title: "",
      message: "",
    };
  }

  return state;
};

interface Props {
  children: React.ReactNode;
}

const AlertProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <alertContext.Provider value={{ state, dispatch }}>
      {children}
    </alertContext.Provider>
  );
};

export default AlertProvider;
