import ApplicationConfig from "../ApplicationConfig";
import ContractAddressConfig_Polygon from "./ContractAddressConfig_Polygon";
import { FixTypeLater } from "../interface/common.interface";

import ContractAddressConfig_PolygonTestnet from "./ContractAddressConfig_PolygonTestnet";
import ContractAddressConfig_AmoyTestnet from "./ContractAddressConfig_AmoyTestnet";

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

const ContractConfig = {
  etherscan: (chainId: number) => {
    const _chainId = chainId || ApplicationConfig.defaultChain.id;
    return (
      ChainAddressMap[_chainId] &&
      ChainAddressMap[_chainId].addressConfig.etherscan
    );
  },
};

export default ContractConfig;
