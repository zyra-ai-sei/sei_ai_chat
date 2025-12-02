import Logo from "@/assets/icon.svg?react";
import Wallet from "@/assets/header/wallet.svg?react";
import PowerIcon from "@/assets/header/power.svg?react";
import AvatarIcon from "@/assets/header/avatar.svg?react";
import SettingsIcon from "@/assets/header/settings.svg?react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import {
  logoutUserRequest,
  resetGlobalData,
  setGlobalData,
} from "@/redux/globalData/action";
import { getTransactions } from "@/redux/transactionData/action";
import { clearChat } from "@/redux/chatData/action";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Address, formatUnits } from "viem";
import { useEffect } from "react";
import WalletConnectModal from "../common/customWalletConnect";

const formatAddress = (addr: string) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const transactions = useAppSelector(
    (state) => state?.transactionData?.transactions
  );
  const { isConnected, address } = useAccount();
  const dispatch = useAppDispatch();

  const { data: seiBalance } = useBalance({
    address: address as Address,
  });

  const { disconnect } = useDisconnect({
    mutation: {
      onSettled() {
        dispatch(logoutUserRequest({}));
        dispatch(resetGlobalData());
      },
    },
  });

  // Fetch transactions when connected
  useEffect(() => {
    if (isConnected) {
      dispatch(getTransactions());
    }
  }, [isConnected, dispatch]);

  const recentTransactions = transactions?.slice(0, 3) || [];

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
                ${isActive ? "text-white" : "text-white/50 hover:text-white/80"}
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
      {isConnected && globalData.token ? (
        <div className="flex gap-3 pb-[12px]">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 box-content text-[#fff] border-2 border-primary-border rounded-full cursor-pointer hover:border-white/50 transition-colors">
                <Wallet className="size-[24px]" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[320px] bg-[#0a0a0a] border border-[#7cabf9] rounded-[16px] p-5 font-['Figtree',sans-serif]"
            >
              <div className="flex flex-col gap-5">
                {/* Header with avatar and actions */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <AvatarIcon className="rounded-full size-12" />
                    <span className="text-white text-[16px] font-medium mt-2">
                      {formatAddress(address || "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="transition-colors cursor-pointer text-white/60 hover:text-white">
                      {/* <Settings className="size-5" /> */}
                    </button>
                    <button
                      onClick={() => disconnect()}
                      className="transition-colors cursor-pointer text-white/60 hover:text-white"
                    >
                      <PowerIcon className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Balance Display */}
                <div className="flex flex-col gap-1">
                  <span className="text-white text-[36px] font-semibold leading-tight">
                    {seiBalance
                      ? parseFloat(
                          formatUnits(seiBalance.value, seiBalance.decimals)
                        ).toFixed(2)
                      : "0.00"}{" "}
                    <span className="text-white/40">SEI</span>
                  </span>
                </div>

                {/* View Portfolio Button */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 transition-colors border rounded-full cursor-pointer border-white/20 hover:border-white/40"
                >
                  <span className="text-white font-medium text-[14px]">
                    View portfolio
                  </span>
                  <svg
                    className="text-white size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Recent Activity */}
                <div className="flex flex-col gap-3">
                  <span className="text-white font-semibold text-[14px]">
                    Recent activity
                  </span>

                  {recentTransactions.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {recentTransactions.map((tx, index) => (
                        <button
                          key={tx.hash || index}
                          onClick={() =>
                            navigate(`/transactions?highlight=${tx.hash}`)
                          }
                          className="flex items-center justify-between px-2 py-2 -mx-2 transition-colors rounded-lg cursor-pointer hover:bg-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-lg size-8 bg-white/10">
                              <svg
                                className="size-4 text-white/60"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                <path d="M9 12h6M9 16h6" />
                              </svg>
                            </div>
                            <span className="text-white text-[14px]">
                              {tx.status === "success"
                                ? "Transaction confirmed"
                                : tx.status || "Transaction"}
                            </span>
                          </div>
                          <span className="text-white/40 text-[12px]">
                            {formatTime(tx.timestamp)}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-white/40 text-[12px]">
                      No recent activity
                    </span>
                  )}

                  {transactions && transactions.length > 3 && (
                    <button
                      onClick={() => navigate("/transactions")}
                      className="text-white/40 hover:text-white/60 text-[12px] text-left transition-colors cursor-pointer"
                    >
                      View more
                    </button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings Button */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 box-content text-[#fff] border-2 border-primary-border rounded-full cursor-pointer hover:border-white/50 transition-colors">
                <SettingsIcon className="size-[24px]" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[200px] bg-[#0a0a0a] border border-[#7cabf9] rounded-[16px] p-3 font-['Figtree',sans-serif]"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    dispatch(clearChat());
                    navigate("/chat");
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer w-full text-left"
                >
                  <svg
                    className="size-5 text-white/60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-white text-[14px] font-medium">
                    New Chat
                  </span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <>
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
          
          {!(isConnected && globalData?.token) &&
            globalData?.isConnectButtonClicked && (
              <div className="absolute right-0 z-50 p-1 top-16 w-[30%]">
                <WalletConnectModal />
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Navbar;
