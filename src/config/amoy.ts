import { defineChain } from "viem";


export const amoy = /*#__PURE__*/ defineChain({  id: 80002,
  name: 'amoy',
  network: 'maticmum',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://polygon-amoy.g.alchemy.com/v2'],
      webSocket: ['wss://polygon-amoy.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://polygon-amoy.infura.io/v3'],
      webSocket: ['wss://polygon-amoy.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.ankr.com/polygon_amoy'],
    },
    public: {
      http: ['https://rpc.ankr.com/polygon_amoy'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'polygonscan',
      url: 'https://amoy.polygonscan.com/',
    },
    default: {
      name: 'polygonscan',
      url: 'https://amoy.polygonscan.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 25770160,
    },
  },
  testnet: true,
})