import { useContext, useEffect, useMemo, useState } from "react";

import { Contract, ethers } from "ethers";

// import TransactionContext from '../Transaction/TransactionContext';
import ERC20Token_abi from "../contract/abi/ERC20Token_abi";

import ContractConfig from "../contract/ContractConfig";
import BigNumber from "bignumber.js";
import { useWeb3Context } from "./useWeb3Context";
import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { FixTypeLater } from "../interface/common.interface";
import TransactionContext from "../components/common/Transaction/TransactionContext";
import * as Sentry from "@sentry/react";

/**
 * send a new transaction
 * @param contract
 * @param functionName
 * @param txContent
 * @param txOptions
 * @param txType    REC20|CONTRACT_INTERACTION
 * @param onSuccess
 */

type IConfiguredContract = {
  abi: FixTypeLater[];
  theAddress?: `0x${string}` | undefined | FixTypeLater;
  address?: (chainId: number) => `0x${string}` | undefined | FixTypeLater;
};
export function useContractSend(
  configuredContract: IConfiguredContract,
  callMethod: string,
  txContent?: string,
  onSuccess?: FixTypeLater,
  txType?: string,
  onFailure?: FixTypeLater,
  isPaid?: boolean
) {
  const transactionContext: FixTypeLater = useContext(TransactionContext);
  const web3Context = useWeb3Context();

  const contractAddress =
    configuredContract?.theAddress ||
    (configuredContract?.address &&
      configuredContract.address(web3Context.chainId)) ||
    undefined;

  const [status, setStatus] = useState("idle");
  const {
    // state,
    // send: doSend,
    // events,
    writeContract: doSend,
    // status,
    data,
  } = useWriteContract();
  const { status: waitStatus } = useWaitForTransactionReceipt({
    chainId: web3Context.chainId,
    hash: data,
  });

  useEffect(() => {
    setStatus(waitStatus);
  }, [waitStatus]);

  const [sharedData, setSharedData] = useState({});

  const sendAndShareData = (
    _sharedData: FixTypeLater,
    ...args: FixTypeLater
  ) => {
    console.debug(`send proxy...`);
    setSharedData(_sharedData);
    transactionContext.dispatch({
      status: "submit",
      txContent: txContent,
      txType,
      isPaid: isPaid,
    });
    doSend({
      address: contractAddress,
      abi: configuredContract?.abi,
      functionName: callMethod,
      args,
    });
  };

  const send = (...args: FixTypeLater) => {
    sendAndShareData({}, ...args);
  };

  useEffect(() => {
    // console.debug(`current tx state => `, state, `events => `, events);

    transactionContext.dispatch({
      data,
      txContent: txContent,
      txType: txType,
      status,
      isPaid: isPaid,

      onSuccess: () => {
        onSuccess && onSuccess(data, sharedData);
      },
      onFailure: () => {
        onFailure && onFailure();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { state: status, send, sendAndShareData };
}

export function useConfiguredContract(configuredContract: FixTypeLater) {
  const web3Context = useWeb3Context();
  const contractAddress =
    configuredContract?.theAddress ||
    (configuredContract?.address &&
      configuredContract.address(web3Context.chainId)) ||
    undefined;
  const contract =
    contractAddress && new Contract(contractAddress, configuredContract?.abi);
  return contract;
}

/**
 * Fetch contract from ContractConfig, and send a transaction
 * @param configuredContract
 * @param callMethod
 * @param txContent
 * @param txOptions
 * @param onSuccess
 * @returns {{state: import("..").TransactionStatus, send: (...args: Params<TypedContract, ContractFunctionNames<T>>) => Promise<TransactionReceipt | undefined>}}
 */
export function useConfiguredContractSend(
  configuredContract: FixTypeLater,
  callMethod: string,
  txContent?: FixTypeLater,
  onSuccess?: FixTypeLater,
  onFailure?: FixTypeLater,
  isPaid?: boolean
) {
  // const contract = useConfiguredContract(configuredContract);
  return useContractSend(
    configuredContract,
    callMethod,
    txContent,
    onSuccess,
    "CONTRACT_INTERACTION",
    onFailure,
    isPaid
  );
}

export function useTokenContractSend(
  tokenAddress: number,
  callMethod: string,
  txContent?: string,
  onSuccess?: FixTypeLater,
  isPaid?: boolean
) {
  const configuredContract = {
    theAddress: tokenAddress,
    abi: ERC20Token_abi,
  } as IConfiguredContract;
  return useContractSend(
    configuredContract,
    callMethod,
    txContent,
    onSuccess,
    "REC20",
    () => {},
    isPaid
  );
}

// const buildDefaultProvider = (web3Context: FixTypeLater) => {
//   console.debug(web3Context);
//   return undefined;
//   // TODO need to extend here, to support multi chains.
//   // if(web3Context.account){
//   //     return undefined;
//   // }
//   //
//   // let provider = new providers.StaticJsonRpcProvider(
//   //     DefaultChain.rpcUrl,
//   //     {
//   //         chainId: DefaultChain.chainId,
//   //         name: DefaultChain.chainName,
//   //     }
//   // );
//   // // console.debug(`created default provider => `, provider);
//   // return provider;
// };

/**
 * call contract function and fetch data
 * @param configuredContract
 * @param callMethod
 * @param args
 * @returns {*}
 */
export function useContractCall(
  configuredContract: FixTypeLater,
  callMethod: string,
  args?: FixTypeLater | FixTypeLater[]
) {
  const web3Context = useWeb3Context();
  const contractAddress =
    configuredContract?.theAddress ||
    (configuredContract?.address &&
      configuredContract.address(web3Context.chainId)) ||
    undefined;

  //   const provider = contractAddress && buildDefaultProvider(web3Context);
  const { data, error } =
    useReadContract(
      {
        address: contractAddress,
        abi: configuredContract.abi,
        functionName: callMethod,
        args: args,
      }

      // contractAddress && {
      //     contract: new Contract(contractAddress, configuredContract.abi, provider),
      //     method: callMethod,
      //     args: args ?? [],
      // },
    ) ?? {};

  if (error) {
    console.error(error.message);
    Sentry.captureException(error);
    return undefined;
  }
  return data;
}

/**
 * e.g
 *  1.  const getPositionIdsCallsResult = useContractCalls({
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 0]
        },{
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 1]
        });
 *  2. const getPositionIdsCallsResult = useContractCalls([{
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 0]
        },{
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 1]
        }]);
 *
 * @param calls
 * @returns {*}
 */
export function useContractCalls(...calls: FixTypeLater[]) {
  const web3Context = useWeb3Context();

  const __calls =
    calls && calls.length && calls[0] instanceof Array ? calls[0] : calls;

  let _calls =
    __calls?.map((call) => {
      const contractAddress =
        call?.contract?.theAddress ||
        (call?.contract?.address &&
          call?.contract.address(web3Context.chainId)) ||
        undefined;
      //   const provider = contractAddress && buildDefaultProvider(web3Context);
      return (
        contractAddress && {
          address: contractAddress,
          abi: call.contract.abi,
          functionName: call?.callMethod,
          args: call?.args ?? [],
        }
      );
    }) ?? [];
  _calls = _calls.filter((call) => call);

  const { data }: FixTypeLater = useReadContracts({ contracts: _calls }) ?? [];

  return useMemo(() => {
    if (data && data.length === 0) {
      return [];
    }

    return data;
  }, [data]);
}

export const useApprove = (
  token: FixTypeLater,
  tokenInputAmount: FixTypeLater,
  userAddress: string,
  spender: FixTypeLater,
  approveTitle: string,
  onApproved?: FixTypeLater,
  onFailure?: FixTypeLater
) => {
  const [needToApprove, setNeedToApprove] = useState<FixTypeLater>(false);
  const [loaded, setLoaded] = useState(false);

  const tokenAddress = token?.address;

  const checkApprove = () => {
    return new Promise((resolve) => {
      if (
        token?.native ||
        !tokenAddress ||
        tokenAddress === "0x0000000000000000000000000000000000000000"
      ) {
        resolve(false);
        return;
      }

      const polygonRpc = import.meta.env?.VITE_BASE_POLYGON_RPC;
      const provider = new ethers.JsonRpcProvider(polygonRpc);
      const tokenContract = new Contract(
        tokenAddress,
        ContractConfig.asset.ERC20.abi,
        provider
      );

      tokenContract
        .allowance(userAddress, spender)
        .then((allowance: FixTypeLater) => {
          const allowanceNb = new BigNumber(allowance?._hex, 6);

          const tokenAmount = tokenInputAmount?.tokenAmount
            ? tokenInputAmount?.tokenAmount
            : tokenInputAmount;

          const isNeedApprove = allowance < tokenAmount;

          console.debug(
            `checkApprove: address =>`,
            tokenAddress,
            `spender =>`,
            spender,
            `checkAmount =>`,
            tokenAmount,
            `allowance =>`,
            allowance,
            `allowanceNb =>`,
            allowanceNb.toFixed(),
            `isNeedApprove =>`,
            isNeedApprove
          );

          resolve(isNeedApprove);
        })
        .catch((e: FixTypeLater) => {
          console.error(e);
          onFailure();
          Sentry.captureException(e);
          resolve(false);
        });
    });
  };

  const doCheckApprove = () => {
    checkApprove().then((isNeedApprove) => {
      setNeedToApprove(isNeedApprove);
      setLoaded(true);
    });
  };

  const { send: sendApprove, sendAndShareData: sendAndShareDataForApprove } =
    useTokenContractSend(
      tokenAddress,
      "approve",
      approveTitle,
      (events: FixTypeLater, sharedData: FixTypeLater) => {
        checkApprove().then((isNeedApprove: FixTypeLater) => {
          setNeedToApprove(isNeedApprove);

          onApproved && onApproved(events, sharedData);
          // if (!isNeedApprove) {
          //   onApproved && onApproved(events, sharedData);
          // }
        });
      },
      true
    );
  useEffect(() => {
    doCheckApprove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, tokenInputAmount, spender]);


  return {
    loaded,
    needToApprove,
    checkApprove,
    send: sendApprove,
    sendAndShareData: sendAndShareDataForApprove,
  };
};
