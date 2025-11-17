import { ToolOutput } from "@/redux/chatData/reducer";
import { getArgNames } from "@/utility/getArgNames";
import { useAccount, useSendTransaction, useWriteContract, useChainId } from "wagmi";
import TextInput from "../../input/TextInput";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  updateTransactionStatus,
  updateTransactionData,
  completeTool,
  abortTool,
} from "@/redux/chatData/action";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import { headerWalletAddressShrinker } from "@/utility/walletAddressShrinker";
import TickIcon from "@/assets/popup/Tick.svg?react";
import ErrorIcon from "@/assets/popup/failed.svg?react";
import ExternalIcon from "@/assets/button/external.svg?react";
import GetInputComponent from "./GetInputComponent";
import { addTxn } from "@/redux/transactionData/action";
import { setGlobalData } from "@/redux/globalData/action";

const TransactionForm = ({
  txn,
  txnIndex,
  chatIndex,
  isExecuting,
  hideExecuteButton = false,
}: {
  txn: ToolOutput;
  txnIndex?: number;
  chatIndex: number;
  isExecuting?: boolean;
  hideExecuteButton?: boolean;
}) => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token } = globalData || {};
  const chainId = useChainId();
  const correctChainId = Number(import.meta.env?.VITE_BASE_CHAIN_ID);
  const isWrongNetwork = Boolean(token && chainId !== correctChainId);
  const { writeContract } = useWriteContract({
    mutation: {
      onError: () => {
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
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
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
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
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
    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(setGlobalData({
        ...globalData,
        isNetworkSwitchWarningTriggered: true,
      }));
      return;
    }

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
      {/* Remove duplicate header and status - now handled by parent TransactionCard */}
      <div className="flex flex-wrap">
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
          <div className="w-full p-3 border rounded-lg bg-black/20 border-white/10">
            <h1 className="mb-2 text-sm font-semibold text-white/80">Arguments</h1>
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
        {!hideExecuteButton && (txn?.status === StatusEnum.PENDING || !txn?.status) &&
          !isExecuting && (
            <button
              onClick={handleSubmission}
              className="px-3 py-2 bg-purple-500 rounded-lg"
            >
              Execute Transaction
            </button>
          )}
        {!hideExecuteButton && isExecuting && (
          <div className="px-3 py-2 text-white bg-blue-500 rounded-lg">
            Executing in queue...
          </div>
        )}
        {txn?.status === StatusEnum.SUCCESS && (
          <div className="flex items-center justify-between w-full gap-3 px-4 py-3 border rounded-lg border-green-500/30 bg-green-500/10">
            <div className="flex items-center gap-2">
              <TickIcon className="p-1 bg-green-600 rounded-full text-[20px]" />
              <h1 className="text-sm font-medium text-green-400">Transaction Successful</h1>
            </div>
            <a
              href={`https://seitrace.com/tx/${txn?.txHash}`}
              target="_blank"
              className="flex items-center gap-2 transition-colors cursor-pointer text-green-300/80 hover:text-green-300"
            >
              <span className="text-xs">{headerWalletAddressShrinker(txn?.txHash || "")}</span>
              <ExternalIcon className="w-4 h-4" />
            </a>
          </div>
        )}
        {txn?.status === StatusEnum.ERROR && (
          <div className="flex items-center justify-between w-full gap-3 px-4 py-3 border rounded-lg border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-2">
              <ErrorIcon className="p-1 bg-red-600 rounded-full text-[20px]" />
              <h1 className="text-sm font-medium text-red-400">Transaction Failed</h1>
            </div>
            <a
              href={`https://seitrace.com/tx/${txn?.txHash?.toString()}`}
              target="_blank"
              className="flex items-center gap-2 transition-colors cursor-pointer text-red-300/80 hover:text-red-300"
            >
              <span className="text-xs">{headerWalletAddressShrinker(txn?.txHash || "")}</span>
              <ExternalIcon className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
