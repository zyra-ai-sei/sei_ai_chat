import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { streamChatPrompt } from "@/redux/chatData/action";
import { setGlobalData } from "@/redux/globalData/action";
import { setTokenVisualization } from "@/redux/tokenVisualization/action";
import React, { useRef, useState } from "react";
import SendIcon from "@/assets/chat/sendIcon.svg?react";
import { useChainId } from "wagmi";
import NetworkSwitchWarning from "./NetworkSwitchWarning";
import { bitcoinChartPrices } from "@/data/bitcoinChartData";

const InputBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token, isNetworkSwitchWarningTriggered } = globalData || {};
  const chainId = useChainId();
  const correctChainId = Number(import.meta.env?.VITE_BASE_CHAIN_ID);
  const isWrongNetwork = Boolean(token && chainId !== correctChainId);

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

    // Check if the prompt contains "bitcoin" (case insensitive)
    if (prompt.toLowerCase().includes("bitcoin") || prompt.toLowerCase().includes("btc")) {
      // Dispatch mock Bitcoin token data
      dispatch(setTokenVisualization({
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: {
          thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
          large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
        },
        categories: ["Cryptocurrency", "Layer 1", "Proof of Work"],
        market: {
          price_usd: 69840,
          price_change_1h: 0.79,
          price_change_24h: 2.37,
          price_change_7d: -0.89,
          price_change_30d: 1.81,
          high_24h: 69805,
          low_24h: 67985,
          ath_usd: 73738,
          ath_change_pct: -5.33,
          ath_date: "2024-03-14",
          market_cap: 1373546629363,
          market_cap_rank: 1,
          volume_24h: 18867210007,
          circulating_supply: 19675962,
          max_supply: 21000000,
          supply_pct_mined: 0.94
        },
        chart: {
          prices: bitcoinChartPrices as any
        },
        sentiment: {
          positive_pct: 84.07,
          negative_pct: 15.93,
          watchlist_count: 1541900
        },
        developer_activity: {
          stars: 73168,
          forks: 36426,
          commit_count_4_weeks: 108,
          pull_requests_merged: 11215,
          contributors: 846
        },
        liquidity: {
          top_exchange: "Binance",
          last_traded_price: 69816,
          volume_on_top_exchange: 19988.82111,
          spread_pct: 0.01,
          trust_score: "green"
        }
      }));
    }

    dispatch(streamChatPrompt({ prompt, abortSignal: new AbortController().signal }));
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
    <div className="w-full flex flex-col max-h-[400px] rounded-xl z-30">
      {isWrongNetwork && <NetworkSwitchWarning shouldBlink={isNetworkSwitchWarningTriggered} />}
      <div className="flex flex-col items-end w-full p-2 mx-auto rounded-xl bg-[#0F0E11] border border-[#2f2f31] ">
        <textarea
          ref={textareaRef}
          className="flex-grow w-full rounded-2xl min-h-[40px] max-h-[200px] resize-none bg-transparent scrollbar-none border-none outline-none text-white placeholder-white/50 p-3"
          placeholder={isWrongNetwork ? "Please switch to the correct network..." : "Type your message..."}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          value={prompt}
          style={{ height: "10px" }}
          disabled={isWrongNetwork}
        />
        <button
          onClick={handleSendPromt}
          className="w-[32px] h-[32px] flex justify-center items-center  bg-[#3B82F6] rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isWrongNetwork}
        >
          <SendIcon className="text-[14px] text-white/70"/>
        </button>
      </div>
    </div>
  );
};

export default InputBox;
