import { useAppSelector } from "@/hooks/useRedux";
import React, { useEffect, useRef, useMemo, useState } from "react";
import PromptSuggestion from "../PromptSuggestion/PromptSuggestion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "./helpers/markdownComponents";
import { cryptoHighlightStyles } from "./helpers/cryptoHighlighter";
import "highlight.js/styles/github-dark.css";
import iconSvg from "@/assets/icon.svg";
import GradientBorder from "../GradientBorder";
import { useTransactionNavigation } from "@/contexts/TransactionNavigationContext";

// Loading text animation states
const loadingTexts = [
  "Thinking",
  "Generating response",
  "Finalizing",
  "Summarizing",
];

const ChatIndicator = ({
  hasChat,
  toolOutputsLength,
  chatIndex,
  isLastChat,
  hasDataOutput,
  dataOutputType,
}: {
  hasChat: boolean;
  toolOutputsLength: number;
  chatIndex: number;
  isLastChat: boolean;
  hasDataOutput: boolean;
  dataOutputType?: string;
}) => {
  const [textIndex, setTextIndex] = useState(0);
  const { scrollToTransaction, scrollToDataOutput } = useTransactionNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 800); // Change text every 800ms

    return () => clearInterval(interval);
  }, []);

  const handleOpsClick = () => {
    if (toolOutputsLength > 0) {
      // Scroll to the first transaction
      scrollToTransaction(chatIndex, 0);
    }
  };
  const handleDataClick = () => {
    if (hasDataOutput) {
      // Scroll to the first transaction
      scrollToDataOutput(chatIndex);
    }
  };

  // Show loading state ONLY for the last chat when no response
  if (!hasChat && isLastChat) {
    return (
      <div className="flex items-center gap-3">
        <div className="animate-spin">
          <img src={iconSvg} alt="Zyra" className="w-8 h-8" />
        </div>
        <span className="text-[#7CABF9] text-sm font-light animate-pulse">
          {loadingTexts[textIndex]}...
        </span>
      </div>
    );
  }

  // Show avatar and ops info when chat response exists
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5">
        <img src={iconSvg} alt="Zyra AI" className="w-12 h-12" />
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        {toolOutputsLength > 0 && (
          <button
            onClick={handleOpsClick}
            className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/50 transition-all cursor-pointer hover:border-blue-400/40 hover:bg-blue-500/5 hover:text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#7CABF9]" />
            {toolOutputsLength} ops
          </button>
        )}
        
        {hasDataOutput && (
          <button
            onClick={handleDataClick}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.3em] transition-all cursor-pointer ${
              dataOutputType === "tweets"
                ? "border-blue-500/20 bg-blue-500/5 text-blue-400 hover:border-blue-400/40 hover:bg-blue-500/10"
                : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400/70 hover:border-emerald-400/40 hover:bg-emerald-500/10"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                dataOutputType === "tweets" ? "bg-blue-400" : "bg-emerald-400"
              }`}
            />
            {dataOutputType === "tweets" ? "Tweets" : "Data"}
          </button>
        )}
      </div>
    </div>
  );
};

const ChatInterfaceBox = () => {
  const chats = useAppSelector((data) => data.chatData.chats);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevChatsCountRef = useRef(0);
  const { scrollToTransaction, scrollToDataOutput } = useTransactionNavigation();

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
    <>
      <style>{cryptoHighlightStyles}</style>

      <div className="relative w-full h-full overflow-hidden border border-white/5 ">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(90,126,255,0.18),_transparent_55%)] blur-[60px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(transparent 95%, rgba(255,255,255,0.08) 96%), linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.08) 96%)",
            backgroundSize: "32px 32px",
          }}
        />

        <div
          ref={scrollContainerRef}
          className="relative z-30 flex flex-col justify-start w-full h-full gap-6 px-6 py-6 overflow-y-auto"
        >
        {chats.length > 0 ? (
          chats.map((chat, idx) => {
            const isLastChat = idx === chats.length - 1;
            const hasResponse = !!chat.response?.chat;
            const hasDataOutput = !!chat.response?.data_output;
            
            // Determine the response to display
            let displayResponse = "";
            if (hasResponse) {
              displayResponse = typeof chat.response.chat === "string" 
                ? chat.response.chat 
                : "Response format error from model";
            } else if (!isLastChat) {
              // For previous chats without response, show appropriate message
              displayResponse = "⚠️ Execution stopped or reverted. No response generated.";
            }

            return (
            <React.Fragment key={idx}>
              <div className="self-end w-fit max-w-[92%] rounded-2xl border border-white/10 bg-gradient-to-br from-[#161B2D]/90 via-[#0E1222]/90 to-[#090C16]/90 px-4 py-2 text-[14px] leading-6 text-white shadow-[0_10px_35px_rgba(14,18,34,0.8)]">
                <p className="break-words text-white/70">{chat.prompt}</p>
              </div>

              {/* AI Response with Figma Design - Dark Theme */}
              <div className="self-start flex w-fit min-w-[55%] max-w-[95%] flex-col gap-3">
                {/* AI Avatar and Response Container with Gradient Border */}
                <GradientBorder
                  borderWidth={1.5}
                  borderRadius="18px"
                  gradientFrom="#6EB2FF"
                  gradientTo="#9F6BFF"
                  gradientDirection="to-r"
                  innerClassName="relative overflow-hidden bg-[#05060E]/90 p-5 backdrop-blur"
                >
                  <ChatIndicator
                    hasChat={hasResponse}
                    toolOutputsLength={chat.response?.tool_outputs?.length || 0}
                    chatIndex={idx}
                    isLastChat={isLastChat}
                    hasDataOutput={hasDataOutput}
                    dataOutputType={chat.response?.data_output?.type}
                  />

                  {/* Response Content */}
                  {(hasResponse || !isLastChat) && (
                    <div className={`mt-4 break-words text-wrap text-[15px] leading-7 ${hasResponse ? 'text-white/80' : 'text-orange-400/70 italic'}`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        components={markdownComponents}
                      >
                        {displayResponse}
                      </ReactMarkdown>
                    </div>
                  )}

                  {(chat.response?.tool_outputs?.length || (hasDataOutput && chat.response?.data_output?.type === 'tweets')) ? (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {chat.response.tool_outputs?.map((tool:any, toolIdx:any) => (
                        <button
                          key={`${tool.id}-${toolIdx}`}
                          onClick={() => scrollToTransaction(idx, toolIdx)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/60 transition-all hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white/80 cursor-pointer"
                        >
                          {tool?.label || `Txn #${toolIdx + 1}`}
                        </button>
                      ))}
                      {hasDataOutput && chat.response?.data_output?.type === 'tweets' && (
                        <button
                          onClick={() => scrollToDataOutput(idx)}
                          className="rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-blue-400 transition-all hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white cursor-pointer"
                        >
                          View Tweets
                        </button>
                      )}
                    </div>
                  ) : null}
                </GradientBorder>
              </div>
            </React.Fragment>
          )})
        ) : (
          <>
            <PromptSuggestion />
          </>
        )}
        </div>
      </div>
    </>
  );
};

export default ChatInterfaceBox;
