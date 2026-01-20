import { wagmiConfig } from "@/config/wagmiConfig";
import { formatBalance } from "@/utility/formatBalance";
import { useEffect, useState } from "react";
import { Address, erc20Abi } from "viem";
import { readContract } from "viem/actions";
import { useAccount, useBalance, useReadContracts, useChainId } from "wagmi";
import ContractIcon from "@/assets/tokens/contract.svg?react";
import CopyToClipboard from "react-copy-to-clipboard";
import TooltipCustom from "../common/tooltip";
import seiIcon from "@/assets/tokens/sei.png";
import { SeiToken } from "@/constants/token";
import { useAppSelector } from "@/hooks/useRedux";
import { selectTokensByChain } from "@/redux/tokenData/reducer";


const ORACLE_PRECOMPILE_ADDRESS: `0x${string}` =
  "0x0000000000000000000000000000000000001008";

export const ORACLE_PRECOMPILE_ABI = [
  {
    inputs: [],
    name: "getExchangeRates",
    outputs: [
      {
        components: [
          { internalType: "string", name: "denom", type: "string" },
          {
            components: [
              { internalType: "string", name: "exchangeRate", type: "string" },
              { internalType: "string", name: "lastUpdate", type: "string" },
              {
                internalType: "int64",
                name: "lastUpdateTimestamp",
                type: "int64",
              },
            ],
            internalType: "struct IOracle.OracleExchangeRate",
            name: "oracleExchangeRateVal",
            type: "tuple",
          },
        ],
        internalType: "struct IOracle.DenomOracleExchangeRatePair[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "lookback_seconds", type: "uint64" },
    ],
    name: "getOracleTwaps",
    outputs: [
      {
        components: [
          { internalType: "string", name: "denom", type: "string" },
          { internalType: "string", name: "twap", type: "string" },
          { internalType: "int64", name: "lookbackSeconds", type: "int64" },
        ],
        internalType: "struct IOracle.OracleTwap[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const Assets = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  // Get tokens for the current chain from Redux
  const TokenList = useAppSelector(selectTokensByChain(chainId));

  const [updatedTokenList, setUpdatedTokenList] = useState<any[]>([]);
  const [nativeTokenData, setNativeTokenData] = useState<any>(null);
  const [exchangeRates, setExchangeRates] = useState<
    { denom: string; price: number; lastUpdate: Date; lastUpdateString: any }[]
  >([]);
  const [isAddressCopied, setIsAddressCopied] = useState<boolean>(false);
  const CopyToClipboardComponent =
    CopyToClipboard as unknown as React.ComponentType<any>;

  const contractData = TokenList.map((token) => {
    return {
      address: token.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address!],
    };
  });

  const { data, isFetched } = useReadContracts({
    contracts: contractData,
  });

  const seiBalance = useBalance({
    address: address as Address,
  })

  async function getCurrentPrices() {
    const result = await readContract(wagmiConfig.getClient(), {
      address: ORACLE_PRECOMPILE_ADDRESS,
      abi: ORACLE_PRECOMPILE_ABI,
      functionName: "getExchangeRates",
    });

    const rates = result.map((rate: any) => ({
      denom: rate.denom,
      price: parseFloat(rate.oracleExchangeRateVal.exchangeRate),
      lastUpdate: new Date(
        Number(rate.oracleExchangeRateVal.lastUpdateTimestamp) * 1000
      ),
      lastUpdateString: rate.oracleExchangeRateVal.lastUpdate,
    }));
    setExchangeRates(rates);
  }

  const handleCopy = () => {
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 3000);
  };

  useEffect(() => {
    if (data) {
       const seiPrice = exchangeRates.find(
          (rate) => rate.denom === SeiToken.denom
        )?.price;

        const seiData = {
          ...SeiToken,
          balanceAmount: seiBalance?.data ? parseFloat(formatBalance(seiBalance.data.value, seiBalance.data.decimals)).toFixed(6) : "0",
          balancePrice: seiBalance?.data && seiPrice ? String(
            (
              parseFloat(
                formatBalance(
                  seiBalance.data.value,
                  seiBalance.data.decimals
                )
              ) * seiPrice
            ).toFixed(6)
          ) : "0",
          price: seiPrice?.toPrecision(4)
        }

        setNativeTokenData(seiData);

      const newUpdatedTokenList = TokenList.map((token, index) => {
        const price = exchangeRates.find(
          (rate) => rate.denom === token.denom
        )?.price;
        return {
          ...token,
          balanceAmount: data[index]?.result
            ? parseFloat(
                formatBalance(data[index]?.result as bigint, token.decimals)
              ).toFixed(6)
            : "0",
          balancePrice:
            data[index]?.result && price
              ? String(
                  (
                    parseFloat(
                      formatBalance(
                        data[index]?.result as bigint,
                        token.decimals
                      )
                    ) * price
                  ).toFixed(6)
                )
              : "0",
          price: price?.toPrecision(4),
        };
      });
      setUpdatedTokenList(newUpdatedTokenList);
    }
  }, [isFetched, data, exchangeRates]);

  useEffect(() => {
    getCurrentPrices();
  }, []);


  return (
    <div className="flex-col flex-shrink-0 hidden gap-4 p-4 scrollbar-none lg:flex ">
      <h1 className="text-white/80 text-[20px] font-semibold">Assets</h1>
      {/* Native sei */}
      {
        <div
            className="flex items-start justify-between gap-6 p-2 text-white bg-gradient-to-r from-purple-200/10 to-purple-500/10 rounded-xl"
          >
            <div className="flex gap-3">
              <img src={seiIcon} className="size-[40px]" />
              <div>
                <p className="flex items-center gap-1 font-semibold text-white">
                  {nativeTokenData?.symbol}
                 <div className="font-light bg-white/10 text-[10px] px-1 py-[2px] rounded-sm text-white/50 mx-1">
                  native
                 </div>
                </p>
                <p className="text-[12px] text-white/60">
                  {nativeTokenData?.balanceAmount}
                </p>
                <p className="text-[12px] text-white/60">
                  {"$ "}
                  {nativeTokenData?.balancePrice}
                </p>
              </div>
            </div>
            <p className="font-thin text-[12px] text-white/60">
              {"$ "}
              {nativeTokenData?.price}
            </p>
          </div>
      }

      {updatedTokenList.length > 0 &&
        updatedTokenList?.map((token, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-6 p-2 text-white bg-gradient-to-r from-purple-200/10 to-purple-500/10 rounded-xl"
          >
            <div className="flex gap-3">
              <img src={token?.imageUrl} className="size-[40px]" />
              <div>
                <p className="flex items-center gap-1 font-semibold text-white">
                  {token.symbol}
                  <TooltipCustom
                    title={
                      <p className="text-center text-neutral-greys-950 typo-c1-regular w-">
                        {isAddressCopied ? "Copied" : "Copy"}
                      </p>
                    }
                    position="top"
                  >
                    <CopyToClipboardComponent
                      text={token.address!}
                      onCopy={handleCopy}
                    >
                      <ContractIcon className="h-[24px] w-[24px] cursor-pointer" />
                    </CopyToClipboardComponent>
                  </TooltipCustom>
                </p>
                <p className="text-[12px] text-white/60">
                  {token.balanceAmount}
                </p>
                <p className="text-[12px] text-white/60">
                  {"$ "}
                  {token.balancePrice}
                </p>
              </div>
            </div>
            <p className="font-thin text-[12px] text-white/60">
              {"$ "}
              {token.price}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Assets;
