/* eslint-disable @typescript-eslint/no-explicit-any */

import { ITenderlySampleRequest } from "@/interface/tenderly.interface";
import { axiosTenderlyInstance } from "@/services/tenderlyAxios";
import { ethers } from "ethers";
import { errorDecoder } from "./web3ErrorHandler";
import * as Sentry from "@sentry/react";
import { UsdcToken } from "@/constants/token";
import ContractConfig from "@/contract/ContractConfig";
import { IMyTeams } from "@/redux/myTeams/interface";
import { PlayerProps } from "@/interface/player.interface";

export const buildParameter = (totalPlayerList: PlayerProps[]) => {
  const playerIds = totalPlayerList
    .filter((player) => player.isMain)
    .map((player) => Number(player.id));
  const substitutes = totalPlayerList
    .filter((player) => player.isSubs)
    .map((player) => Number(player.id));
  const captainId = totalPlayerList.find((player) => player.isCaptain)?.id;
  const viceCaptainId = totalPlayerList.find(
    (player) => player.isViceCaptain
  )?.id;
  const captainIndex = playerIds.indexOf(Number(captainId));
  const viceCaptainIndex = playerIds.indexOf(Number(viceCaptainId));
  return {
    captainIndex,
    viceCaptainIndex,
    playerIds: playerIds,
    substitutes: substitutes,
  };
};

export const createTransactionsArray = async ({
  isPaid,
  needToApprove,
  contestContract,
  provider,
  contestAddress,
  fee,
  selectedTeams,
  contestId,
  buildParameter,
}: {
  needToApprove: boolean;
  isPaid: boolean;
  contestContract: ethers.Contract;
  provider: ethers.JsonRpcProvider;
  contestAddress: string;
  fee: number;
  selectedTeams: IMyTeams[];
  contestId: string;
  buildParameter: (totalPlayerList: PlayerProps[]) => {
    captainIndex: number;
    viceCaptainIndex: number;
    playerIds: number[];
    substitutes: number[];
  };
}) => {
  const transactions: {
    to: string;
    data: string;
    value: number;
  }[] = [];
  if (needToApprove && isPaid) {
    const usdcTokenContract = new ethers.Contract(
      UsdcToken.address,
      ContractConfig.asset.ERC20.abi,
      provider
    );
    const approveUsdcTx = await usdcTokenContract?.approve.populateTransaction(
      contestAddress,
      fee * 200 * 10 ** UsdcToken.decimals
    );
    const tx1 = {
      to: UsdcToken.address,
      data: approveUsdcTx.data,
      value: 0,
    };

    transactions.push(tx1);
  }
  const abiCoder = new ethers.AbiCoder();
  selectedTeams?.forEach(async (item) => {
    const createTeamAndJoinTx =
      await contestContract.createTeamAndJoin.populateTransaction(
        contestId,
        buildParameter(item?.totalPlayers),
        abiCoder.encode(
          ["string"],
          [
            JSON.stringify({
              name: item.name,
            }),
          ]
        )
      );

    const amount = 0;
    const tx1 = {
      to: contestAddress,
      data: createTeamAndJoinTx.data,
      value: amount,
    };

    transactions.push(tx1);
  });

  return transactions;
};

export const isMultiTransactionValid = async (
  transactions: ITenderlySampleRequest[],
  transactionContext: any,
  contestContract: ethers.Contract,
  contestId: any,
  parammeter: any,
  encodedData: any,
  smartAccountAddress: string
) => {
  if (transactions?.length === 1) {
    try {
      await contestContract.createTeamAndJoin.estimateGas(
        contestId,
        parammeter,
        encodedData,
        {
          from: smartAccountAddress,
        }
      );
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const err = await errorDecoder.decode(error);
      console.log("caught error: ", err);
      transactionContext.dispatch({
        status: "error",
        txContent: err.reason, // error.errorName
        state: "failed",
      });
      Sentry.captureException(err);

      return false;
    }
  } else {
    try {
      const transactionResponse = await axiosTenderlyInstance.post("", {
        simulations: transactions,
      });

      const isVerified = transactionResponse?.data?.simulation_results?.every(
        (simulation: { simulation: { status: boolean } }) =>
          simulation?.simulation?.status === true
      );
      if (isVerified) {
        return true;
      } else {
        transactionContext.dispatch({
          status: "error",
          txContent: "Transaction Reverted or not confirmed", // error.errorName
          state: "failed",
        });
        return false;
      }
    } catch (err) {
      transactionContext.dispatch({
        status: "error",
        txContent: "Transaction Reverted or not confirmed", // error.errorName
        state: "failed",
      });
      Sentry.captureException(err);

      console.debug(err);
      return false;
    }
  }
};

export const createTransactionsArrayRejoin = async ({
  contestContract,

  contestAddress,

  selectedTeams,
  contestId,
  buildParameter,
  transactionContext,
  rejoinTeamId,
}: {
  contestContract: ethers.Contract;

  contestAddress: string;
  fee: number;
  selectedTeams: IMyTeams[];
  contestId: string;
  buildParameter: (totalPlayerList: PlayerProps[]) => {
    captainIndex: number;
    viceCaptainIndex: number;
    playerIds: number[];
    substitutes: number[];
  };
  transactionContext: any;
  rejoinTeamId: number;
}) => {
  const transactions: {
    to: string;
    data: string;
    value: number;
  }[] = [];
  try {
    const abiCoder = new ethers.AbiCoder();
    selectedTeams?.forEach(async (item) => {
      try {
        const createTeamAndJoinTx =
          await contestContract.updateUserTeam.populateTransaction(
            contestId,
            rejoinTeamId,
            buildParameter(item?.totalPlayers),
            abiCoder.encode(
              ["string"],
              [
                JSON.stringify({
                  name: item.teamHash,
                }),
              ]
            )
          );

        const amount = 0;
        const tx1 = {
          to: contestAddress,
          data: createTeamAndJoinTx.data,
          value: amount,
        };

        transactions.push(tx1);
      } catch (err) {
        console.log(err);
        transactionContext.dispatch({
          status: "error",
          txContent: "Transaction populate fauilure",
          state: "failed",
        });
        return [];
      }
    });

    return transactions;
  } catch (err) {
    console.log(err);
    transactionContext.dispatch({
      status: "error",
      txContent: err,
      state: "failed",
    });
    return [];
  }
};

// const transactionsArray = await createTransactionsArray({
//   isPaid: isPaid!,
//   needToApprove: needToApprove as boolean,
//   contestAddress: contestAddress,
//   contestContract: contestContract,
//   provider: provider,
//   contestId: contestId,
//   fee: fee,
//   selectedTeams: selectedTeams,
//   buildParameter: buildParameter,
// });

export const isMultiTransactionValidUserCreated = async (
  transactions: ITenderlySampleRequest[],
  transactionContext: any,
  contestContract: ethers.Contract,

  parammeter: any,
  encodedData: any,
  smartAccountAddress: string,
  matchId: string,
  fee: number,
  maxteams: number,
  gameplayTypeAddress: string,
  receiverAddress: string
) => {
  if (transactions?.length === 1) {
    try {
      await contestContract.createUserContestAndJoin.estimateGas(
        matchId,
        fee,
        maxteams,
        receiverAddress,
        gameplayTypeAddress,
        parammeter,
        encodedData,
        {
          from: smartAccountAddress,
        }
      );
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const err = await errorDecoder.decode(error);
      console.log("caught error: ", err);
      transactionContext.dispatch({
        status: "error",
        txContent: err.reason, // error.errorName
        state: "failed",
      });
      Sentry.captureException(err);

      return false;
    }
  } else {
    try {
      const transactionResponse = await axiosTenderlyInstance.post("", {
        simulations: transactions,
      });

      const isVerified = transactionResponse?.data?.simulation_results?.every(
        (simulation: { simulation: { status: boolean } }) =>
          simulation?.simulation?.status === true
      );
      if (isVerified) {
        return true;
      } else {
        transactionContext.dispatch({
          status: "error",
          txContent: "Transaction Reverted or not confirmed", // error.errorName
          state: "failed",
        });
        return false;
      }
    } catch (err) {
      transactionContext.dispatch({
        status: "error",
        txContent: "Transaction Reverted or not confirmed", // error.errorName
        state: "failed",
      });
      Sentry.captureException(err);

      console.debug(err);
      return false;
    }
  }
};

export const isMultiTransactionValidPredict = async (
  transactions: ITenderlySampleRequest[],
  transactionContext: any,
  contestContract: ethers.Contract,

  smartAccountAddress: string,
  matchId: number,
  selectedOption: number,
  amountInvested: number
) => {
  if (transactions?.length === 1) {
    try {
      await contestContract.createUserContestAndJoin.estimateGas(
        matchId,
        selectedOption,
        amountInvested ,
        {
          from: smartAccountAddress,
        }
      );
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const err = await errorDecoder.decode(error);
      console.log("caught error: ", err);
      transactionContext.dispatch({
        status: "error",
        txContent: err.reason, // error.errorName
        state: "failed",
      });
      Sentry.captureException(err);

      return false;
    }
  } else {
    try {
      const transactionResponse = await axiosTenderlyInstance.post("", {
        simulations: transactions,
      });

      const isVerified = transactionResponse?.data?.simulation_results?.every(
        (simulation: { simulation: { status: boolean } }) =>
          simulation?.simulation?.status === true
      );
      if (isVerified) {
        return true;
      } else {
        transactionContext.dispatch({
          status: "error",
          txContent: "Transaction Reverted or not confirmed", // error.errorName
          state: "failed",
        });
        return false;
      }
    } catch (err) {
      transactionContext.dispatch({
        status: "error",
        txContent: "Transaction Reverted or not confirmed", // error.errorName
        state: "failed",
      });
      Sentry.captureException(err);

      console.debug(err);
      return false;
    }
  }
};
