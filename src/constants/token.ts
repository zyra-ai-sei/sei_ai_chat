import { IToken } from "@/interface/token.interface";
import usdcIcon from "@/assets/tokens/usdc.svg";
import usdtIcon from "@/assets/tokens/usdt.svg";
import wbtcIcon from "@/assets/tokens/wbtc.png";
import wethIcon from "@/assets/tokens/weth.png";
import seiIcon from "@/assets/tokens/sei.png";



export const UsdcToken: IToken = {
  chainId: 1329,
  address: "0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392",
  name: "USDC",
  symbol: "USDC",
  denom:'uusdc',
  decimals: 6,
  localName: "USDC",
  nameOnChain: "USDC",
  native: false,
  divisor: BigInt(10 ** 6),
  imageUrl: usdcIcon,
};
export const UsdcnToken: IToken = {
  chainId: 1329,
  address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
  name: "USDC.N",
  symbol: "USDC.N",
  denom: "uusdc",
  decimals: 6,
  localName: "USDC.N",
  nameOnChain: "USDC.N",
  native: false,
  divisor: BigInt(10 ** 6),
  imageUrl: usdcIcon,
};

export const UsdtToken: IToken = {
  chainId: 1329,
  address: "0x9151434b16b9763660705744891fA906F660EcC5",
  name: "USDT",
  symbol: "USDT",
  denom:"uusdt",
  decimals: 6,
  localName: "USDT",
  nameOnChain: "USDT",
  native: false,
  divisor: BigInt(10 ** 6),
  imageUrl: usdtIcon,
};

export const WseiToken: IToken = {
  chainId: 1329,
  address: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
  name: "WSEI",
  symbol: "WSEI",
  denom:"usei",
  decimals: 18,
  localName: "WSEI",
  nameOnChain: "WSEI",
  native: false,
  divisor: BigInt(10 ** 18),
  imageUrl: seiIcon,
};
export const WbtcToken: IToken = {
  chainId: 1329,
  address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
  name: "WBTC",
  symbol: "WBTC",
  denom:"ubtc",
  decimals: 8,
  localName: "WBTC",
  nameOnChain: "WBTC",
  native: false,
  divisor: BigInt(10 ** 8),
  imageUrl: wbtcIcon,
};
export const WethToken: IToken = {
  chainId: 1329,
  address: "0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8",
  name: "WETC",
  symbol: "WETC",
  denom:"ueth",
  decimals: 18,
  localName: "WETC",
  nameOnChain: "WETC",
  native: false,
  divisor: BigInt(10 ** 18),
  imageUrl: wethIcon,
};

export const TokenList: IToken[] = [
  UsdcToken,
  UsdcnToken,
  UsdtToken,
  WseiToken,
  WbtcToken,
  WethToken
]


