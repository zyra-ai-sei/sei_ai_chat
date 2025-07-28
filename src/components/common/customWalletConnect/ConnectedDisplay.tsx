import { useAppDispatch } from "@/hooks/useRedux";
import { logoutUserRequest, resetGlobalData } from "@/redux/globalData/action";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

const ConnectedDisplay = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect({
    mutation: {
      onSettled() {
        dispatch(logoutUserRequest({}));
        dispatch(resetGlobalData());
        setShowDropdown(false);
      },
    },
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center self-end gap-4">
      {isConnected && address && (
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium min-w-[40px]"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            {/* User Icon SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <span className="hidden text-sm md:inline-block">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 z-50 w-32 py-2 mt-2 bg-white shadow-lg rounded-xl">
              <button
                className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 rounded-xl"
                onClick={() => {
                  disconnect();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectedDisplay;
