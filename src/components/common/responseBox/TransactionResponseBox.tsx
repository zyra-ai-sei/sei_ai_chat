import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getChatHistory } from "@/redux/chatData/action";
import React, { useEffect, useRef, useMemo } from "react";
import TransactionCanvas from "./components/TransactionCanvas";
import TransactionLoader from "@/assets/chat/transactionLoader.png";
import { useAccount, useChainId } from "wagmi";
import TokenVisualization from "@/components/tokenVisualization/TokenVisualization";
import QuickActionsGrid from "@/components/chat/QuickActionsGrid";
import DcaSimulationPanel from "@/components/strategy/DcaSimulationPanel";
import LumpSumSimulationPanel from "@/components/strategy/LumpSumSimulationPanel";
import { DcaResponse } from "@/types/dca";
import { LumpSumResponse } from "@/types/lumpsum";
import { getChainById } from "@/config/chains";

// Helper function to check if data is DCA simulation data
const isDcaData = (data: any): data is DcaResponse => {
  const isDca = (
    data &&
    typeof data === "object" &&
    "summary" in data &&
    "chartData" in data &&
    "projections" in data &&
    data.summary &&
    "total_investment" in data.summary &&
    "buy_count" in data.summary &&
    "average_buy_price" in data.summary &&
    "total_tokens" in data.summary
  );
  
  return isDca;
};

// Helper function to check if data is Lump Sum simulation data
const isLumpSumData = (data: any): data is LumpSumResponse => {
  const isLumpSum = (
    data &&
    typeof data === "object" &&
    "summary" in data &&
    "chartData" in data &&
    "projections" in data &&
    data.summary &&
    "total_investment" in data.summary &&
    "buy_price" in data.summary &&
    "tokens_bought" in data.summary &&
    !("buy_count" in data.summary) &&
    !("average_buy_price" in data.summary) &&
    !("total_tokens" in data.summary)
  );

  return isLumpSum;
};

const TransactionResponseBox = () => {
  // Only select the specific token value to avoid re-renders when other globalData properties change
  const token = useAppSelector((state) => state?.globalData?.data?.token);
  const chats = useAppSelector((data) => data.chatData.chats);
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevChatsCountRef = useRef(0);
  const chainId = useChainId();
  const network = getChainById(chainId)

  useEffect(() => {
    if(address)
    dispatch(getChatHistory({address:address!, network: network?.id}));
  }, [token, address]);

  // Memoize chat count to avoid unnecessary re-renders
  const chatsCount = useMemo(() => chats.length, [chats.length]);

  // Auto-scroll to bottom only when new chat is added
  useEffect(() => {
    if (
      scrollContainerRef.current &&
      chatsCount > prevChatsCountRef.current &&
      chatsCount > 0
    ) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
    prevChatsCountRef.current = chatsCount;
  }, [chatsCount]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative z-30 flex flex-col justify-start w-full h-full gap-6 py-2 pr-4 mx-auto overflow-y-auto scrollbar-none"
    >
      {!chats.some(
        (chat) => (chat.response.tool_outputs || chat.response.data_output)
      ) && (
        <>
          <QuickActionsGrid/>
        </>
      )}

      {chats.length > 0 &&
        chats.map((chat, idx) => {
          // Debug logging for data_output
          if (chat?.response?.data_output) {
            console.log(
              `[TransactionResponseBox] Chat ${idx} has data_output:`,
              {
                hasDataOutput: !!chat.response.data_output,
                dataType: typeof chat.response.data_output,
                fullData: chat.response.data_output,
                hasSummary: !!chat.response.data_output?.summary,
                summaryKeys: chat.response.data_output?.summary ? Object.keys(chat.response.data_output.summary) : [],
                hasChartData: !!chat.response.data_output?.chartData,
                hasProjections: !!chat.response.data_output?.projections,
              }
            );
          }

          return (
            <React.Fragment key={idx}>
              <div>
                {chat?.toolOutputsLoading &&
                  chat?.response?.tool_outputs?.length &&
                  chat?.response?.tool_outputs?.length > 0 && (
                    <div className="flex items-center justify-center p-8 h-[250px]">
                      <div className="relative flex items-center justify-center animate-ping">
                        <div className="absolute left-auto right-auto w-6 h-6 bg-white rounded-full " />
                        <img src={TransactionLoader} className="transform " />
                      </div>
                    </div>
                  )}
                {chat?.response?.tool_outputs &&
                  chat?.response?.tool_outputs.length > 0 && (
                    <TransactionCanvas
                      txns={chat.response.tool_outputs}
                      chatIndex={idx}
                    />
                  )}
                {chat?.response?.data_output && (
                  <div className="mt-4">
                    {(() => {

                      if (isDcaData(chat.response.data_output)) {
                        return (
                          <DcaSimulationPanel
                            data={chat.response.data_output}
                            coinSymbol={(chat.response.data_output as any).coin || "Token"}
                            coinName={(chat.response.data_output as any).coinName || "Cryptocurrency"}
                          />
                        );
                      } else if (isLumpSumData(chat.response.data_output)) {
                        return (
                          <LumpSumSimulationPanel
                            data={chat.response.data_output}
                            coinSymbol={(chat.response.data_output as any).coin || "Token"}
                            coinName={(chat.response.data_output as any).coinName || "Cryptocurrency"}
                          />
                        );
                      } else {
                        return <TokenVisualization data={chat.response.data_output} chatIndex={idx} />;
                      }
                    })()}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default TransactionResponseBox;
