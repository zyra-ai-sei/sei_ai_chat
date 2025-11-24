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
    {
      name: "Chat",
      url: "/chat",
    },
    {
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      name: "Transactions",
      url: "/transactions",
    },
  ];
  return (
    <div className="h-[64px] font-['Satoshi',sans-serif] border-b-2 border-primary-border px-[24px] pt-[12px] gap-[100px] flex items-center justify-between relative">
      <h1 className="flex items-center gap-2 pb-[12px] shadow-">
        <Logo className="h-[40px] w-[40px]" />
        <h1 className="font-bold text-[34px] text-white">Zyra</h1>
      </h1>
      <ul className="flex items-end h-full gap-4 text-[20px] w-full ">
        {routes.map((route, index) => (
          <Link
            key={index}
            className={` ${location.pathname === route.url ? "text-text-primary border-b border-b-text-secondary" : "text-text-secondary"} pb-[12px] px-8`}
            to={route.url}
          >
            {route.name}
          </Link>
        ))}
      </ul>
      {isConnected ? (
        <div ref={walletRef} className="relative pb-[12px]">
          <button
            onClick={() => setIsWalletPopupOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border-2 border-primary-border p-2 text-white transition hover:border-white/60"
          >
            <Wallet className="size-[24px]" />
            <span className="text-sm uppercase tracking-[0.35em] text-white/70 hidden sm:inline">Wallet</span>
          </button>

          {isWalletPopupOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-white/10 bg-[#0B0E19] p-4 shadow-[0_20px_45px_rgba(5,6,15,0.85)]">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Current Balance</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {isBalanceLoading
                  ? "Loading..."
                  : `${walletBalance?.formatted || "0.00"} ${walletBalance?.symbol || "SEI"}`}
              </p>
              <button
                onClick={() => {
                  disconnect();
                  setIsWalletPopupOpen(false);
                }}
                className="mt-4 w-full rounded-xl border border-red-400/60 bg-transparent py-2 text-sm font-semibold text-red-200 transition hover:text-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => {
            dispatch(
              setGlobalData({
                ...globalData,
                isConnectButtonClicked: !globalData?.isConnectButtonClicked,
              })
            );
          }}
          className="bg-gradient-to-r from-[#204887] to-[#3B82F6] border-x-[1px] border-y-[0.1px] border-y-white/80 active:border-[#3B82F6] border-[white] text-white rounded-full py-[8px] px-[24px] cursor-pointer"
        >
          Connect
        </div>
      )}
    </div>
  );
};

export default Navbar;
