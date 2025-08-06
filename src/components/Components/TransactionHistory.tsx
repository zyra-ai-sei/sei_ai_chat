import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getTransactions } from "@/redux/transactionData/action";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Arrow from "@/assets/home/downArrow.svg?react";

const TransactionHistory = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(
    (state) => state.transactionData.transactions
  );
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);

  useEffect(() => {
    dispatch(getTransactions());
  }, []);
  return (
    <div className="flex flex-col gap-2 h-[48%] p-2 border-gray-500/50 ">
      <h1 className="text-white/80 text-[20px] font-semibold">Transactions</h1>
      <div className="relative flex flex-col gap-3 overflow-auto">
        {transactions?.map((transaction, index) => (
          <div key={index} className="p-2 rounded-md bg-white/10">
            <div className="flex w-[100%] justify-between ">
              <div className="w-[80%]">
                <h1 className="text-white truncate">{transaction.hash}</h1>
                {transaction.timestamp && (
                  <span className="ml-2 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(transaction.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>
              <Arrow
                onClick={() =>
                  setCurrentIndex((prev) => (prev === index ? null : index))
                }
                className={`text-white ${currentIndex === index ? "" : "-rotate-90"} transition-all text-[32px]`}
              />
            </div>
            <div
              className={`flex flex-col gap-2 ${currentIndex === index ? "" : "h-0 absolute opacity-0 -z-30"} transition-all  duration-100 text-white/80`}
            >
              <div
                className="relative flex gap-2 font-bold cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(transaction.blockNumber || "");
                  setCopiedIndex(transaction?.blockNumber!);
                  setTimeout(() => setCopiedIndex(null), 1200);
                }}
                title="Copy address"
              >
                {" "}
                Block:{" "}
                <span className="px-2 font-thin truncate rounded-full bg-white/30">
                  {transaction.blockNumber}
                </span>
                {copiedIndex === transaction?.blockNumber && (
                  <span className="absolute right-0 px-2 ml-2 text-xs rounded-full bottom-2 text-white/80 bg-white/5 backdrop-blur-md">
                    Copied!
                  </span>
                )}
              </div>
              {transaction?.value && (
                <div
                  className="relative flex gap-2 font-bold cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.value || "");
                    setCopiedIndex(transaction?.value!);
                    setTimeout(() => setCopiedIndex(null), 1200);
                  }}
                  title="Copy address"
                >
                  {" "}
                  value:{" "}
                  <span className="px-2 font-thin truncate rounded-full bg-white/30">
                    {Number(transaction.value).toExponential()}
                  </span>
                    {copiedIndex === transaction?.value && (
                    <span className="absolute right-0 px-2 ml-2 text-xs rounded-full bottom-2 text-white/80 bg-white/5 backdrop-blur-md">
                      Copied!
                    </span>
                  )}
                </div>
              )}
              {transaction?.from && (
                <div
                  className="flex gap-2 font-bold cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.from || "");
                    setCopiedIndex(transaction?.from!);
                    setTimeout(() => setCopiedIndex(null), 1200);
                  }}
                  title="Copy address"
                >
                  from:
                  <span className="relative px-2 font-thin truncate rounded-full bg-white/30">
                    {transaction.from}
                  </span>
                  {copiedIndex === transaction?.from && (
                    <span className="absolute right-0 px-2 ml-2 text-xs rounded-full bottom-2 text-white/80 bg-white/5 backdrop-blur-md">
                      Copied!
                    </span>
                  )}
                </div>
              )}
              {transaction?.to && (
                <div
                  className="relative flex gap-2 font-bold cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.to || "");
                    setCopiedIndex(transaction?.to!);
                    setTimeout(() => setCopiedIndex(null), 1200);
                  }}
                  title="Copy address"
                >
                  to:{" "}
                  <span className="px-2 font-thin truncate rounded-full bg-white/30">
                    {transaction.to}
                  </span>
                  {copiedIndex === transaction?.to && (
                    <span className="absolute right-0 px-2 ml-2 text-xs rounded-full bottom-3 text-white/80 bg-white/5 backdrop-blur-md">
                      Copied!
                    </span>
                  )}
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
