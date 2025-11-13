// Token icons
import usdcIcon from '@/assets/tokens/usdc.svg';
import usdtIcon from '@/assets/tokens/usdt.svg';
import seiIcon from '@/assets/tokens/sei.png';
import drgIcon from '@/assets/tokens/drg.svg';
import ethIcon from '@/assets/tokens/eth.svg';
import daiIcon from '@/assets/tokens/dai.svg';
import wseiIcon from '@/assets/tokens/wsei.png';

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  color: string; // For gradient backgrounds
}

export const TOKENS: Token[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: usdcIcon,
    color: '#2775CA',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: usdtIcon,
    color: '#26A17B',
  },
  {
    symbol: 'SEI',
    name: 'Sei',
    icon: seiIcon,
    color: '#FF0000',
  },
  {
    symbol: 'DRG',
    name: 'DragonSwap',
    icon: drgIcon,
    color: '#8D38DD',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: ethIcon,
    color: '#627EEA',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: daiIcon,
    color: '#F4B731',
  },
  {
    symbol: 'WSEI',
    name: 'Wrapped Sei',
    icon: wseiIcon,
    color: '#FF0000',
  },
];

export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return TOKENS.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
};

export const getTokenIcon = (symbol: string): string => {
  const token = getTokenBySymbol(symbol);
  return token?.icon || drgIcon; // Default to DRG icon if not found
};
