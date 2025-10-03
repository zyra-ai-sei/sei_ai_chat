import { ToolOutput } from "@/redux/chatData/reducer";
import { getArgNames } from "@/utility/getArgNames";
import { useAccount, useSendTransaction, useWriteContract } from "wagmi";
import TextInput from "../../input/TextInput";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import {
  updateTransactionStatus,
  updateTransactionData,
  completeTool,
  abortTool,
} from "@/redux/chatData/action";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import TransactionStatus from "../../status/TransactionStatus";
import { headerWalletAddressShrinker } from "@/utility/walletAddressShrinker";
import TickIcon from "@/assets/popup/Tick.svg?react";
import ErrorIcon from "@/assets/popup/failed.svg?react";
import ExternalIcon from "@/assets/button/external.svg?react";
import GetInputComponent from "./GetInputComponent";
import { addTxn } from "@/redux/transactionData/action";

const TransactionForm = ({
  txn,
  txnIndex,
  chatIndex,
  isExecuting,
}: {
  txn: ToolOutput;
  txnIndex?: number;
  chatIndex: number;
  isExecuting?: boolean;
}) => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const { writeContract } = useWriteContract({
    mutation: {
      onError: () => {
        console.log(`Transaction ${txnIndex} writeContract error`);
        // Update status in Redux store
        if (txnIndex !== undefined) {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.ERROR,
            })
          );
          dispatch(abortTool({ toolId: String(txn.id) }));
        }
      },
      onSuccess: (data) => {
        if (data) {
          dispatch(addTxn(data as string));
          dispatch(completeTool({ hash: data, toolId: String(txn.id) }));
        }
        console.log(`Transaction ${txnIndex} writeContract success`);
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
        console.log(`Transaction ${txnIndex} writeContract settled:`, data);
        if (data) {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.SUCCESS,
                txHash: data as string,
              })
            );
          }
        } else {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.ERROR,
              })
            );
          }
        }
      },
    },
  });

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onError: () => {
        console.log(`Transaction ${txnIndex} sendTransaction error`);
        // Update status in Redux store
        if (txnIndex !== undefined) {
          dispatch(
            updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.ERROR,
            })
          );
          dispatch(abortTool({ toolId: String(txn.id) }));
        }
      },
      onSuccess: (data) => {
        if (data) {
          dispatch(addTxn(data as string));
          dispatch(completeTool({ hash: data, toolId: String(txn.id) }));
        }
        console.log(`Transaction ${txnIndex} sendTransaction success`);
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
        console.log(`Transaction ${txnIndex} sendTransaction settled:`, data);
        if (data) {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.SUCCESS,
                txHash: data as string,
              })
            );
          }
        } else {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(
              updateTransactionStatus({
                chatIndex,
                toolOutputIndex: txnIndex,
                status: StatusEnum.ERROR,
              })
            );
          }
        }
      },
    },
  });

  // Debug logging for status changes
  useEffect(() => {
    console.log(
      `Transaction ${txnIndex} status changed:`,
      txn?.status,
      `isExecuting:`,
      isExecuting,
      `txHash:`,
      txn?.txHash
    );
  }, [txn?.status, isExecuting, txn?.txHash, txnIndex]);

  // Handler functions for each field
  const handleToChange = (value: string) => {
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "to",
          value,
        })
      );
    }
  };

  const handleAddressChange = (value: string) => {
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "address",
          value,
        })
      );
    }
  };

  const handleFunctionNameChange = (e: any) => {
    console.log("final state", e.target.value);
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "functionName",
          value: String(e.target.value),
        })
      );
    }
  };

  const handleValueChange = (value: string) => {
    if (txnIndex !== undefined) {
      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "value",
          value,
        })
      );
    }
  };

  // Handle argument changes
  const handleArgChange = (index: number, value: string) => {
    if (txnIndex !== undefined) {
      const currentArgs = txn?.transaction?.args || [];
      const newArgs = [...currentArgs];

      // Check if args is an array of arrays (for complex arguments)
      if (Array.isArray(newArgs[0])) {
        const firstArgArray = [...newArgs[0]];
        firstArgArray[index] = value;
        newArgs[0] = firstArgArray;
      } else {
        // Simple args array - check if it's an object or direct value
        if (typeof newArgs[index] === "object" && newArgs[index] !== null) {
          // It's an object, update the value property
          newArgs[index] = { ...newArgs[index], value };
        } else {
          // It's a direct value, set it directly
          newArgs[index] = value;
        }
      }

      console.log("final state,", newArgs);

      dispatch(
        updateTransactionData({
          chatIndex,
          toolOutputIndex: txnIndex,
          field: "args",
          value: newArgs,
        })
      );
    }
  };

  const handleSubmission = () => {
    if (txn?.transaction?.abi) {
      writeContract({
        abi: txn?.transaction?.abi!,
        address: txn?.transaction?.address as Address,
        functionName: txn?.transaction?.functionName,
        args: txn?.transaction?.args || [],
      });
    } else {
      sendTransaction({
        to: txn?.transaction?.to as Address,
        value: BigInt(txn?.transaction?.value || "0"),
      });
    }
  };

  const visibleFields = [
    { type: "from", visible: true },
    { type: "to", visible: !!txn?.transaction?.to },
    { type: "address", visible: !!txn?.transaction?.address },
    { type: "function", visible: !!txn?.transaction?.functionName },
    { type: "value", visible: !!txn?.transaction?.value },
  ].filter((field) => field.visible);

  const totalFields = visibleFields.length;

  console.log(
    `Transaction ${txnIndex}: status=${txn?.status}, isExecuting=${isExecuting}, txHash=${txn?.txHash}`
  );

  return (
    <div>
      <div className="flex items-center justify-between ">
        <h1 className="font-semibold">Unsigned Transaction</h1>
        <TransactionStatus status={txn?.status || StatusEnum.PENDING} />
      </div>
      <div className="flex flex-wrap ">
        <TextInput
          disabled={true}
          title="From"
          val={address || ""}
          onChange={() => {}}
          className={`w-full md:${totalFields % 2 === 1 ? "w-full" : "w-[calc(50%-0.5rem)]"}`}
        />
        {txn?.transaction?.to && (
          <GetInputComponent
            type={txn?.metadata?.types?.to || "address"}
            title="To"
            val={txn?.transaction?.to || ""}
            onChange={handleToChange}
          />
        )}
        {txn?.transaction?.address && (
          <GetInputComponent
            disabled={true}
            type={txn?.metadata?.types?.address || "address"}
            title="Contract"
            val={txn?.transaction?.address || ""}
            onChange={handleAddressChange}
            className="w-full md:w-[calc(50%-0.5rem)]"
          />
        )}
        {txn?.transaction?.functionName && (
          <GetInputComponent
            disabled={true}
            type="string"
            title="Function"
            val={txn?.transaction?.functionName || ""}
            onChange={handleFunctionNameChange}
            className="w-full md:w-[calc(50%-0.5rem)]"
          />
        )}
        {txn?.transaction?.value && (
          <GetInputComponent
            type="uint256"
            title="Value"
            val={txn?.transaction?.value || ""}
            onChange={handleValueChange}
            className="w-full md:w-[calc(50%-0.5rem)]"
          />
        )}
        {txn?.transaction?.args && txn.transaction?.args.length > 0 && (
          <div className="w-full p-2 bg-black/30">
            <h1 className="font-semibold text-gray-300">Arguments</h1>
            <div className="flex flex-wrap w-full">
              {txn?.transaction?.abi
                ?.find(
                  (obj: any) =>
                    obj?.name == txn?.transaction?.functionName &&
                    obj?.type == "function"
                )
                .inputs.find((obj: any) => "components" in obj)?.components ? (
                <>
                  {txn.transaction?.args?.[0].map((_: any, index: any) => {
                    const argType =
                      txn?.metadata?.types?.args?.[index] || "default";
                    const argName = getArgNames(
                      txn?.transaction?.abi,
                      txn?.transaction?.functionName
                    )[index];
                    return (
                      <div
                        className="w-full md:w-[calc(50%-0.5rem)]"
                        key={`complex-arg-${index}`}
                      >
                        <GetInputComponent
                          disabled={false}
                          type={argType}
                          title={argName}
                          val={txn?.transaction?.args?.[0]?.[index] || ""}
                          onChange={(value: string) =>
                            handleArgChange(index, value)
                          }
                          className="w-full"
                        />
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {txn.transaction?.args.map((_, index) => {
                    const argType =
                      txn?.metadata?.types?.args[index] || "default";
                    const argName = getArgNames(
                      txn?.transaction?.abi,
                      txn?.transaction?.functionName
                    )[index];
                    return (
                      <div
                        className="w-full md:w-[calc(50%-0.5rem)]"
                        key={`arg-${index}`}
                      >
                        <GetInputComponent
                          disabled={false}
                          type={argType}
                          title={argName}
                          val={txn?.transaction?.args?.[index] || ""}
                          onChange={(value: string) =>
                            handleArgChange(index, value)
                          }
                          className="w-full"
                        />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        {(txn?.status === StatusEnum.PENDING || !txn?.status) &&
          !isExecuting && (
            <button
              onClick={handleSubmission}
              className="px-3 py-2 bg-purple-500 rounded-lg"
            >
              Execute Transaction
            </button>
          )}
        {isExecuting && (
          <div className="px-3 py-2 text-white bg-blue-500 rounded-lg">
            Executing in queue...
          </div>
        )}
        {txn?.status === StatusEnum.SUCCESS && (
          <div className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-lime-500/20 to-green-400/20">
            <div className="flex items-center gap-2">
              <TickIcon className="p-1 bg-green-800 rounded-full text-[24px]" />
              <h1 className="text-green-700">Transaction Successfull</h1>
            </div>
            <a
              href={`https://seitrace.com/tx/${txn?.txHash}`}
              target="_blank"
              className="flex items-center gap-2 cursor-pointer text-green-200/70"
            >
              {headerWalletAddressShrinker(txn?.txHash || "")}
              <ExternalIcon />
            </a>
          </div>
        )}
        {txn?.status === StatusEnum.ERROR && (
          <div className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-red-500/20 to-red-400/20">
            <div className="flex items-center gap-2">
              <ErrorIcon className="p-1 bg-red-800 rounded-full text-[24px]" />
              <h1 className="text-red-700">Transaction Failed</h1>
            </div>
            <a
              href={`https://seitrace.com/tx/${txn?.txHash?.toString()}`}
              target="_blank"
              className="flex items-center gap-2 cursor-pointer text-red-200/70"
            >
              {headerWalletAddressShrinker(txn?.txHash || "")}
              <ExternalIcon />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
