import { BuyTokenReminderEnum } from "@/enum/utility.enum";

export interface IGlobalData {
  isDarkModeEnabled: boolean;
  smartAccountAddress: string;
  eoaAddress: string;
  isOtpSent: boolean;
  isEoaEnabled: boolean;
  isTokenExpired: boolean;
  chainIdSelected: number;
  name: string;
  auth_date?: number;
  hash?: string;
  photo_url?: string;
  username?: string;
  buyTokenReminder?: BuyTokenReminderEnum;
  isConnectButtonClicked: boolean;
  isNetworkSwitchWarningTriggered: boolean;
  currentWallet?: string;
}

export interface IGlobalReducerState {
  isLoading: boolean;
  error: string;
  data: IGlobalData;
  isMobile: boolean;
}
