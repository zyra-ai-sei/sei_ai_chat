import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { streamChatPrompt } from "@/redux/chatData/action";
import { setGlobalData } from "@/redux/globalData/action";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@/assets/chat/sendIcon.svg?react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import NetworkSwitchWarning from "./NetworkSwitchWarning";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN, isSupportedChainId, getChainById, getChainByIdentifier } from "@/config/chains";
import WalletSwitch from "../WalletSwitch";
import { usePrivy } from "@privy-io/react-auth";

const InputBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedChain, setSelectedChain] = useState<string>(DEFAULT_CHAIN.id);
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { isNetworkSwitchWarningTriggered } = globalData || {};
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const {address} = useAccount()
  const {authenticated, getAccessToken} = usePrivy()
  // Check if current chainId is in supported chains
  const isSupportedChain = isSupportedChainId(chainId);
  const isWrongNetwork = Boolean(!isSupportedChain);

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

  const handleTextareaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    // Check if user has token, if not, show connect wallet modal
    if (!authenticated) {
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

    if (prompt.trim() === "") return;

    const token = await getAccessToken();
    // Include chain information in the prompt
    const promptWithChain = `[Chain: ${selectedChain}] ${prompt}`;
    dispatch(streamChatPrompt({ prompt: promptWithChain, network:getChainById(chainId)?.id, abortSignal: new AbortController().signal, address: address!, token: token!}));
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
    if (!authenticated) {

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
      <div className="flex flex-col w-full p-4 mx-auto rounded-xl bg-[#0a0b0f] border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl shadow-black/20 group">
        <textarea
          ref={textareaRef}
          className="flex-grow w-full min-h-[40px] max-h-[200px] resize-none bg-transparent scrollbar-none border-none outline-none text-slate-200 placeholder-slate-500 px-1 pb-3 font-medium"
          placeholder={isWrongNetwork ? "Please switch to a supported network..." : "Type your message..."}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          value={prompt}
          style={{ height: "10px" }}
          disabled={isWrongNetwork}
        />
        <div className="flex items-center justify-between w-full gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative group/select">
              <select
                value={selectedChain}
                onChange={(e) => handleChainChange(e.target.value)}
                className="px-3 py-1.5 pr-8 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-lg cursor-pointer focus:outline-none focus:border-violet-500/50 focus:bg-white/10 hover:bg-white/10 hover:border-white/20 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isWrongNetwork}
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <option key={chain.id} value={chain.id} className="bg-[#0a0b0f] text-slate-300">
                    {chain.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute w-3.5 h-3.5 -translate-y-1/2 pointer-events-none right-2.5 top-1/2 text-slate-500 group-hover/select:text-slate-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <WalletSwitch size="sm" showLabel={true} />
          </div>
          <button
            onClick={handleSendPromt}
            className="w-[32px] h-[32px] flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_12px_-3px_rgba(124,58,237,0.4)] border border-violet-500/50 active:scale-95"
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
