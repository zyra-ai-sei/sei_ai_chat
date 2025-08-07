import { useAppDispatch } from "@/hooks/useRedux";
import { logoutUserRequest, resetGlobalData } from "@/redux/globalData/action";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const ConnectedDisplay = () => {
  const { isConnected, address } = useAccount();
  return (
    <div className="flex items-center gap-4">
      {isConnected && address && (
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium min-w-[40px]"
          >
            <Jazzicon
              diameter={40}
              seed={jsNumberForAddress(address || "")}
              paperStyles={{ borderRadius: "50%" }}
            />{" "}
            <span className="hidden text-sm md:inline-block">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectedDisplay;
