import { useState } from "react";
import { useAccount } from "wagmi";
import avatarImg from "@/assets/home/avatar.png";

interface ChatHeaderProps {
  onToggleWalletPanel: () => void;
  isWalletConnected: boolean;
}

const ChatHeader = ({ onToggleWalletPanel, isWalletConnected }: ChatHeaderProps) => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("Chat");

  const navItems = ["Dashboard", "Chat", "Transaction", "Advanced tools"];

  return (
    <div className="w-full h-16 bg-[#0D0C11] border-b border-white/10 flex items-center justify-between px-6">
      {/* Left Side - Logo and Navigation */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-[8px] opacity-40"
                 style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
            <img src={avatarImg} alt="Zyra" className="w-8 h-8 object-contain relative z-10" />
          </div>
          <span className="font-['Figtree',sans-serif] font-bold text-[20px] text-white">Zyra</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-4 py-2 font-['Figtree',sans-serif] text-[14px] rounded-lg transition-colors ${
                activeTab === item
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Connect Wallet Button */}
      <div>
        {!isWalletConnected ? (
          <button
            onClick={onToggleWalletPanel}
            className="px-6 py-2 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-sm font-['Figtree',sans-serif] font-medium rounded-lg transition-colors"
          >
            Connect to wallet
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-white text-sm font-['Figtree',sans-serif]">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
