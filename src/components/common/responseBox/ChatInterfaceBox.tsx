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

// Loading text animation states
const loadingTexts = [
  "Thinking",
  "Generating response",
  "Finalizing",
  "Summarizing",
];

const LoadingIndicator = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 800); // Change text every 800ms

    return () => clearInterval(interval);
  }, []);

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
};

const ChatInterfaceBox = () => {
  const chats = useAppSelector((data) => data.chatData.chats);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevChatsCountRef = useRef(0);

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

      <div
        ref={scrollContainerRef}
        className="relative z-30 flex flex-col justify-start w-full h-full gap-6 px-4 py-2 mx-auto overflow-y-auto"
      >
        {chats.length > 0 ? (
          chats.map((chat, idx) => (
            <React.Fragment key={idx}>
              <div className="self-end p-4 break-words font-light text-[14px] text-white bg-background-secondary border-[#FFFFFF14] min-w-[80px] rounded-xl w-fit max-w-[95%]">
                {chat.prompt}
              </div>

              {/* AI Response with Figma Design - Dark Theme */}
              <div className="self-start flex flex-col gap-3 w-fit max-w-[95%] min-w-[50%]">
                {/* AI Avatar and Response Container with Gradient Border */}
                <GradientBorder
                  borderWidth={2}
                  borderRadius="12px"
                  gradientFrom="#7CABF9"
                  gradientTo="#B37AE8"
                  gradientDirection="to-r"
                  innerClassName="p-3 flex flex-col gap-3"
                >
                  {/* Avatar */}
                  {chat.response.chat ? (
                    <div className="relative w-8 h-8 shrink-0">
                      <img
                        src={iconSvg}
                        alt="Zyra AI"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <LoadingIndicator />
                  )}

                  {/* Response Content */}
                  <div className="break-words text-wrap max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      components={markdownComponents}
                    >
                      {typeof chat.response.chat === "string"
                        ? chat.response.chat || ""
                        : "response format error from model"}
                    </ReactMarkdown>
                  </div>
                </GradientBorder>
              </div>
            </React.Fragment>
          ))
        ) : (
          <>
            <PromptSuggestion />
          </>
        )}
      </div>
    </>
  );
};

export default ChatInterfaceBox;
