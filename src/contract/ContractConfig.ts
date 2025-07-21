import ApplicationConfig from "../ApplicationConfig";
import ContractAddressConfig_Polygon from "./ContractAddressConfig_Polygon";

import LP_token_abi from "./abi/LP_token_abi";

import ERC20Token_abi from "./abi/ERC20Token_abi";

import { FixTypeLater } from "../interface/common.interface";

import ContractAddressConfig_PolygonTestnet from "./ContractAddressConfig_PolygonTestnet";
import ContractAddressConfig_AmoyTestnet from "./ContractAddressConfig_AmoyTestnet";
import League_abi from "./abi/League_abi";
import Predict_abi from "./abi/Predict_abi";

const ChainAddressMap: FixTypeLater = {
  137: {
    name: "Polygon",
    addressConfig: ContractAddressConfig_Polygon,
  },
  80001: {
    name: "Polygon Testnet",
    addressConfig: ContractAddressConfig_PolygonTestnet,
  },
  80002: {
    name: "Amoy Testnet",
    addressConfig: ContractAddressConfig_AmoyTestnet,
  },
};

const getChainAddress = (chainId: number | string) => {
  const _chainId = chainId || ApplicationConfig.defaultChain.id;
  return ChainAddressMap[_chainId] && ChainAddressMap[_chainId].addressConfig;
};

const ContractConfig = {
  etherscan: (chainId: number) => {
    const _chainId = chainId || ApplicationConfig.defaultChain.id;
    return (
      ChainAddressMap[_chainId] &&
      ChainAddressMap[_chainId].addressConfig.etherscan
    );
  },
  asset: {
    ERC20: {
      name: "ERC20 Token",
      abi: ERC20Token_abi,
    },
    LP: {
      name: "LP Token",
      abi: LP_token_abi,
    },
    /**
     * get asset config. e.g.:
     *      ContractConfig.asset.getAsset('SPA')
     *      ContractConfig.asset.getAsset('ETH-SPA@Uniswap')
     * @param name
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getAsset: (name: string) => {
      if (name.indexOf("@") > 0) {
        const dexName = name.split("@")[1];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return ContractConfig.asset[`LP_${dexName}`];
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return ContractConfig.asset[name];
      }
    },
    USDC: {
      name: "USDC",
      des: "Native USD Coin",
      decimals: 6,
      abi: ERC20Token_abi,
      increaseAllowanceMethod: "approve",
      isStableCoin: true,
      getCoinUrl: "https://www.coingecko.com/en/coins/usd-coin#markets",
      address(_: FixTypeLater, chainId: number) {
        return (
          ChainAddressMap[chainId || ApplicationConfig.defaultChain.id] &&
          ChainAddressMap[chainId || ApplicationConfig.defaultChain.id]
            .addressConfig.asset["USDC"]
        );
      },
    },
  },
  Chaquen: {
    Contest: {
      name: "Contest",
      abi: League_abi,
      address(chainId: number) {
        const addressConfig = getChainAddress(chainId);
        return addressConfig && addressConfig?.Chaquen?.Contest;
      },
    },
    Predict: {
      name: "Predict",
      abi: Predict_abi,
      address(chainId: number) {
        const addressConfig = getChainAddress(chainId);
        return addressConfig && addressConfig?.Chaquen?.Predict;
      },
    },
  },
};

export default ContractConfig;
