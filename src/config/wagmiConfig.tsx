import { createConfig, fallback } from "wagmi";
import { polygon, polygonMumbai } from "@wagmi/chains";

import { webSocket } from "wagmi";

import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { amoy } from "./amoy";
import { http } from "viem";
import { arbitrum, arbitrumSepolia, base, mainnet, monadTestnet, opBNB, optimism, sei, seiTestnet, sepolia } from "viem/chains";

export const wagmiConfig = createConfig({
  chains: [polygon, amoy, polygonMumbai, seiTestnet, sei, arbitrum, mainnet, optimism, sepolia, arbitrumSepolia, base, monadTestnet, opBNB],
  
  transports: {
    [mainnet.id]: fallback([
      http(`https://eth-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://eth-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [optimism.id]: fallback([
      http(`https://opt-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://opt-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [arbitrum.id]: fallback([
      http(`https://arb-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://arb-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [sepolia.id]: fallback([
      http(`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://eth-sepolia.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [arbitrumSepolia.id]: fallback([
      http(`https://arb-sepolia.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://arb-sepolia.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [base.id]: fallback([
      http(`https://base-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://base-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [monadTestnet.id]: fallback([
      http(`https://monad-testnet.rpc.thirdweb.com`),
    ]),
    [opBNB.id]: fallback([
      http(`https://opbnb-mainnet-rpc.bnbchain.org`),
    ]),
    [polygon.id]: fallback([
      http(`https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [amoy.id]: fallback([
      http(`https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [polygonMumbai.id]: fallback([
      http(`https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [sei.id]: fallback([
      http(`https://sei-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://sei-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
    [seiTestnet.id]: fallback([
      http(`https://sei-testnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
      webSocket(`wss://sei-testnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`),
    ]),
  },

  connectors: [
    // particleGoogleWallet({
    //   shimDisconnect: true,
    //   chains: [polygon, polygonMumbai, amoy],
    //   options: {
    //     projectId: import.meta.env?.VITE_BASE_PARTICLE_PROJECT_ID as string,
    //     clientKey: import.meta.env?.VITE_BASE_PARTICLE_CLIENT_KEY as string,
    //     appId: import.meta.env?.VITE_BASE_PARTICLE_APP_ID as string,
    //     chainName: "Polygon",
    //     chainId: 137,
    //     wallet: {
    //       displayWalletEntry: false,
    //     },

    //     securityAccount: {
    //       promptSettingWhenSign: 0,

    //       promptMasterPasswordSettingWhenLogin: 0,
    //     },
    //   },
    // }),
    // particleWallet({
    //   shimDisconnect: true,
    //   chains: [polygon, polygonMumbai],
    //   options: {
    //     projectId: import.meta.env?.VITE_BASE_PARTICLE_PROJECT_ID as string,
    //     clientKey: import.meta.env?.VITE_BASE_PARTICLE_CLIENT_KEY as string,
    //     appId: import.meta.env?.VITE_BASE_PARTICLE_APP_ID as string,
    //     chainName: "Polygon",
    //     chainId: 137,
    //     wallet: {
    //       displayWalletEntry: false,
    //     },
    //     securityAccount: {
    //       promptSettingWhenSign: 0,
    //       promptMasterPasswordSettingWhenLogin: 0,
    //     },
    //   },
    // }),
    walletConnect({
      projectId: import.meta.env?.VITE_BASE_WALLETCONNECT_PROJECT_ID,
      customStoragePrefix: "wagmi",

      metadata: {
        name: "Zyra",
        description: "Zyra Dapp",
        url: "https://main.dcyp2gnn0vmnu.amplifyapp.com/",
        icons: ["https://main.dcyp2gnn0vmnu.amplifyapp.com/icon.svg"],
      },
      // showQrModal:false
    }),
    coinbaseWallet({
      appName: "wagmi",
    }),

    injected({
      shimDisconnect: true,
      target() {
        return {
          id: "okxwallet",
          name: "okxwallet",
          provider:
            typeof window !== "undefined"
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).okxwallet
              : undefined,
        };
      },
    }),
  ],
});
// merge-ceck
