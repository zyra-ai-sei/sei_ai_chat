import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getTransactions } from "@/redux/transactionData/action";
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import Arrow from "@/assets/home/downArrow.svg?react";
import { headerWalletAddressShrinker } from "@/utility/walletAddressShrinker";
import CopyIcon from "@/assets/common/copy.svg?react";
import CopyToClipboard from "react-copy-to-clipboard";
import TooltipCustom from "../common/tooltip";
import { useAccount } from "wagmi";

const TransactionHistory = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(
    (state) => state.transactionData.transactions
  );
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);
  const [isAddressCopied, setIsAddressCopied] = useState<boolean>(false);
  const {address} = useAccount()
  const globalData = useAppSelector(
    (state)=>state.globalData.data
  )

  const CopyToClipboardComponent =
    CopyToClipboard as unknown as React.ComponentType<any>;

  const handleCopy = () => {
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 3000);
  };

  useEffect(() => {
    dispatch(getTransactions());
  }, [address, globalData.token]);
  return (
    <div className="flex flex-col flex-shrink-0 gap-4 p-4 ">
      <h1 className="text-white/80 text-[20px] font-semibold">
        Transaction History
      </h1>
      <div className="relative flex flex-col gap-3 overflow-x-hidden overflow-y-scroll scrollbar-none ">
        {transactions?.map((transaction, index) => (
          <div key={index} className="p-2 rounded-md bg-purple-200/10">
            <div className="flex justify-between w-full px-2">
              <div className="">
                <h1 className="flex items-center gap-2 text-white">
                  {headerWalletAddressShrinker(transaction.hash)}
                  <TooltipCustom
                    title={
                      <p className="text-center text-neutral-greys-950 typo-c1-regular w-">
                        {isAddressCopied ? "Copied" : "Copy"}
                      </p>
                    }
                    position="top"
                  >
                    <CopyToClipboardComponent
                      text={transaction.hash}
                      onCopy={handleCopy}
                    >
                      <CopyIcon className="h-[14px] w-[14px]" />
                    </CopyToClipboardComponent>
                  </TooltipCustom>
                </h1>
                {transaction.timestamp && (
                  <span className="ml-2 text-xs text-gray-400">
                    {formatDistanceToNow(parseISO(transaction.timestamp), {
                      addSuffix: true,
                      includeSeconds: true,
                    })}
                  </span>
                )}
              </div>
              <Arrow
                onClick={() =>
                  setCurrentIndex((prev) => (prev === index ? null : index))
                }
                className={`text-white/60 ${currentIndex === index ? "" : "-rotate-90"} transition-all text-[32px]`}
              />
            </div>
            <div
              className={`flex flex-col gap-2 ${currentIndex === index ? "max-h-[500px]" : "max-h-0 absolute opacity-0 -z-30"} transition-all w-full duration-100 text-white/80`}
            >
              <div
                className="relative flex gap-2 font-bold "
                title="Copy address"
              >
                <p className="min-w-[45px]"> Block: </p>
                <TooltipCustom
                  title={
                    <p className="text-center text-neutral-greys-950 typo-c1-regular w-">
                      {copiedIndex === transaction?.blockNumber
                        ? "Copied"
                        : "Copy"}
                    </p>
                  }
                  position="top"
                >
                  <span
                    onClick={() => {
                      navigator.clipboard.writeText(
                        transaction.blockNumber || ""
                      );
                      setCopiedIndex(transaction?.blockNumber!);
                      setTimeout(() => setCopiedIndex(null), 1200);
                    }}
                    className="px-2 py-1 font-thin truncate rounded-sm cursor-pointer bg-white/10"
                  >
                    {transaction.blockNumber}
                  </span>
                </TooltipCustom>
              </div>
              {transaction?.value && (
                <div
                  className="relative flex gap-2 font-bold cursor-pointer"
                  title="Copy address"
                >
                  <p className="min-w-[45px]"> value: </p>
                  <TooltipCustom
                    title={
                      <p className="text-center text-neutral-greys-950 typo-c1-regular w-">
                        {copiedIndex === transaction?.value ? "Copied" : "Copy"}
                      </p>
                    }
                    position="top"
                  >
                    <span
                      onClick={() => {
                        navigator.clipboard.writeText(transaction.value || "");
                        setCopiedIndex(transaction?.value!);
                        setTimeout(() => setCopiedIndex(null), 1200);
                      }}
                      className="px-2 font-thin truncate rounded-sm cursor-pointer bg-white/10"
                    >
                      {Number(transaction.value).toExponential()}
                    </span>
                  </TooltipCustom>
                </div>
              )}
              {transaction?.from && (
                <div
                  className="flex gap-2 font-bold cursor-pointer"
                  title="Copy address"
                >
                  <p className="min-w-[45px]">from:</p>
                  <TooltipCustom
                    title={
                      <p className="text-center text-neutral-greys-950 typo-c1-regular w-">
                        {copiedIndex === transaction?.from ? "Copied" : "Copy"}
                      </p>
                    }
                    position="top"
                  >
                    <span
                      onClick={() => {
                        navigator.clipboard.writeText(transaction.from || "");
                        setCopiedIndex(transaction?.from!);
                        setTimeout(() => setCopiedIndex(null), 1200);
                      }}
                      className="relative px-2 py-1 font-thin truncate rounded-sm bg-white/10"
                    >
                      {headerWalletAddressShrinker(transaction.from)}
                    </span>
                  </TooltipCustom>
                </div>
              )}
              {transaction?.to && (
                <div
                  className="relative flex gap-2 font-bold cursor-pointer"
                  title="Copy address"
                >
                  <p className="min-w-[45px]">to: </p>
                  <TooltipCustom
                    title={
                      <p className="text-center text-neutral-greys-950 typo-c1-regular w-">
                        {copiedIndex === transaction?.to ? "Copied" : "Copy"}
                      </p>
                    }
                    position="top"
                  >
                    <span
                      onClick={() => {
                        navigator.clipboard.writeText(transaction.to || "");
                        setCopiedIndex(transaction?.to!);
                        setTimeout(() => setCopiedIndex(null), 1200);
                      }}
                      className="px-2 py-1 font-thin truncate rounded-sm bg-white/10"
                    >
                      {headerWalletAddressShrinker(transaction.to)}
                    </span>
                  </TooltipCustom>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
