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
      className={`px-[16px] top-3 z-50 p-2 w-[calc(100vw-32px)] max-w-[calc(1440px-32px)] flex justify-between rounded-xl fixed left-1/2 right-1/2 transform -translate-x-1/2 self-center  transition-all duration-500 
        ${scrolled || currentPath === '/chat' ? "bg-grey-600/10 backdrop-blur-sm border-gray-500/60 border" : "border-gray-500/50 border"}
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
