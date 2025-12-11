import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { streamChatPrompt } from "@/redux/chatData/action";
import { setGlobalData } from "@/redux/globalData/action";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@/assets/chat/sendIcon.svg?react";
import { useChainId, useSwitchChain } from "wagmi";
import NetworkSwitchWarning from "./NetworkSwitchWarning";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN, isSupportedChainId, getChainById, getChainByIdentifier } from "@/config/chains";

const InputBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedChain, setSelectedChain] = useState<string>(DEFAULT_CHAIN.id);
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token, isNetworkSwitchWarningTriggered } = globalData || {};
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Check if current chainId is in supported chains
  const isSupportedChain = isSupportedChainId(chainId);
  const isWrongNetwork = Boolean(token && !isSupportedChain);

  // Sync selected chain with current chainId
  useEffect(() => {
    const currentChain = getChainById(chainId);
    if (currentChain) {
      setSelectedChain(currentChain.id);
    }
  }, [chainId]);

  // Handle chain change in dropdown
  const handleChainChange = (chainName: string) => {
    setSelectedChain(chainName);
    const chain = getChainByIdentifier(chainName);
    if (chain && switchChain) {
      switchChain({ chainId: chain.chainId });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Check if user has token, if not, show connect wallet modal
    if (!token) {
      dispatch(setGlobalData({
        ...globalData,
        isConnectButtonClicked: true,
      }));
      return;
    }

    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(setGlobalData({
        ...globalData,
        isNetworkSwitchWarningTriggered: true,
      }));
      return;
    }

    const textarea = e.target;
    setPrompt(e.target.value);
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleSendPromt = async () => {
    // Check if user has token, if not, show connect wallet modal
    if (!token) {
      dispatch(setGlobalData({
        ...globalData,
        isConnectButtonClicked: true,
      }));
      return;
    }

    // Check if user is on wrong network
    if (isWrongNetwork) {
      dispatch(setGlobalData({
        ...globalData,
        isNetworkSwitchWarningTriggered: true,
      }));
      return;
    }

    if (prompt.trim() === "") return;

    // Include chain information in the prompt
    const promptWithChain = `[Chain: ${selectedChain}] ${prompt}`;
    dispatch(streamChatPrompt({ prompt: promptWithChain, network:getChainById(chainId)?.id, abortSignal: new AbortController().signal }));
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "20px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPromt();
    }
  };

  const handleFocus = () => {
    // Check if user has token, if not, show connect wallet modal
    if (!token) {
      // Just open the modal and keep it open
      dispatch(setGlobalData({
        ...globalData,
        isConnectButtonClicked: true,
      }));

      // Blur the textarea to prevent typing
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
      return;
    }

    // Check if user is on wrong network, blur to prevent typing
    if (isWrongNetwork) {
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  return (
    <div className="w-full flex flex-col max-h-[400px] rounded-xl z-30 gap-3">
      {isWrongNetwork && <NetworkSwitchWarning shouldBlink={isNetworkSwitchWarningTriggered} />}
      <div className="flex flex-col w-full p-3 mx-auto rounded-xl bg-[#0F0E11] border border-[#2f2f31]">
        <textarea
          ref={textareaRef}
          className="flex-grow w-full min-h-[40px] max-h-[200px] resize-none bg-transparent scrollbar-none border-none outline-none text-white placeholder-white/50 px-1 pb-3"
          placeholder={isWrongNetwork ? "Please switch to a supported network..." : "Type your message..."}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          value={prompt}
          style={{ height: "10px" }}
          disabled={isWrongNetwork}
        />
        <div className="flex items-center justify-between w-full ">
          <div className="relative">
            <select
              value={selectedChain}
              onChange={(e) => handleChainChange(e.target.value)}
              className="px-3 py-1.5 pr-8 text-xs font-medium text-white bg-transparent border border-[#2f2f31] rounded-lg cursor-pointer focus:outline-none focus:border-[#3B82F6] hover:border-[#3B82F6]/50 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isWrongNetwork}
            >
              {SUPPORTED_CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id} className="bg-[#0F0E11] text-white">
                  {chain.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-2 top-1/2 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button
            onClick={handleSendPromt}
            className="w-[32px] h-[32px] flex justify-center items-center bg-[#3B82F6] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3B82F6]/80 transition-all hover:shadow-lg hover:shadow-[#3B82F6]/30"
            disabled={isWrongNetwork}
          >
            <SendIcon className="text-[14px] text-white"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
