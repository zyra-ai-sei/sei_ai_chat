import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import TransactionCanvas from "./components/TransactionCanvas";
import TransactionLoader from "@/assets/chat/transactionLoader.png";
import QuickActionsGrid from "@/components/chat/QuickActionsGrid";
import DisplaySwitch from "./components/DisplaySwitch";
import DataOutputRenderer from "./components/DataOutputRenderer";
import AsyncDataLoader from "./components/AsyncDataLoader";
import { fetchPendingBatchForChats } from "@/redux/chatData/action";

const TransactionResponseBox = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((data) => data.chatData.chats);
  const unfetchedAsyncData = useAppSelector(
    (data) => data.chatData.unfetchedAsyncData,
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevChatsCountRef = useRef(0);
  const isFetchingRef = useRef(false);

  const [display, setDisplay] = useState("home");

  // Memoize chat count to avoid unnecessary re-renders
  const chatsCount = useMemo(() => chats.length, [chats.length]);

  // Calculate total counts of outputs to trigger display switch only when new content is generated
  const outputMetrics = useMemo(() => {
    return chats.reduce(
      (acc: any, chat: any) => ({
        toolCount: acc.toolCount + (chat?.response?.tool_outputs?.length || 0),
        dataCount: acc.dataCount + (chat?.response?.data_output ? 1 : 0),
        pendingCount:
          acc.pendingCount + (chat?.response?.pending_async_data?.length || 0),
      }),
      { toolCount: 0, dataCount: 0, pendingCount: 0 },
    );
  }, [chats]);

  const prevOutputMetricsRef = useRef({
    toolCount: 0,
    dataCount: 0,
    pendingCount: 0,
  });

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

  // Pro-level trigger: Switch to 'canvas' only when tool_outputs, data_output, or pending_async_data counts actually increase
  useEffect(() => {
    const { toolCount, dataCount, pendingCount } = outputMetrics;
    const prev = prevOutputMetricsRef.current;

    if (
      toolCount > prev.toolCount ||
      dataCount > prev.dataCount ||
      pendingCount > prev.pendingCount
    ) {
      setDisplay("canvas");
    }

    // Always update ref to track the latest state
    prevOutputMetricsRef.current = { toolCount, dataCount, pendingCount };
  }, [outputMetrics]);

  // Scroll handler for lazy loading - triggers when scrolling near top
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingRef.current) return;

    // Check if scrolled near the top (within 200px of top)
    const isNearTop = container.scrollTop < 200;

    if (isNearTop && unfetchedAsyncData.length > 0) {
      // Get unique chat indices that need fetching (prioritize older/lower indices)
      const chatIndicesToFetch = [
        ...new Set(unfetchedAsyncData.map((item) => item.chatIndex)),
      ]
        .sort((a, b) => a - b)
        .slice(0, 5); // Fetch up to 5 chats worth of data

      if (chatIndicesToFetch.length > 0) {
        isFetchingRef.current = true;
        dispatch(
          fetchPendingBatchForChats({ chatIndices: chatIndicesToFetch }) as any,
        ).finally(() => {
          isFetchingRef.current = false;
        });
      }
    }
  }, [dispatch, unfetchedAsyncData]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative z-30 flex flex-col justify-start w-full h-full gap-6 py-2 pr-4 mx-auto overflow-y-auto scrollbar-none"
    >
      <DisplaySwitch display={display} setDisplay={setDisplay} />
      {display == "home" && (
        <>
          <QuickActionsGrid />
        </>
      )}

      {display == "canvas" &&
        chats.map((chat: any, idx: number) => {
          const hasToolOutputs =
            chat?.response?.tool_outputs &&
            chat.response.tool_outputs.length > 0;
          const hasDataOutput = !!chat?.response?.data_output;
          const hasPendingAsyncData =
            chat?.response?.pending_async_data &&
            chat.response.pending_async_data.length > 0;
          const isLoading = chat?.toolOutputsLoading && hasToolOutputs;

          if (
            !hasToolOutputs &&
            !hasDataOutput &&
            !hasPendingAsyncData &&
            !isLoading
          ) {
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
                  <div id={`data-${idx}`} className="w-full">
                    <DataOutputRenderer
                      data={chat.response.data_output}
                      chatIndex={idx}
                    />
                  </div>
                )}
                {hasPendingAsyncData &&
                  chat.response.pending_async_data.map((asyncData: any) => (
                    <AsyncDataLoader
                      key={asyncData.executionId}
                      asyncData={asyncData}
                      chatIndex={idx}
                    />
                  ))}
              </div>
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default TransactionResponseBox;
