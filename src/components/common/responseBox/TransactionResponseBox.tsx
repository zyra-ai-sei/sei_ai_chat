import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getChatHistory } from "@/redux/chatData/action";
import React, { useEffect, useRef, useMemo, useState } from "react";
import TransactionCanvas from "./components/TransactionCanvas";
import TransactionLoader from "@/assets/chat/transactionLoader.png";
import { useAccount, useChainId } from "wagmi";
import QuickActionsGrid from "@/components/chat/QuickActionsGrid";
import { getChainById } from "@/config/chains";
import DisplaySwitch from "./components/DisplaySwitch";
import DataOutputRenderer from "./components/DataOutputRenderer";

const TransactionResponseBox = () => {
  // Only select the specific token value to avoid re-renders when other globalData properties change
  const chats = useAppSelector((data) => data.chatData.chats);
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevChatsCountRef = useRef(0);
  const chainId = useChainId();
  const network = getChainById(chainId);

  const [display, setDisplay] = useState('home');

  useEffect(() => {
    if (address)
      dispatch(getChatHistory({ address: address!, network: network?.id }));
  }, [address]);

  // Memoize chat count to avoid unnecessary re-renders
  const chatsCount = useMemo(() => chats.length, [chats.length]);

  // Calculate total counts of outputs to trigger display switch only when new content is generated
  const outputMetrics = useMemo(() => {
    return chats.reduce(
      (acc:any, chat:any) => ({
        toolCount: acc.toolCount + (chat?.response?.tool_outputs?.length || 0),
        dataCount: acc.dataCount + (chat?.response?.data_output ? 1 : 0),
      }),
      { toolCount: 0, dataCount: 0 }
    );
  }, [chats]);

  const prevOutputMetricsRef = useRef({ toolCount: 0, dataCount: 0 });

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

  // Pro-level trigger: Switch to 'canvas' only when tool_outputs or data_output counts actually increase
  useEffect(() => {
    const { toolCount, dataCount } = outputMetrics;
    const prev = prevOutputMetricsRef.current;

    if (toolCount > prev.toolCount || dataCount > prev.dataCount) {
      setDisplay("canvas");
    }

    // Always update ref to track the latest state
    prevOutputMetricsRef.current = { toolCount, dataCount };
  }, [outputMetrics]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative z-30 flex flex-col justify-start w-full h-full gap-6 py-2 pr-4 mx-auto overflow-y-auto scrollbar-none"
    >
      <DisplaySwitch display={display} setDisplay={setDisplay}/>
      {display == 'home' && (
        <>
          <QuickActionsGrid />
        </>
      )}

      {display == 'canvas' &&
        chats.map((chat: any, idx: number) => {
          const hasToolOutputs = chat?.response?.tool_outputs && chat.response.tool_outputs.length > 0;
          const hasDataOutput = !!chat?.response?.data_output;
          const isLoading = chat?.toolOutputsLoading && hasToolOutputs;

          if (!hasToolOutputs && !hasDataOutput && !isLoading) {
            return null;
          }

          return (
            <React.Fragment key={idx}>
              <div className="w-full">
                {isLoading && (
                  <div className="flex items-center justify-center p-8 h-[250px]">
                    <div className="relative flex items-center justify-center animate-ping">
                      <div className="absolute left-auto right-auto w-6 h-6 bg-white rounded-full " />
                      <img src={TransactionLoader} className="transform " />
                    </div>
                  </div>
                )}
                {hasToolOutputs && (
                  <TransactionCanvas
                    txns={chat.response.tool_outputs}
                    chatIndex={idx}
                  />
                )}
                {hasDataOutput && (
                  <div className="w-full">
                    <DataOutputRenderer
                      data={chat.response.data_output}
                      chatIndex={idx}
                    />
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
