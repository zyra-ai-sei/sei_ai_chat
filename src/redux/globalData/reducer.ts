import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocalStorageIdEnum } from "../../enum/utility.enum";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../../hooks/useLocalStorage";
import { IGlobalReducerState } from "./interface";

const userDetails = getLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
  isDarkModeEnabled: true,
  smartAccountAddress: "",

  token: "",
  isEoaEnabled: false,
  smartWalletBalance: 0,
  isTokenExpired: false,
  chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
  name: "",
  isMobile: window?.innerWidth < 768,
  eoaAddress: "",
  auth_date: 0,
  hash: "",
  photo_url: "",
  username: "",
  modelFamily: "gemini",
  model: "gemini-2.5-flash",
});

export const initialState: IGlobalReducerState = {
  isLoading: false,
  error: "",
  isMobile: window?.innerWidth < 768,
  data: {
    isDarkModeEnabled: userDetails?.isDarkModeEnabled,
    smartAccountAddress: userDetails?.smartAccountAddress,
    biconomySmartAccount: null,
    token: userDetails?.token,
    isEoaEnabled: userDetails?.isEoaEnabled,
    smartWalletBalance: userDetails?.smartWalletBalance,
    isTokenExpired: userDetails?.isTokenExpired,
    chainIdSelected: userDetails?.chainIdSelected,
    name: userDetails?.name,
    isMboile: userDetails.isMobile,
    eoaAddress: userDetails.eoaAddress,
    auth_date: userDetails.auth_date,
    hash: userDetails.hash,
    photo_url: userDetails?.photo_url,
    username: userDetails?.username,
    modelFamily: userDetails?.modelFamily,
    model: userDetails?.model,
  },
};

export const globalDataSlice = createSlice({
  name: "themeData",
  initialState,
  reducers: {
    setGlobalData: (
      state,
      { payload }: PayloadAction<IGlobalReducerState["data"]>
    ) => {
      setLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
        isDarkModeEnabled: payload.isDarkModeEnabled,
        smartAccountAddress: payload.smartAccountAddress,
        token: payload?.token,
        isEoaEnabled: payload?.isEoaEnabled,
        smartWalletBalance: payload?.smartWalletBalance,
        isTokenExpired: payload?.isTokenExpired,
        chainIdSelected: payload?.chainIdSelected,
        name: payload.name,
        isMobile: payload.isMboile,
        eoaAddress: payload?.eoaAddress,
        auth_date: payload.auth_date,
        hash: payload.hash,
        photo_url: payload.photo_url,
        username: payload.username,
        modelFamily: payload.modelFamily,
        model: payload.model,
      });

      if (payload.isDarkModeEnabled) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
      return {
        ...state,
        isLoading: false,
        error: "",
        data: {
          ...payload,
        },
      };
    },
    globalDataGetFail: (
      state,
      { payload }: PayloadAction<IGlobalReducerState["error"]>
    ) => {
      setLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
        isDarkModeEnabled: true,
        smartAccountAddress: "",
        biconomySmartAccount: null,
        token: "",
        isEoaEnabled: false,
        smartWalletBalance: 0,
        isTokenExpired: false,
        chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
        name: "",
        isMboile: false,

        eoaAddress: "",
        auth_date: 0,
        hash: "",
        photo_url: "",
        username: "",
        modelFamily: "gemini",
        model: "gemini-2.5-flash",
      });

      return {
        ...state,
        isLoading: false,
        error: payload,
        data: {
          isDarkModeEnabled: false,
          smartAccountAddress: "",
          biconomySmartAccount: null,
          token: "",
          isEoaEnabled: false,
          smartWalletBalance: 0,
          isTokenExpired: false,
          chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
          name: "",
          isMboile: false,
          eoaAddress: "",
          auth_date: 0,
          hash: "",
          photo_url: "",
          username: "",
          model: "gemini-2.5-flash",
          modelFamily: "gemini",
        },
      };
    },
    resetGlobalData: (state) => {
      setLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
        isDarkModeEnabled: true,
        smartAccountAddress: "",
        biconomySmartAccount: null,
        token: "",
        isEoaEnabled: false,
        smartWalletBalance: 0,
        isTokenExpired: false,
        chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
        name: "",
        isMboile: false,

        eoaAddress: "",
        auth_date: 0,
        hash: "",
        photo_url: "",
        username: "",
        modelFamily: "gemini",
        model: "gemini-2.5-flash",
      });

      return {
        ...state,
        isLoading: false,
        error: "",
        data: {
          isDarkModeEnabled: true,
          smartAccountAddress: "",
          biconomySmartAccount: null,
          token: "",
          isEoaEnabled: false,
          smartWalletBalance: 0,
          isTokenExpired: false,
          chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
          name: "",
          isMboile: false,
          eoaAddress: "",
          auth_date: 0,
          hash: "",
          photo_url: "",
          username: "",
          modelFamily: "gemini",
          model: "gemini-2.5-flash",
        },
      };
    },
    setGLobalDataLoadingStart: (state) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    setGLobalDataLoadingEnd: (state) => {
      return {
        ...state,
        isLoading: false,
      };
    },
    setGLobalMobileData: (state) => {
      return {
        ...state,
        isMobile: window?.innerWidth < 768,
      };
    },
  },
});

export default globalDataSlice.reducer;
