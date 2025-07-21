import React, { useMemo, useEffect, useContext } from "react";

import { generateAddressSummary } from "../utility/stringFormat";
import { DefaultChain } from "../contract/ChainConfig";
import { useAccount } from "wagmi";
import { FixTypeLater } from "@/interface/common.interface";

export const ChainIdMap = {
  polygon: 137,
  "polygon-mumbai": 80001,
  "polygon-amoy": 80002,
};
const WebThreeContext = React.createContext(null);
export const chainLocalNameMap: FixTypeLater = {
  137: {
    chaquenLocalName: "Polygon",
    coingeckoLocalName: "polygon",
  },
  80001: {
    chaquenLocalName: "Polygon Mumbai",
    coingeckoLocalName: "polygon",
  },
  80002: {
    chaquenLocalName: "Amoy Testnet",
    coingeckoLocalName: "polygon",
  },
};
const WebThreeProvider = (props: FixTypeLater) => {
  // const { account, chainId, library } = useEthers();

  const { address: account, chain } = useAccount();

  const chainId = useMemo(() => {
    if (chain) {
      return chain.id;
    }
    return DefaultChain.id;
  }, [chain]);

  // console.debug('Now ChainId: ', chainId);

  const contextWrapper: FixTypeLater = useMemo(
    () => ({
      account: account || "",
      summaryAccount: generateAddressSummary(account),
      chainId: account ? chainId || DefaultChain.id : DefaultChain.id,
      chainName: chainLocalNameMap[chainId]?.chaquenLocalName || "Unknown",
      chainNameInCoingecko:
        chainLocalNameMap[chainId]?.coingeckoLocalName || "arbitrum-one",
      // web3Provider: library,
    }),
    [account, chainId]
  );

  useEffect(() => {
    console.debug(
      `current connection info: account => `,
      account,
      `chainId => `,
      chainId
    );
  }, [account, chainId]);

  // useEffect(() => {
  //     if (library) {
  //         window.dappWeb3Provider = library;
  //     }
  // }, [library]);

  return (
    <WebThreeContext.Provider value={contextWrapper}>
      {props.children}
    </WebThreeContext.Provider>
  );
};

export const useWeb3Context = (): FixTypeLater => useContext(WebThreeContext);

export default WebThreeProvider;
