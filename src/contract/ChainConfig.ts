import ApplicationConfig from "../ApplicationConfig";

export const PolygonMainnetChain = ApplicationConfig.defaultChain;
export const PolygonTestnetChain = ApplicationConfig.polygonTestnet;
export const DefaultChain = ApplicationConfig.defaultChain;

export function toMainnetChainId(chainId: number) {
  let _chainId = chainId;
  switch (chainId) {
    case 421610:
      _chainId = 42161;
      break;

    default:
      _chainId = 42161;
  }
  return _chainId;
}
