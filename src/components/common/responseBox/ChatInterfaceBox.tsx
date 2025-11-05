import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import React, { useEffect } from "react";
import PromptSuggestion from "../PromptSuggestion/PromptSuggestion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { getChatHistory } from "@/redux/chatData/action";
import { markdownComponents } from "./helpers/markdownComponents";
import { cryptoHighlightStyles } from "./helpers/cryptoHighlighter";
import "highlight.js/styles/github-dark.css";

const ChatInterfaceBox = () => {
  const chats = useAppSelector((data) => data.chatData.chats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChatHistory());
  }, []);

  return (
    <>
      <style>{cryptoHighlightStyles}</style>

      <div className="relative z-30 flex flex-col justify-start flex-grow w-full gap-6 py-2 pr-4 mx-auto overflow-y-scroll">
        {chats.length > 0 ? (
          chats.map((chat, idx) => (
            <React.Fragment key={idx}>
              <div className="self-end p-4 break-words font-light text-[14px] text-white bg-background-secondary border-[#FFFFFF14] min-w-[80px] rounded-xl w-fit max-w-[90%]">
                {chat.prompt}
              </div>
              <div
                className={`self-start p-4 text-white text-[14px] font-light w-fit max-w-[95%] text-wrap break-words prose prose-invert prose-sm `}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={markdownComponents}
                >
                  {typeof chat.response.chat === "string"
                    ? chat.response.chat || ""
                    : "response format error from model"}
                </ReactMarkdown>

                {!chat.response.chat && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    className="w-8 h-8 mx-auto my-4"
                  >
                    <circle
                      fill="none"
                      strokeOpacity="1"
                      stroke="#40DEFF"
                      strokeWidth=".5"
                      cx="100"
                      cy="100"
                      r="0"
                    >
                      <animate
                        attributeName="r"
                        calcMode="spline"
                        dur="1"
                        values="1;80"
                        keyTimes="0;1"
                        keySplines="0 .2 .5 1"
                        repeatCount="indefinite"
                      ></animate>
                      <animate
                        attributeName="stroke-width"
                        calcMode="spline"
                        dur="1"
                        values="0;25"
                        keyTimes="0;1"
                        keySplines="0 .2 .5 1"
                        repeatCount="indefinite"
                      ></animate>
                      <animate
                        attributeName="stroke-opacity"
                        calcMode="spline"
                        dur="1"
                        values="1;0"
                        keyTimes="0;1"
                        keySplines="0 .2 .5 1"
                        repeatCount="indefinite"
                      ></animate>
                    </circle>
                  </svg>
                )}
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