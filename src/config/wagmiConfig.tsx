import { createConfig, fallback } from "wagmi";
import { polygon, polygonMumbai } from "@wagmi/chains";

import { webSocket } from "wagmi";

import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { amoy } from "./amoy";
import { http } from "viem";
import { sei, seiTestnet } from "viem/chains";

export const wagmiConfig = createConfig({
  chains: [polygon, amoy, polygonMumbai, seiTestnet, sei],
  transports: {
    [polygon.id]: fallback([
      http(
        `https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
      webSocket(
        `wss://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
    ]),
    [amoy.id]: fallback([
      http(
        `https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
      webSocket(
        `wss://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
    ]),
    [polygonMumbai.id]: fallback([
      http(
        `https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
      webSocket(
        `wss://polygon-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
    ]),
    [sei.id]: fallback([
      http(
        `https://sei-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
      webSocket(
        `wss://sei-mainnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
    ]),
    [seiTestnet.id]: fallback([
      http(
        `https://sei-testnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
      webSocket(
        `wss://sei-testnet.g.alchemy.com/v2/${import.meta.env?.VITE_BASE_ALCHEMY_KEY}`
      ),
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
        name: "Chaquen",
        description: "Chaquen Dapp",
        url: "https://app.chaquen.io/",
        icons: ["https://app.chaquen.io/chaquen.svg"],
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
