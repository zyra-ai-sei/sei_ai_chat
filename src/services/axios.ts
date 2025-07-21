import { LocalStorageIdEnum } from "@/enum/utility.enum";

import { getLocalStorage } from "@/utility/localStorage";
import axios from "axios";

const API_BASE_URL = "/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-network-id": import.meta.env?.VITE_BASE_CHAIN_ID,
  },
  timeout:230000
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage(LocalStorageIdEnum.USER_DETAILS)?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // const isEoaModeEnabled = getLocalStorage(
    //   LocalStorageIdEnum?.USER_DETAILS
    // )?.isEoaEnabled;
    config.baseURL = config.baseURL + `/v1`;
    // Add query parameters here
    // const queryParams: { [key: string]: string } = {
    //   smartWalletAddress: getLocalStorage(LocalStorageIdEnum?.USER_DETAILS)
    //     ?.smartAccountAddress,
    // };

    // Convert query parameters object to query string
    // const queryString = Object.keys(queryParams)
    //   .map(
    //     (key) =>
    //       `${encodeURIComponent(key)}=${encodeURIComponent(queryParams?.[key])}`
    //   )
    //   .join("&");

    // Append query string to the URL
    // if (queryString && config?.url && !isEoaModeEnabled) {
    //   config.url += (config.url.includes("?") ? "&" : "?") + queryString;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Authorization = "Authorization";
export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common[Authorization] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common[Authorization];
  }
};
// http://localhost:9027/allTournament/league/128743/match/78364