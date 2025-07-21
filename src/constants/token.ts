import { IRewardTokens, IToken } from "@/interface/token.interface";
import usdcIcon from "@/assets/leaderBoard/usdc.svg";
import coinIcon from "@/assets/header/coin.png";
import usdtIcon from "@/assets/leaderBoard/usdt.svg";
export const UsdcToken: IToken = {
  chainId: 137,
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  name: "USDC",
  symbol: "USDC",
  decimals: 6,
  localName: "USDC",
  nameOnChain: "USDC",
  native: false,
  divisor: BigInt(10 ** 6),
  imageUrl: usdcIcon,
};

export const ChaquenPointsToken: IToken = {
  chainId: 137,
  address: "",
  name: "ChaquenPoints",
  symbol: "ChaquenPoints",
  decimals: 18,
  localName: "ChaquenPoints",
  nameOnChain: "ChaquenPoints",
  native: false,
  divisor: BigInt(10 ** 18),
  imageUrl: coinIcon,
};

export const UsdtToken: IToken = {
  chainId: 137,
  address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  name: "USDT",
  symbol: "USDT",
  decimals: 6,
  localName: "USDT",
  nameOnChain: "USDT",
  native: false,
  divisor: BigInt(10 ** 6),
  imageUrl: usdtIcon,
};

export const rewardTokens: IRewardTokens = {
  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359": UsdcToken,
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": UsdtToken,
};
