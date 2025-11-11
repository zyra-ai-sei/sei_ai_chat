export enum LocalStorageIdEnum {
  IS_DARKMODE_ENABLED = "IS_DARKMODE_ENABLED",
  IS_EMAIL_VERIFIED = "IS_EMAIL_VERIFIED",
  USER_DETAILS = "USER_DETAILS",
  IS_DISCLAIMER_OPEN = "IS_DISCLAIMER_OPEN",
  IS_EARLYFAN_BANNER_OPEN = "IS_EARLYFAN_BANNER_OPEN",
  IS_PWA_FIRST_TIME = "IS_PWA_FIRST_TIME",
  IS_FEEDBACK_GIVEN = "IS_FEEDBACK_GIVEN",
  COOKIE_DATA = "COOKIE_DATA",
  RELEASE_NOTES_VERSION = "RELEASE_NOTES_VERSION",
  CUSTOM_TOKENS_LIST = "CUSTOM_TOKENS_LIST",
}

export enum SessionStorageIdEnum {
  IS_JOINING_CONTEST = "_is_joining_contest",
  IS_FETCH_CONTEST_SUCCESS = "_is_joining_contest_success",
}

export enum OtpStatusEnum {
  PENDING = "PENDING",
  SENT = "SENT",
  ERROR = "ERROR",
  VERIFIED = "VERIFIED",
}

export enum SignInStateEnum {
  REFERRAl = "REFERRAl",
  NAME = "NAME",
  VERIFIED = "VERIFIED",
}

export enum TokenTypeEnum {
  MATIC = "MATIC",
  USDC = "USDC",
  CHAQUEN = "Chaquen",
}

export enum WalletTypeEnum {
  EOA = "EOA",
  SMART = "SMART",
}

export enum ContestTypeEnum {
  FREE = "Free",
  PAID = "Paid",
}

export enum AuthStatusEnum {
  LoggedOut = "LOGGED_OUT",
  NewLogin = "NEW_LOGIN",
  Default = "DEFAULT",
}
export enum MatchOutcomeEnum {
  NotUpdated = "NotUpdated",
  TeamAWon = "TeamAWon",
  TeamBWon = "TeamBWon",
  Draw = "Draw",
  NotPlayed = "NotPlayed",
}
export enum BuyTokenReminderEnum {
  Set = "SET",
  NotSet = "NOTSET"
}