import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getChatHistory } from "@/redux/chatData/action";
import React, { useEffect, useRef, useMemo } from "react";
import TransactionCanvas from "./components/TransactionCanvas";
import TransactionLoader from "@/assets/chat/transactionLoader.png";
import { useAccount } from "wagmi";

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
      className="relative z-30 flex flex-col justify-start flex-grow w-full gap-6 py-2 pr-4 mx-auto overflow-y-auto scrollbar-none"
    >
      {chats.length > 0 &&
        chats.map((chat, idx) => (
          <React.Fragment key={idx}>
            <div>
              {chat?.toolOutputsLoading &&
                !chat?.response?.tool_outputs?.length && (
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
