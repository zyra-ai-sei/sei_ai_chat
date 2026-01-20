/**
 * Supported blockchain networks configuration
 * This file contains all chain-related constants used across the application
 */

import Sei from "@/assets/chains/sei.svg";
import Arbitrum from "@/assets/chains/arbitrum.svg";
import Ethereum from "@/assets/chains/eth.svg";
import Base from "@/assets/chains/base.svg";
import Polygon from "@/assets/chains/pol.svg";

export const SUPPORTED_CHAINS = [
  { id: "sei", name: "Sei", chainId: 1329, logo: Sei },
  { id: "ethereum", name: "Ethereum", chainId: 1, logo: Ethereum },
  { id: "arbitrum", name: "Arbitrum", chainId: 42161, logo: Arbitrum },
  { id: "base", name: "Base", chainId: 8453, logo: Base },
  { id: "polygon", name: "Polygon", chainId: 137, logo: Polygon },
] as const;

/**
 * Default chain to use when user is not connected or on unsupported network
 */
export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0]; // Sei

/**
 * Get chain configuration by chain ID
 */
export const getChainById = (chainId: number) => {
  return SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId);
};

/**
 * Get chain configuration by chain identifier
 */
export const getChainByIdentifier = (id: string) => {
  return SUPPORTED_CHAINS.find((chain) => chain.id === id);
};

/**
 * Check if a chain ID is supported
 */
export const isSupportedChainId = (chainId: number) => {
  return SUPPORTED_CHAINS.some((chain) => chain.chainId === chainId);
};

/**
 * Get all supported chain IDs
 */
export const getSupportedChainIds = () => {
  return SUPPORTED_CHAINS.map((chain) => chain.chainId);
};

// Type exports for TypeScript support
export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];
export type ChainId = SupportedChain["chainId"];
export type ChainIdentifier = SupportedChain["id"];
