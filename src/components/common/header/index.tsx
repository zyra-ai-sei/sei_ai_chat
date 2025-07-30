import "./index.scss";
import Icon from "@/assets/common/icon.svg";
import { LaunchButton } from "../customWalletConnect/LaunchButton";
import ConnectedDisplay from "../customWalletConnect/ConnectedDisplay";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const { isConnected } = useAccount();
  const [scrolled, setScrolled] = useState(false);

   const location = useLocation();
  // Current route path:
  const currentPath = location.pathname;


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`px-[16px] top-3 z-50 p-2 max-w-[1440px] flex justify-between rounded-xl  ${currentPath === '/' ? 'fixed left-4 right-4' : 'absolute w-[calc(100% - 32px)] left-4 right-4 max-w-[1440px] '} transition-all duration-500 
        ${scrolled || currentPath === '/chat' ? "bg-grey-600/10 backdrop-blur-sm border-gray-800/70 border" : "border-gray-800/10 border"}
      `}
    >
      <div className="flex items-center gap-1">
        <img src={Icon} className="size-[18px] md:size-[24px]" />
        <h1 className="font-bold text-white text-[14px] md:text-[18px]">
          Zyra.ai
        </h1>
      </div>
      {
        currentPath === '/' ? <LaunchButton/> : isConnected ? <ConnectedDisplay/> : null
      }
    </header>
  );
}

export default Header;
