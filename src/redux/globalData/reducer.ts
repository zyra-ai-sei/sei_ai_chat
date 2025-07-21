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
  userEmail: "",
  isEmailVerified: false,
  isOtpSent: false,
  token: "",
  isEoaEnabled: false,
  smartWalletBalance: 0,
  isTokenExpired: false,
  chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
  name: "",
  isMobile: window?.innerWidth < 768,
  isPWAOpened: window.matchMedia("(display-mode: standalone)").matches,
  eoaAddress: "",
  isEarlyFan: false,
  auth_date: 0,
  hash: "",
  telegramId: 0,
  telegramFirstName: "",
  telegramLastName: "",
  photo_url: "",
  username: "",
  referralCode: "",
  inviteCode: "",
  tgVerified: false,
  buyTokenReminder: BuyTokenReminderEnum?.NotSet
});

export const initialState: IGlobalReducerState = {
  isLoading: false,
  error: "",
  isMobile: window?.innerWidth < 768,
  data: {
    isDarkModeEnabled: userDetails?.isDarkModeEnabled,
    isEmailVerified: userDetails?.isEmailVerified,
    isOtpSent: userDetails?.isOtpSent,
    userEmail: userDetails?.userEmail,
    smartAccountAddress: userDetails?.smartAccountAddress,
    biconomySmartAccount: null,
    token: userDetails?.token,
    isEoaEnabled: userDetails?.isEoaEnabled,
    smartWalletBalance: userDetails?.smartWalletBalance,
    isTokenExpired: userDetails?.isTokenExpired,
    chainIdSelected: userDetails?.chainIdSelected,
    name: userDetails?.name,
    isMboile: userDetails.isMobile,
    isPWAOpened: userDetails?.isPWAOpened,
    eoaAddress: userDetails.eoaAddress,
    isEarlyFan: userDetails?.isEarlyFan,
    auth_date: userDetails.auth_date,
    hash: userDetails.hash,
    telegramId: userDetails.telegramId,
    telegramFirstName: userDetails.telegramFirstName,
    telegramLastName: userDetails.telegramLastName,
    photo_url: userDetails?.photo_url,
    username: userDetails?.username,
    referralCode: userDetails?.referralCode,
    inviteCode: userDetails?.inviteCode,
    tgVerified: userDetails?.tgVerified,
    buyTokenReminder: BuyTokenReminderEnum?.NotSet
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
        isEmailVerified: payload.isEmailVerified,
        isOtpSent: payload.isOtpSent,
        userEmail: payload.userEmail,
        smartAccountAddress: payload.smartAccountAddress,
        token: payload?.token,
        isEoaEnabled: payload?.isEoaEnabled,
        smartWalletBalance: payload?.smartWalletBalance,
        isTokenExpired: payload?.isTokenExpired,
        chainIdSelected: payload?.chainIdSelected,
        name: payload.name,
        isMobile: payload.isMboile,
        isPWAOpened: window.matchMedia("(display-mode: standalone)").matches,
        eoaAddress: payload?.eoaAddress,
        isEarlyFan: payload?.isEarlyFan,
        auth_date: payload.auth_date,
        hash: payload.hash,
        telegramId: payload.telegramId,
        telegramFirstName: payload.telegramFirstName,
        telegramLastName: payload.telegramLastName,
        photo_url: payload.photo_url,
        username: payload.username,
        referralCode: payload.referralCode,
        inviteCode: payload?.inviteCode,
        tgVerified: payload?.tgVerified,
        buyTokenReminder: payload?.buyTokenReminder
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
          isPWAOpened: window.matchMedia("(display-mode: standalone)").matches,
        },
      };
    },
    globalDataGetFail: (
      state,
      { payload }: PayloadAction<IGlobalReducerState["error"]>
    ) => {
      setLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
        isPWAOpened: window.matchMedia("(display-mode: standalone)").matches,

        isDarkModeEnabled: true,
        smartAccountAddress: "",
        biconomySmartAccount: null,
        isEmailVerified: false,
        isOtpSent: false,
        userEmail: "",
        token: "",
        isEoaEnabled: false,
        smartWalletBalance: 0,
        isTokenExpired: false,
        chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
        name: "",
        isMboile: false,

        eoaAddress: "",
        isEarlyFan: false,
        auth_date: 0,
        hash: "",
        telegramId: 0,
        telegramFirstName: "",
        telegramLastName: "",
        photo_url: "",
        username: "",
        referralCode: "",
        inviteCode: "",
        tgVerified: false,
        buyTokenReminder: BuyTokenReminderEnum?.NotSet
      });

      return {
        ...state,
        isLoading: false,
        error: payload,
        data: {
          isDarkModeEnabled: false,
          smartAccountAddress: "",
          biconomySmartAccount: null,
          isEmailVerified: false,
          isOtpSent: false,
          userEmail: "",
          token: "",
          isEoaEnabled: false,
          smartWalletBalance: 0,
          isTokenExpired: false,
          chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
          name: "",
          isMboile: false,
          isPWAOpened: false,
          eoaAddress: "",
          isEarlyFan: false,
          auth_date: 0,
          hash: "",
          telegramId: 0,
          telegramFirstName: "",
          telegramLastName: "",
          photo_url: "",
          username: "",
          referralCode: "",
          inviteCode: "",
          tgVerified: false,
          buyTokenReminder: BuyTokenReminderEnum?.NotSet
        },
      };
    },
    resetGlobalData: (state) => {
      setLocalStorageData(LocalStorageIdEnum.USER_DETAILS, {
        isPWAOpened: window.matchMedia("(display-mode: standalone)").matches,

        isDarkModeEnabled: true,
        smartAccountAddress: "",
        biconomySmartAccount: null,
        isEmailVerified: false,
        isOtpSent: false,
        userEmail: "",
        token: "",
        isEoaEnabled: false,
        smartWalletBalance: 0,
        isTokenExpired: false,
        chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
        name: "",
        isMboile: false,

        eoaAddress: "",
        isEarlyFan: false,
        auth_date: 0,
        hash: "",
        telegramId: 0,
        telegramFirstName: "",
        telegramLastName: "",
        photo_url: "",
        username: "",
        referralCode: "",
        inviteCode: "",
        tgVerified: false,
        buyTokenReminder: BuyTokenReminderEnum?.NotSet
      });

      return {
        ...state,
        isLoading: false,
        error: "",
        data: {
          isDarkModeEnabled: true,
          smartAccountAddress: "",
          biconomySmartAccount: null,
          isEmailVerified: false,
          isOtpSent: false,
          userEmail: "",
          token: "",
          isEoaEnabled: false,
          smartWalletBalance: 0,
          isTokenExpired: false,
          chainIdSelected: import.meta.env?.VITE_BASE_CHAIN_ID || 137,
          name: "",
          isMboile: false,
          isPWAOpened: false,
          eoaAddress: "",
          isEarlyFan: false,
          auth_date: 0,
          hash: "",
          telegramId: 0,
          telegramFirstName: "",
          telegramLastName: "",
          photo_url: "",
          username: "",
          referralCode: "",
          inviteCode: "",
          tgVerified: false,
          buyTokenReminder: BuyTokenReminderEnum?.NotSet
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