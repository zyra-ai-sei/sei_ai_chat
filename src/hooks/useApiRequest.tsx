import { useReducer, useCallback } from "react";
import { AxiosRequestConfig, CancelTokenSource } from "axios";
import { axiosInstance } from "@/services/axios";
import { FixTypeLater } from "react-redux";
// import qs from 'querystring';

type fetchAction = "FETCHING" | "SUCCESS" | "ERROR";

export const initialState = {
  status: null,
  response: null,
};

const reducer = (state = initialState, action: FixTypeLater): FixTypeLater => {
  switch (action.type) {
    case "FETCHING":
      return { ...initialState, status: "FETCHING" };
    case "SUCCESS":
      return { ...state, status: "SUCCESS", response: action.response };
    case "ERROR":
      return { ...state, status: "ERROR", response: action.response };
    default:
      return state;
  }
};

// Actions
const fetching = () => ({ type: "FETCHING" });
const success = (response: FixTypeLater) => ({ type: "SUCCESS", response });
const error = (response: FixTypeLater) => ({ type: "ERROR", response });

type Params = {
  verb?: string;
  params?: { [index: string]: unknown };
  cancel?: CancelTokenSource;
};
type MakeRequestWithParams = (
  endpoint?: string,
  localParams?: Params
) => Promise<void>;

type UseApiRequest = [
  // We can't use unknown in this line because then it'll be throw errors in the implementation
  // of the response

  { status: fetchAction; response: FixTypeLater },
  MakeRequestWithParams,
];

export const useApiRequest = (
  endpoint: string,
  { verb = "get", params = undefined, authorization = false, token = "" } = {}
): UseApiRequest => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const makeRequest = useCallback(
    async (localEndpoint?: string, localParams?: Params) => {
      const headers = {
        ...(authorization ? { Authorization: "XXX" } : {}),
      };

      if (token && token?.length > 0) {
        headers.Authorization = token;
      }
      const apiEndpoint = localEndpoint || endpoint;
      const apiParams = localParams?.params || params;
      const apiVerb = localParams?.verb || verb;

      dispatch(fetching());

      try {
        const response = await axiosInstance({
          method: apiVerb,
          url: apiEndpoint,
          data: apiParams,
          params: apiVerb === "get" ? apiParams : undefined,
          headers,
          cancelToken: localParams?.cancel?.token || undefined,
          paramsSerializer: (params) => JSON.stringify(params),
        } as AxiosRequestConfig);
        dispatch(success(response));
      } catch (e) {
        dispatch(error(e));
        console.error(e);
      }
    },
    [endpoint, verb, params]
  );

  return [state, makeRequest];
};
