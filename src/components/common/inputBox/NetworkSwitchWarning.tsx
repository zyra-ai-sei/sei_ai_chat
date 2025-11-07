import { useSwitchChain } from "wagmi";
import SwapIcon from "@/assets/chat/swap.svg?react";
import { useEffect, useState } from "react";

interface NetworkSwitchWarningProps {
  shouldBlink?: boolean;
}

const NetworkSwitchWarning = ({ shouldBlink = false }: NetworkSwitchWarningProps) => {
  const { switchChain } = useSwitchChain();
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (shouldBlink) {
      setIsBlinking(true);
      const timeout = setTimeout(() => setIsBlinking(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [shouldBlink]);

  return (
    <div
      className={`flex items-center justify-between w-full p-3 mb-3 border rounded-xl border-yellow-500/30 transition-all duration-300 ${
        isBlinking ? 'animate-pulse ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <SwapIcon className="w-[40px] h-[40px] text-yellow-500" />
        <span className="text-sm font-medium text-yellow-200">
          Wrong Network - Please switch to Sei Network
        </span>
      </div>
      <button
        onClick={() => {
          switchChain?.({
            chainId: Number(import.meta.env?.VITE_BASE_CHAIN_ID),
          });
        }}
        className="px-4 py-2 text-sm font-semibold text-black transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600"
      >
        Switch Network
      </button>
    </div>
  );
};

export default NetworkSwitchWarning;
