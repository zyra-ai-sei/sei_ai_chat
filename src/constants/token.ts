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
  imageUrl: wethIcon,
};

export const SeiToken: IToken = {
  chainId: 1329,
  address:"",
  name:"SEI",
  symbol:"SEI",
  denom:"usei",
  decimals:18,
  localName:"SEI",
  nameOnChain:"SEI",
  native: true,
  imageUrl: seiIcon
}

// ========== ETHEREUM TOKENS (chainId: 1) ==========
export const EthWethToken: IToken = {
  chainId: 1,
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  name: "Wrapped Ether",
  symbol: "WETH",
  denom: "weth",
  decimals: 18,
  localName: "WETH",
  nameOnChain: "Wrapped Ether",
  native: false,
  imageUrl: wethIcon,
};

export const EthUsdcToken: IToken = {
  chainId: 1,
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  name: "USD Coin",
  symbol: "USDC",
  denom: "usdc",
  decimals: 6,
  localName: "USDC",
  nameOnChain: "USD Coin",
  native: false,
  imageUrl: usdcIcon,
};

export const EthUsdtToken: IToken = {
  chainId: 1,
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  name: "Tether USD",
  symbol: "USDT",
  denom: "usdt",
  decimals: 6,
  localName: "USDT",
  nameOnChain: "Tether USD",
  native: false,
  imageUrl: usdtIcon,
};

export const EthWbtcToken: IToken = {
  chainId: 1,
  address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  name: "Wrapped Bitcoin",
  symbol: "WBTC",
  denom: "wbtc",
  decimals: 8,
  localName: "WBTC",
  nameOnChain: "Wrapped Bitcoin",
  native: false,
  imageUrl: wbtcIcon,
};

// ========== POLYGON TOKENS (chainId: 137) ==========
export const PolygonWmaticToken: IToken = {
  chainId: 137,
  address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  name: "Wrapped Matic",
  symbol: "WMATIC",
  denom: "wmatic",
  decimals: 18,
  localName: "WMATIC",
  nameOnChain: "Wrapped Matic",
  native: false,
  imageUrl: seiIcon, // Using placeholder, update with MATIC icon if available
};

export const PolygonUsdcToken: IToken = {
  chainId: 137,
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  name: "USD Coin",
  symbol: "USDC",
  denom: "usdc",
  decimals: 6,
  localName: "USDC",
  nameOnChain: "USD Coin",
  native: false,
  imageUrl: usdcIcon,
};

export const PolygonUsdtToken: IToken = {
  chainId: 137,
  address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  name: "Tether USD",
  symbol: "USDT",
  denom: "usdt",
  decimals: 6,
  localName: "USDT",
  nameOnChain: "Tether USD",
  native: false,
  imageUrl: usdtIcon,
};

export const PolygonWethToken: IToken = {
  chainId: 137,
  address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  name: "Wrapped Ether",
  symbol: "WETH",
  denom: "weth",
  decimals: 18,
  localName: "WETH",
  nameOnChain: "Wrapped Ether",
  native: false,
  imageUrl: wethIcon,
};

// ========== ARBITRUM TOKENS (chainId: 42161) ==========
export const ArbitrumWethToken: IToken = {
  chainId: 42161,
  address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  name: "Wrapped Ether",
  symbol: "WETH",
  denom: "weth",
  decimals: 18,
  localName: "WETH",
  nameOnChain: "Wrapped Ether",
  native: false,
  imageUrl: wethIcon,
};

export const ArbitrumUsdcToken: IToken = {
  chainId: 42161,
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  name: "USD Coin",
  symbol: "USDC",
  denom: "usdc",
  decimals: 6,
  localName: "USDC",
  nameOnChain: "USD Coin",
  native: false,
  imageUrl: usdcIcon,
};

export const ArbitrumUsdtToken: IToken = {
  chainId: 42161,
  address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  name: "Tether USD",
  symbol: "USDT",
  denom: "usdt",
  decimals: 6,
  localName: "USDT",
  nameOnChain: "Tether USD",
  native: false,
  imageUrl: usdtIcon,
};

// ========== BASE TOKENS (chainId: 8453) ==========
export const BaseWethToken: IToken = {
  chainId: 8453,
  address: "0x4200000000000000000000000000000000000006",
  name: "Wrapped Ether",
  symbol: "WETH",
  denom: "weth",
  decimals: 18,
  localName: "WETH",
  nameOnChain: "Wrapped Ether",
  native: false,
  imageUrl: wethIcon,
};

export const BaseUsdcToken: IToken = {
  chainId: 8453,
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  name: "USD Coin",
  symbol: "USDC",
  denom: "usdc",
  decimals: 6,
  localName: "USDC",
  nameOnChain: "USD Coin",
  native: false,
  imageUrl: usdcIcon,
};

export const BaseUsdtToken: IToken = {
  chainId: 8453,
  address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  name: "Bridged Tether USD",
  symbol: "USDT",
  denom: "usdt",
  decimals: 6,
  localName: "USDT",
  nameOnChain: "Bridged Tether USD",
  native: false,
  imageUrl: usdtIcon,
};

export const BaseWbtcToken: IToken = {
  chainId: 8453,
  address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
  name: "Wrapped BTC",
  symbol: "WBTC",
  denom: "wbtc",
  decimals: 8,
  localName: "WBTC",
  nameOnChain: "Wrapped BTC",
  native: false,
  imageUrl: wbtcIcon,
};

// Token list for Sei Network (chainId: 1329)
const SeiTokenList: IToken[] = [
  UsdcToken,
  UsdcnToken,
  UsdtToken,
  WseiToken,
  WbtcToken,
  WethToken
];

// Token lists for other networks
const EthereumTokenList: IToken[] = [
  EthWethToken,
  EthUsdcToken,
  EthUsdtToken,
  EthWbtcToken,
];

const PolygonTokenList: IToken[] = [
  PolygonWmaticToken,
  PolygonUsdcToken,
  PolygonUsdtToken,
  PolygonWethToken,
];

const ArbitrumTokenList: IToken[] = [
  ArbitrumWethToken,
  ArbitrumUsdcToken,
  ArbitrumUsdtToken,
];

const BaseTokenList: IToken[] = [
  BaseWethToken,
  BaseUsdcToken,
  BaseUsdtToken,
  BaseWbtcToken,
];

// Chain-based token map
export const TokensByChain: Record<number, IToken[]> = {
  1329: SeiTokenList,      // Sei
  1: EthereumTokenList,    // Ethereum
  42161: ArbitrumTokenList, // Arbitrum
  8453: BaseTokenList,     // Base
  137: PolygonTokenList,   // Polygon
};

// Helper function to get tokens for a specific chain
export const getTokensByChainId = (chainId: number): IToken[] => {
  return TokensByChain[chainId] || [];
};

// All tokens list (for backward compatibility)
export const TokenList: IToken[] = Object.values(TokensByChain).flat();


