import "./index.scss";
import Icon from "@/assets/common/zyra_icon.png";
import { LaunchButton } from "../customWalletConnect/LaunchButton";
import ConnectedDisplay from "../customWalletConnect/ConnectedDisplay";
import { useAccount } from "wagmi";
import { useLocation } from "react-router-dom";

function Header() {
  const { isConnected } = useAccount();

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-500"
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-[135px] py-4 md:py-[32px] w-full mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center">
            <img src={Icon} alt="Zyra Logo" className="w-full h-full object-contain" />
          </div>
          <p className="font-['Satoshi',sans-serif] font-black text-[24px] md:text-[34px] leading-normal text-white text-center whitespace-pre">
            Zyra
          </p>
        </div>
        {currentPath === '/' ? <LaunchButton /> : isConnected ? <ConnectedDisplay /> : null}
      </div>
    </header>
  );
}

export default Header;
