import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BuyTokenReminderEnum, LocalStorageIdEnum } from "../../enum/utility.enum";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../../hooks/useLocalStorage";
import { IGlobalReducerState } from "./interface";

const userDetails = getLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
  isDarkModeEnabled: true,
  smartAccountAddress: "",
  isOtpSent: false,
  isEoaEnabled: false,
  isTokenExpired: false,
  chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
  name: "",
  eoaAddress: "",
  auth_date: 0,
  hash: "",
  photo_url: "",
  username: "",
  buyTokenReminder: BuyTokenReminderEnum?.NotSet,
  currentWallet: undefined
});

export const initialState: IGlobalReducerState = {
  isLoading: false,
  error: "",
  isMobile: window?.innerWidth < 768,
  data: {
    isDarkModeEnabled: userDetails?.isDarkModeEnabled,
    isOtpSent: userDetails?.isOtpSent,
    smartAccountAddress: userDetails?.smartAccountAddress,
    isEoaEnabled: userDetails?.isEoaEnabled,
    isTokenExpired: userDetails?.isTokenExpired,
    chainIdSelected: userDetails?.chainIdSelected,
    name: userDetails?.name,
    eoaAddress: userDetails.eoaAddress,
    auth_date: userDetails.auth_date,
    hash: userDetails.hash,
    photo_url: userDetails?.photo_url,
    username: userDetails?.username,
    buyTokenReminder: BuyTokenReminderEnum?.NotSet,
    isConnectButtonClicked: false,
    isNetworkSwitchWarningTriggered: false,
    currentWallet: userDetails?.currentWallet,
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
        isOtpSent: payload.isOtpSent,
        smartAccountAddress: payload.smartAccountAddress,
        isEoaEnabled: payload?.isEoaEnabled,
        isTokenExpired: payload?.isTokenExpired,
        chainIdSelected: payload?.chainIdSelected,
        name: payload.name,
        eoaAddress: payload?.eoaAddress,
        auth_date: payload.auth_date,
        hash: payload.hash,
        photo_url: payload.photo_url,
        username: payload.username,
        buyTokenReminder: payload?.buyTokenReminder,
        currentWallet: payload?.currentWallet
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
        isOtpSent: false,
        token: "",
        isEoaEnabled: false,
        isTokenExpired: false,
        chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
        name: "",
        eoaAddress: "",
        auth_date: 0,
        hash: "",
        photo_url: "",
        username: "",
        buyTokenReminder: BuyTokenReminderEnum?.NotSet
      });

      return {
        ...state,
        isLoading: false,
        error: payload,
        data: {
          isDarkModeEnabled: false,
          smartAccountAddress: "",
          isOtpSent: false,
          token: "",
          isEoaEnabled: false,
          isTokenExpired: false,
          chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
          name: "",
          eoaAddress: "",
          auth_date: 0,
          hash: "",
          photo_url: "",
          username: "",
          buyTokenReminder: BuyTokenReminderEnum?.NotSet,
          isConnectButtonClicked: false,
          isNetworkSwitchWarningTriggered: false,
          currentWallet: undefined,
        },
      };
    },
    resetGlobalData: (state) => {
      setLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
        isDarkModeEnabled: true,
        smartAccountAddress: "",
        isOtpSent: false,
        token: "",
        isEoaEnabled: false,
        isTokenExpired: false,
        chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
        name: "",
        eoaAddress: "",
        auth_date: 0,
        hash: "",
        photo_url: "",
        username: "",
        buyTokenReminder: BuyTokenReminderEnum?.NotSet,
        currentWallet: undefined
      });

      return {
        ...state,
        isLoading: false,
        error: "",
        data: {
          isDarkModeEnabled: true,
          smartAccountAddress: "",
          isOtpSent: false,
          token: "",
          isEoaEnabled: false,
          isTokenExpired: false,
          chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
          name: "",
          eoaAddress: "",
          auth_date: 0,
          hash: "",
          photo_url: "",
          username: "",
          buyTokenReminder: BuyTokenReminderEnum?.NotSet,
          isConnectButtonClicked: false,
          isNetworkSwitchWarningTriggered: false,
          currentWallet: undefined,
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