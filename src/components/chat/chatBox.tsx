import React from "react";
import InputBox from "../common/inputBox";
import ChatInterfaceBox from "../common/responseBox/ChatInterfaceBox";
import WalletConnectModal from "../common/customWalletConnect";
import { useAppSelector } from "@/hooks/useRedux";

const ChatBox = React.forwardRef<HTMLDivElement, { width: number }>(
  ({ width }, ref) => {
    // Select only specific values to avoid re-renders when other globalData properties change
    const token = useAppSelector((state) => state?.globalData?.data?.token);
    const isConnectButtonClicked = useAppSelector((state) => state?.globalData?.data?.isConnectButtonClicked);
    return (
      <div
        ref={ref}
        style={{ width: `${100 - width}%` }}
        className="bg-background-2 max-h-[calc(100%)] flex flex-col relative"
      >
        <div className="flex-grow overflow-hidden text-white">
          <ChatInterfaceBox />
        </div>

        <div className="flex-shrink-0 w-full p-4 bg-background-secondary">
          <InputBox />
        </div>
        { !token && isConnectButtonClicked && (
          <div className="absolute right-0 z-50 p-1 top-1">
            <WalletConnectModal />
          </div>
        )}
      </div>
    );
  }
);

export default ChatBox;
