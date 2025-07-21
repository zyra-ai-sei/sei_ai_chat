import { BuyTokenReminderEnum } from "@/enum/utility.enum";
import { BiconomySmartAccountV2 } from "@biconomy/account";

export interface IGlobalData {
  isDarkModeEnabled: boolean;
  smartAccountAddress: string;
  eoaAddress: string;
  biconomySmartAccount: BiconomySmartAccountV2 | null;
  userEmail: string;
  isEmailVerified: boolean;
  isOtpSent: boolean;
  token: string;
  isEoaEnabled: boolean;
  smartWalletBalance: number;
  isTokenExpired: boolean;
  chainIdSelected: number;
  name: string;
  isMboile: boolean;
  isPWAOpened: boolean;
  isEarlyFan: boolean;
  auth_date?: number;
  hash?: string;
  telegramId?: number;
  telegramFirstName?: string;
  telegramLastName?: string;
  photo_url?: string;
  username?: string;
  referralCode?: string;
  inviteCode?: string;
  tgVerified?: boolean;
  buyTokenReminder?: BuyTokenReminderEnum
}

export interface IGlobalReducerState {
  isLoading: boolean;
  error: string;
  data: IGlobalData;
  isMobile: boolean;
}
