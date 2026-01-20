export interface IToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  denom: string;
  decimals: number;
  localName: string;
  nameOnChain: string;
  native: boolean;
  imageUrl: string;
}

export interface IRewardTokens {
  [key: string]: IToken;
}
