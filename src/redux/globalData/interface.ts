import { BuyTokenReminderEnum } from "@/enum/utility.enum";
import { BiconomySmartAccountV2 } from "@biconomy/account";

export interface IGlobalData {
  isDarkModeEnabled: boolean;
  smartAccountAddress: string;
  eoaAddress: string;
  biconomySmartAccount: BiconomySmartAccountV2 | null;
  token: string;
  isEoaEnabled: boolean;
  smartWalletBalance: number;
  isTokenExpired: boolean;
  chainIdSelected: number;
  name: string;
  isMboile: boolean;
  auth_date?: number;
  hash?: string;
  photo_url?: string;
  username?: string;
  modelFamily: string;
  model: string;
}

export interface IGlobalReducerState {
  isLoading: boolean;
  error: string;
  data: IGlobalData;
  isMobile: boolean;
}
