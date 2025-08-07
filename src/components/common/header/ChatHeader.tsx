import ConnectedDisplay from "../customWalletConnect/ConnectedDisplay";
import Logout from "@/assets/header/logout.svg?react";
import { useDisconnect } from "wagmi";
import { logoutUserRequest, resetGlobalData } from "@/redux/globalData/action";
import { useAppDispatch } from "@/hooks/useRedux";
import Icon from "@/assets/common/icon.svg";


const ChatHeader = () => {
  const { disconnect } = useDisconnect({
    mutation: {
      onSettled() {
        dispatch(logoutUserRequest({}));
        dispatch(resetGlobalData());
      },
    },
  });
  const dispatch = useAppDispatch();
  return (
    <div className="w-full h-[80px] border-b border-b-gray-500/50 flex justify-between items-center px-4 gap-1">
      <ConnectedDisplay />
      <div className="flex items-center justify-center gap-2 h-[80px]">
        <img src={Icon} className="size-[18px] md:size-[24px]" />
        <h1 className="font-bold text-white text-[14px] md:text-[18px]">
          Zyra.ai
        </h1>
      </div>
      <Logout
        onClick={() => disconnect()}
        className="w-8 h-8 text-blue-300/60 hover:text-red-400"
      />
    </div>
  );
};

export default ChatHeader;
