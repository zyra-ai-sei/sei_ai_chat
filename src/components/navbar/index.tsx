import { useRef, useState } from "react";
import Logo from "@/assets/icon.svg?react";
import Wallet from "@/assets/header/wallet.svg?react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Link, useLocation } from "react-router-dom";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { setGlobalData } from "@/redux/globalData/action";
import useClickOutside from "@/hooks/useOutsideClick";

const Navbar = () => {
  const location = useLocation();
  const globalData = useAppSelector((state) => state?.globalData?.data) || {};
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: walletBalance, isLoading: isBalanceLoading } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
    },
  });
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const walletRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(walletRef, () => setIsWalletPopupOpen(false));

  const dispatch = useAppDispatch();

  const routes = [
    { name: "Chat", url: "/chat" },
    { name: "Dashboard", url: "/dashboard" },
    { name: "Transactions", url: "/transactions" },
  ];

  return (
    <div className="h-[64px] font-['Satoshi',sans-serif] border-b border-white/10 px-6 flex items-center justify-between relative bg-[#0a0d14]">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <Logo className="h-9 w-9" />
        <span className="text-2xl font-bold text-white">Zyra</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center h-full gap-1">
        {routes.map((route, index) => {
          const isActive = location.pathname === route.url;
          return (
            <Link
              key={index}
              to={route.url}
              className={`
                relative h-full flex items-center px-4 text-sm font-medium tracking-wide
                transition-colors duration-200
                ${isActive 
                  ? "text-white" 
                  : "text-white/50 hover:text-white/80"
                }
              `}
            >
              {route.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Wallet / Connect */}
      {isConnected ? (
        <div ref={walletRef} className="relative">
          <button
            onClick={() => setIsWalletPopupOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 text-white transition-colors duration-200 border rounded-lg border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
          >
            <Wallet className="size-5" />
            <span className="hidden text-sm text-white/70 sm:inline">Wallet</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          </button>

          {isWalletPopupOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#0B0E19] p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-white/40">Connected</span>
              </div>
              <p className="mb-1 text-xs text-white/50">Balance</p>
              <p className="text-xl font-semibold text-white">
                {isBalanceLoading
                  ? "Loading..."
                  : `${walletBalance?.formatted || "0.00"} ${walletBalance?.symbol || "SEI"}`}
              </p>
              <div className="h-px my-3 bg-white/10" />
              <button
                onClick={() => {
                  disconnect();
                  setIsWalletPopupOpen(false);
                }}
                className="w-full py-2 text-sm font-medium text-red-300 transition-colors duration-200 border rounded-lg border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => {
            dispatch(
              setGlobalData({
                ...globalData,
                isConnectButtonClicked: !globalData?.isConnectButtonClicked,
              })
            );
          }}
          className="px-5 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default Navbar;
