import {ToolOutput } from "@/redux/chatData/reducer";
import { getArgNames } from "@/utility/getArgNames";
import { useAccount, useSendTransaction, useWriteContract } from "wagmi";
import TextInput from "../../input/TextInput";
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { updateTransactionStatus } from "@/redux/chatData/action";
import { Address } from "viem";
import { StatusEnum } from "@/enum/status.enum";
import TransactionStatus from "../../status/TransactionStatus";
import { headerWalletAddressShrinker } from "@/utility/walletAddressShrinker";
import TickIcon from "@/assets/popup/Tick.svg?react";
import ErrorIcon from "@/assets/popup/failed.svg?react";
import ExternalIcon from "@/assets/button/external.svg?react";
import GetInputComponent from "./GetInputComponent";

interface FormValues {
  to: { value: string; type: string };
  address: { value: string; type: string };
  functionName: { value: string; type: string };
  value: { value: string; type: string };
  args: any[];
}

const TransactionForm = ({
  txn,
  txnIndex,
  chatIndex,
  onFormValuesChange,
  isExecuting
}: {
  txn: ToolOutput;
  txnIndex?: number;
  chatIndex: number;
  onFormValuesChange?: (txnId: string, values: FormValues) => void;
  isExecuting?: boolean;
}) => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const [txData, setTxData] = useState("");
  const { writeContract } = useWriteContract({
    mutation: {
      onError: () => {
        console.log(`Transaction ${txnIndex} writeContract error`);
        // Update status in Redux store
        if (txnIndex !== undefined) {
          dispatch(updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.ERROR
          }));
        }
      },
      onSuccess: () => {
        console.log(`Transaction ${txnIndex} writeContract success`);
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
        console.log(`Transaction ${txnIndex} writeContract settled:`, data);
        if (data) {
          setTxData(data as string);
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.SUCCESS,
              txHash: data as string
            }));
          }
        } else {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.ERROR
            }));
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
          dispatch(updateTransactionStatus({
            chatIndex,
            toolOutputIndex: txnIndex,
            status: StatusEnum.ERROR
          }));
        }
      },
      onSuccess: () => {
        console.log(`Transaction ${txnIndex} sendTransaction success`);
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
        console.log(`Transaction ${txnIndex} sendTransaction settled:`, data);
        if (data) {
          setTxData(data as string);
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.SUCCESS,
              txHash: data as string
            }));
          }
        } else {
          // Update status in Redux store
          if (txnIndex !== undefined) {
            dispatch(updateTransactionStatus({
              chatIndex,
              toolOutputIndex: txnIndex,
              status: StatusEnum.ERROR
            }));
          }
        }
      },
    },
  });

  // Create state to track form values
  const [formValues, setFormValues] = useState({
    to: {
      value: txn?.transaction?.to || "",
      type: txn?.metadata?.types?.to || "address",
    },
    address: {
      value: txn?.transaction?.address || "",
      type: txn?.metadata?.types?.address || "address",
    },
    functionName: {
      value: txn?.transaction?.functionName || "",
      type: "string",
    },
    value: { value: txn?.transaction?.value || "", type: "uint256" },
    args: txn?.transaction?.args || [],
  });

  // Debug logging for status changes
  useEffect(() => {
    console.log(`Transaction ${txnIndex} status changed:`, txn?.status, `isExecuting:`, isExecuting, `txData:`, txData);
  }, [txn?.status, isExecuting, txData, txnIndex]);
  useEffect(() => {
    const newFormValues = {
      to: {
        value: txn?.transaction?.to || "",
        type: txn?.metadata?.types?.to || "address",
      },
      address: {
        value: txn?.transaction?.address || "",
        type: txn?.metadata?.types?.address || "address",
      },
      functionName: {
        value: txn?.transaction?.functionName || "",
        type: "string",
      },
      value: { value: txn?.transaction?.value || "", type: "uint256" },
      args: txn?.transaction?.args || [],
    };
    setFormValues(newFormValues);
    
    // Notify parent component of form values change
    if (onFormValuesChange && txnIndex !== undefined) {
      onFormValuesChange(txnIndex.toString(), newFormValues);
    }
  }, [txn, txnIndex, onFormValuesChange]);

  // Notify parent when form values change due to user interaction
  useEffect(() => {
    if (onFormValuesChange && txnIndex !== undefined) {
      onFormValuesChange(txnIndex.toString(), formValues);
    }
  }, [formValues, txnIndex, onFormValuesChange]);

  // Handler functions for each field
  const handleToChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, to: { ...prev.to, value } }));
  };

  const handleAddressChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, address: { ...prev.address, value } }));
  };

  const handleFunctionNameChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      functionName: { ...prev.functionName, value },
    }));
  };

  const handleValueChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, value: { ...prev.value, value } }));
  };

  // Handle argument changes
  const handleArgChange = (index: number, value: string) => {
    setFormValues((prev) => {
      const newArgs = [...prev.args];

      // Check if args is an array of arrays (for complex arguments)
      if (Array.isArray(newArgs[0]?.value)) {
        const firstArgArray = [...newArgs[0].value];
        firstArgArray[index] = value;
        newArgs[0] = { ...newArgs[0], value: firstArgArray };
      } else {
        // Simple args array
        newArgs[index] = { ...newArgs[index], value };
      }

      console.log("Updated args:", newArgs);
      return { ...prev, args: newArgs };
    });
  };

  const handleSubmission = () => {

    if (txn?.transaction?.abi) {
      writeContract({
        abi: txn?.transaction?.abi!,
        address: formValues.address.value as Address,
        functionName: formValues.functionName.value,
        args: formValues.args,
      });
    } else {
      sendTransaction({
        to: formValues.to.value as Address,
        value: BigInt(formValues.value.value),
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

  console.log(`Transaction ${txnIndex}: status=${txn?.status}, isExecuting=${isExecuting}, txData=${txData}`);

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
            type={formValues.to.type}
            title="To"
            val={formValues.to.value}
            onChange={handleToChange}
          />
        )}
        {txn?.transaction?.address && (
          <GetInputComponent
            type={formValues.address.type}
            title="Contract"
            val={formValues.address.value}
            onChange={handleAddressChange}
            className="w-full md:w-[calc(50%-0.5rem)]"
          />
        )}
        {txn?.transaction?.functionName && (
          <GetInputComponent
            type={formValues.functionName.type}
            title="Function"
            val={formValues.functionName.value}
            onChange={handleFunctionNameChange}
            className="w-full md:w-[calc(50%-0.5rem)]"
          />
        )}
        {txn?.transaction?.value && (
          <GetInputComponent
            type={formValues.value.type}
            title="Value"
            val={formValues.value.value}
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
                          type={argType}
                          title={argName}
                          val={formValues.args[0]?.[index] || ""}
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
                      <div className="w-full md:w-[calc(50%-0.5rem)]" key={`arg-${index}`}>
                        <GetInputComponent
                          type={argType}
                          title={argName}
                          val={formValues.args[index] || ""}
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
        {(txn?.status === StatusEnum.PENDING || !txn?.status) && !isExecuting && (
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
              href={`https://seitrace.com/tx/${txData || txn?.txHash}`}
              target="_blank"
              className="flex items-center gap-2 cursor-pointer text-green-200/70"
            >
              {headerWalletAddressShrinker(txData || txn?.txHash || "")}
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
              href={`https://seitrace.com/tx/${txData?.toString()}`}
              target="_blank"
              className="flex items-center gap-2 cursor-pointer text-red-200/70"
            >
              {headerWalletAddressShrinker(txData)}
              <ExternalIcon />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
