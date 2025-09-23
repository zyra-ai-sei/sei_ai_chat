import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import React, { useEffect } from "react";
import PromptSuggestion from "../PromptSuggestion/PromptSuggestion";
import ReactMarkDown from "react-markdown";
import { getChatHistory } from "@/redux/chatData/action";
import TransactionCanvas from "./components/TransactionCanvas";

const ResponseBox = () => {
  const chats = useAppSelector((data) => data.chatData.chats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChatHistory());
  }, []);

  return (
    <div className="z-30 flex flex-col w-full relative max-w-[1280px] mx-auto justify-start flex-grow max-h-[calc(100%-140px)] gap-6 py-2 pr-4 overflow-y-auto scrollbar-none">
      {chats.length > 0 ? (
        chats.map((chat, idx) => (
          <React.Fragment key={idx}>
            <div className="self-end p-4 text-white bg-gradient-to-r from-[#222f44] to-[#202c3f] rounded-tr-sm min-w-[80px] rounded-3xl w-fit max-w-[80%]">
              {chat.prompt}
            </div>
            <div
              className={`self-start p-4 text-white rounded-tl-sm rounded-2xl w-fit max-w-[80%] text-wrap break-words whitespace-pre-line`}
            >
              <ReactMarkDown>
                {typeof chat.response.chat == "string"
                  ? chat.response.chat || ""
                  : "response format error from model"}
              </ReactMarkDown>

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
            <div>
              {chat?.response?.tool_outputs && (
                <TransactionCanvas
                  txns={chat.response.tool_outputs}
                  chatIndex={idx}
                />
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
  );
};

export default ResponseBox;
