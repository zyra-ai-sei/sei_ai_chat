import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import React, { useEffect, useRef } from "react";
import PromptSuggestion from "../PromptSuggestion/PromptSuggestion";
import ReactMarkDown from "react-markdown";
import { ChatItem } from "@/redux/chatData/reducer";
import { useSendTransaction, useWriteContract } from "wagmi";
import {
  appendTxChatResponseToLatestChat,
  eraseLatestToolOutput,
} from "@/redux/chatData/action";

const ResponseBox = () => {
  const chats = useAppSelector((data) => data.chatData.chats);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const txIndexRef = useRef(0);
  const txOutputsRef = useRef<any[]>([]);

  const processTx = (idx: number) => {
    const outputs = txOutputsRef.current;
    if (idx >= outputs.length) {
      dispatch(eraseLatestToolOutput());
      return;
    }
    const unsignedtx = outputs[idx];
    txIndexRef.current = idx;

    if (unsignedtx) {
      if (unsignedtx.abi) {
        writeContract({ ...(unsignedtx as any) });
      } else {
        sendTransaction({ ...(unsignedtx as any) });
      }
    }
  };

  const { writeContract } = useWriteContract({
    mutation: {
      onError: () => {
        dispatch(eraseLatestToolOutput());
      },
      onSuccess: () => {},
      onSettled(data) {
        processTx(txIndexRef.current + 1);
        dispatch(appendTxChatResponseToLatestChat({ txdata: data as string }));
      },
    },
  });
  const { sendTransaction } = useSendTransaction({
    mutation: {
      onError: () => {
        dispatch(eraseLatestToolOutput());
      },
      onSuccess: () => {
        // dispatch(eraseLatestToolOutput());
      },
      onSettled(data) {
        processTx(txIndexRef.current + 1);
        dispatch(appendTxChatResponseToLatestChat({ txdata: data as string }));
      },
    },
  });

  const handleSignature = async (chat: ChatItem) => {
    const outputs = chat.response.tool_outputs;
    if (!outputs || outputs.length === 0) return;
    txOutputsRef.current = outputs;
    txIndexRef.current = 0;
    processTx(0);
  };

  const lastProcessedChatId = useRef<string | number | null>(null);

  useEffect(() => {
     if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    const latestChat = chats[chats.length - 1];

    if (
      latestChat &&
      latestChat.id !== lastProcessedChatId.current &&
      latestChat.response.tool_outputs &&
      latestChat?.response?.tool_outputs?.length > 0
    ) {
      lastProcessedChatId.current = latestChat.id;
      handleSignature(latestChat);
    }
  }, [chats]);
  // Custom markdown renderers
  const addressRegex = /0x[a-fA-F0-9]{40}/g;
  const components = {
    strong: ({ node, ...props }: any) => (
      <strong style={{ color: "#e0e0e0", fontWeight: 700 }} {...props} />
    ),
    h1: ({ node, ...props }: any) => (
      <h1
        style={{ color: "#e0e0e0", fontWeight: 700 }}
        className="text-2xl"
        {...props}
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2
        style={{ color: "#e0e0e0", fontWeight: 700 }}
        className="text-xl"
        {...props}
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3
        style={{ color: "#e0e0e0", fontWeight: 700 }}
        className="text-lg"
        {...props}
      />
    ),
    text: ({ children }: any) => {
      // Highlight blockchain addresses
      if (typeof children === "string") {
        const parts = children.split(addressRegex);
        const matches = children.match(addressRegex);
        if (matches) {
          return (
            <>
              {parts.map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {matches[i] && (
                    <span style={{ color: "#eaff7b", fontWeight: 600 }}>
                      {matches[i]}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </>
          );
        }
      }
      return <>{children}</>;
    },
  };

  return (
    <div
      ref={containerRef}
      className="z-30 flex flex-col w-full max-w-[1280px] mx-auto justify-start flex-grow max-h-[calc(100%-140px)] gap-6 py-2 pr-4 overflow-y-auto scrollbar-none"
    >
      {chats.length > 0 ? (
        chats.map((chat, idx) => (
          <React.Fragment key={idx}>
            <div className="self-end p-4 text-white bg-gradient-to-r from-[#222f44] to-[#202c3f] rounded-tr-sm min-w-[80px] rounded-3xl w-fit max-w-[80%]">
              {chat.prompt}
            </div>
            <div className={`self-start p-4 text-white ${chat.response.chat ? 'bg-[#0F172A]' : ''} rounded-tl-sm rounded-2xl w-fit max-w-[80%] text-wrap break-words whitespace-pre-line`}>
              <ReactMarkDown components={components}>
                {chat.response.chat || ""}
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
