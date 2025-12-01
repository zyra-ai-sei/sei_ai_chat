import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getChatHistory } from "@/redux/chatData/action";
import React, { useEffect, useRef, useMemo } from "react";
import TransactionCanvas from "./components/TransactionCanvas";
import TransactionLoader from "@/assets/chat/transactionLoader.png";
import avatarImg from "@/assets/home/avatar.png";
import { useAccount } from "wagmi";
import TokenVisualization from "@/components/tokenVisualization/TokenVisualization";

const TransactionResponseBox = () => {
  // Only select the specific token value to avoid re-renders when other globalData properties change
  const token = useAppSelector((state) => state?.globalData?.data?.token);
  const chats = useAppSelector((data) => data.chatData.chats);
  const {address} = useAccount()
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevChatsCountRef = useRef(0);

  useEffect(() => {
    dispatch(getChatHistory());
  }, [token, address]);

  // Memoize chat count to avoid unnecessary re-renders
  const chatsCount = useMemo(() => chats.length, [chats.length]);

  // Check if there's any transaction UI to display (tool outputs or loading state)
  const hasTransactionUI = useMemo(() => {
    return chats.some(
      (chat) =>
        chat?.toolOutputsLoading ||
        (chat?.response?.tool_outputs && chat.response.tool_outputs.length > 0)
    );
  }, [chats]);

  // Check if token visualization data is available
  const tokenVisualizationData = useAppSelector(
    (state) => state.tokenVisualization.currentToken
  );

  // Check if any chat has data_output (for crypto market data)
  const hasDataOutput = useMemo(() => {
    return chats.some((chat) => chat?.response?.data_output);
  }, [chats]);

  // Auto-scroll to bottom only when new chat is added
  useEffect(() => {
    if (scrollContainerRef.current && chatsCount > prevChatsCountRef.current && chatsCount > 0) {
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
      {/* Token Visualization - Show if tokenVisualizationData exists OR if any chat has data_output */}
      {(tokenVisualizationData || hasDataOutput) && <TokenVisualization />}

      {/* Centered Avatar when no transaction UI and no token visualization to display */}
      {!hasTransactionUI && !tokenVisualizationData && !hasDataOutput && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[160px] h-[160px]">
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-full blur-[32px] opacity-60 animate-pulse"
              style={{
                background:
                  "linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)",
              }}
            />
            {/* Avatar image with pulse */}
            <div className="relative w-[160px] h-[160px] flex items-center justify-center animate-pulse">
              <img
                src={avatarImg}
                alt="Zyra Avatar"
                className="w-[160px] h-[160px] object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      )}

      {chats.length > 0 &&
        chats.map((chat, idx) => (
          <React.Fragment key={idx}>
            <div>
              {chat?.toolOutputsLoading &&
                chat?.response?.tool_outputs?.length && chat?.response?.tool_outputs?.length > 0 && (
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
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};

export default TransactionResponseBox;
