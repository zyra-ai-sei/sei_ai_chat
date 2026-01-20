import { useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { ArrowLeftRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setGlobalData } from "@/redux/globalData/action";

interface WalletSwitchProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const WalletSwitch = ({ size = "md", showLabel = true, className = "" }: WalletSwitchProps) => {
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state?.globalData?.data);

  const switchToEmbedded = () => {
    const embedded = wallets.find((w) => w.connectorType === "embedded");
    if (embedded) {
      setActiveWallet(embedded);
      dispatch(setGlobalData({ ...globalData, currentWallet: embedded.address }));
    }
  };

  const switchToMetaMask = () => {
    const metamask = wallets.find((w) => w.connectorType === "injected");
    if (metamask) {
      setActiveWallet(metamask);
      dispatch(setGlobalData({ ...globalData, currentWallet: metamask.address }));
    }
  };

  const embeddedWallet = wallets.find((w) => w.connectorType === "embedded");
  const isEmbedded = !address || address.toLowerCase() === embeddedWallet?.address?.toLowerCase();

  const handleToggle = () => {
    if (isEmbedded) {
      switchToMetaMask();
    } else {
      switchToEmbedded();
    }
  };

  // Auto-switch to saved wallet on mount
  useEffect(() => {
    // Only run when we have all necessary data and Wagmi has initialized the account address.
    // This prevents triggering MetaMask/other providers before the session is fully restored.
    if (!globalData?.currentWallet || wallets.length === 0 || !address) return;

    const currentWalletLower = globalData.currentWallet.toLowerCase();
    const addressLower = address.toLowerCase();

    // Only switch if we're not already on the saved wallet address
    if (addressLower !== currentWalletLower) {
      const targetWallet = wallets.find((w) => w.address.toLowerCase() === currentWalletLower);
      if (targetWallet) {
        setActiveWallet(targetWallet);
      }
    }
  }, [globalData?.currentWallet, wallets.length, address, setActiveWallet]);

  const sizeClasses = {
    sm: {
      container: "gap-1.5",
      icon: "size-3",
      text: "text-[10px]",
    },
    md: {
      container: "gap-2",
      icon: "size-4",
      text: "text-xs",
    },
    lg: {
      container: "gap-2.5",
      icon: "size-5",
      text: "text-sm",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <button
      onClick={handleToggle}
      className={`
        group flex items-center ${sizes.container} px-3 py-1.5 rounded-lg transition-all duration-300
        shadow-lg hover:shadow-xl active:scale-95 border border-white/10
        ${isEmbedded 
          ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-500/20 hover:shadow-violet-500/30" 
          : "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/20 hover:shadow-blue-500/30"
        }
        ${className}
      `}
    >
      <ArrowLeftRight 
        className={`
          ${sizes.icon} text-white/90 group-hover:text-white transition-colors duration-300
        `} 
      />
      {showLabel && (
        <div className="flex flex-col items-start">
          <span className={`
            ${sizes.text} font-medium leading-none text-white
          `}>
            {isEmbedded ? "Smart Wallet" : "External Wallet"}
          </span>
        </div>
      )}
      
      {/* Status Indicator Dot */}
      <div className={`
        w-1.5 h-1.5 rounded-full ml-1 shadow-[0_0_8px_currentColor] bg-white text-white
      `} />
    </button>
  );
};

export default WalletSwitch;
