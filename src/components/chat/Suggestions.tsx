import { useAppDispatch } from "@/hooks/useRedux";
import { sendChatPrompt } from "@/redux/chatData/action";

const Suggestions = () => {
  const dispatch = useAppDispatch();
  const balanceQueries = [
    "What is my USDC balance ?",
    "What tokens do I currently hold?",
  ];
  const simpleTransactions = [
    "Send 50 UDSC to 0x0..00",
    "Send 10 WSEI to 0x0..00 and 20 USDC to 0x0..11",
  ];
  const tradings = [
    "Place market order for 10 USDC with 2 hour deadline",
    "Create a market order for 15 USDC with 1 week deadline",
  ];
  return (
    <div className="flex flex-col gap-2 h-[48%] border-b p-2 border-gray-500/50 ">
      <h1 className="text-white/80 text-[20px] font-semibold">Suggestions</h1>
      <div className="flex flex-col gap-3 overflow-auto">
        <h1 className="font-semibold text-white/50 text-[16px]">
          Balance Queries
        </h1>
        <p className="flex flex-col gap-2">
          {balanceQueries.map((prompt) => (
            <div onClick={()=> dispatch(sendChatPrompt({ prompt }))} className="bg-white/10 cursor-pointer rounded-[5px] p-2 text-[12px]">
              {prompt}
            </div>
          ))}
        </p>
        <h1 className="font-semibold text-white/50 text-[16px]">
          Simple Transactions
        </h1>
        <p className="flex flex-col gap-2">
          {simpleTransactions.map((prompt) => (
            <div onClick={()=> dispatch(sendChatPrompt({ prompt }))} className="bg-white/10 cursor-pointer rounded-[5px] p-2 text-[12px]">
              {prompt}
            </div>
          ))}
        </p>
        <h1 className="font-semibold text-white/50 text-[16px]">Trading</h1>
        <p className="flex flex-col gap-2">
          {tradings.map((prompt) => (
            <div onClick={()=> dispatch(sendChatPrompt({ prompt }))} className="bg-white/10 cursor-pointer rounded-[5px] p-2 text-[12px]">
              {prompt}
            </div>
          ))}
        </p>
      </div>
    </div>
  );
};

export default Suggestions;
