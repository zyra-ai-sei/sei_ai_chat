import { ethers } from "ethers";

const RPC_URL_Mapping = {
  RPCForPolygonMainnet: "https://polygon-mainnet.infura.io",
  RPCForPolygonTestnet:
    "https://polygon-mumbai.g.alchemy.com/v2/C6JkI6zFki_-P7Bxdyw1wASHvTw-3K1w",
};

export const ChainId_RPC_Mapping = {
  137: RPC_URL_Mapping.RPCForPolygonMainnet,
  80001: RPC_URL_Mapping.RPCForPolygonTestnet,
};

const provider = window.ethereum
  ? new ethers.BrowserProvider(window.ethereum)
  : new ethers.JsonRpcProvider(RPC_URL_Mapping.RPCForPolygonMainnet);

export default {
  provider,
  RPCForPolygonMainnet: RPC_URL_Mapping.RPCForPolygonMainnet,
  RPCForPolygonTestnet: RPC_URL_Mapping.RPCForPolygonTestnet,

  defaultChain: {
    id: 137,
    name: "Polygon",
    network: "matic",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: {
      alchemy: {
        http: ["https://polygon-mainnet.g.alchemy.com/v2"],
        webSocket: ["wss://polygon-mainnet.g.alchemy.com/v2"],
      },
      infura: {
        http: ["https://polygon-mainnet.infura.io/v3"],
        webSocket: ["wss://polygon-mainnet.infura.io/ws/v3"],
      },
      default: {
        http: ["https://polygon-rpc.com"],
      },
      public: {
        http: ["https://polygon-rpc.com"],
      },
    },
    blockExplorers: {
      etherscan: {
        name: "PolygonScan",
        url: "https://polygonscan.com",
      },
      default: {
        name: "PolygonScan",
        url: "https://polygonscan.com",
      },
    },
    contracts: {
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 25770160,
      },
    },
  },
  polygonTestnet: {
    id: 80001,
    name: "Polygon Mumbai",
    network: "maticmum",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: {
      alchemy: {
        http: ["https://polygon-mumbai.g.alchemy.com/v2"],
        webSocket: ["wss://polygon-mumbai.g.alchemy.com/v2"],
      },
      infura: {
        http: ["https://polygon-mumbai.infura.io/v3"],
        webSocket: ["wss://polygon-mumbai.infura.io/ws/v3"],
      },
      default: {
        http: ["https://rpc.ankr.com/polygon_mumbai"],
      },
      public: {
        http: ["https://rpc.ankr.com/polygon_mumbai"],
      },
    },
    blockExplorers: {
      etherscan: {
        name: "PolygonScan",
        url: "https://mumbai.polygonscan.com",
      },
      default: {
        name: "PolygonScan",
        url: "https://mumbai.polygonscan.com",
      },
    },
    contracts: {
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 25770160,
      },
    },
    testnet: true,
  },

  tokenListURIUniswap: "https://tokens.uniswap.org",

  renamedTokens: {
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8": {
      symbol: "USDC",
      rename: "USDC.e",
    },
  },

  // defaultApproveAllowance: '1000000000000000000',
  defaultApproveAllowance: "10000000000000000000000000000",
  // defaultApproveThreshold: '100000000000000000000000000',
  defaultApproveThreshold: "1000000000000000000000",

  enableRegionBlocker: true,
  blockedRegions: ["US"],

  SPARewardsManager: "0x5b12d9846F8612E439730d18E1C12634753B1bF1",

  maxNumberPickerValue: 9999999999,
  defaultDebounceWait: 500,

  farmStartTimeBuffer: 1200,

  popupWindowWidth: 576,
  popupWindowWidthForLiquidity: 620,

  // unit: millisecond
  localPriceTTL: 3600000,
  pageLoadingTime: 2000,
  homepageLoadingTime: 2000,
  totalCredits: 100,
  showForeignPlayer: true,
  regularTeamSize: 11,
  maxSubstitutePlayerSize: 2,
  maxPlayerPerTeam: 6,
  maxPlayerPerType: 8,

  minBowlers: 2,
  maxBowlers: 6,
  minBatters: 0,
  maxBatters: 5,
  minWicketKeepers: 1,
  maxWicketKeepers: 6,
  minAllRounders: 0,
  maxAllRounders: 8,
  minBattersWicketKeepersAllRounders: 5,
  minBowlersAllRounders: 5,
  maxForeignPlayers: 0,
};
