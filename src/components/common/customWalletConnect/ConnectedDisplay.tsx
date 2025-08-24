import { useAccount, useDisconnect } from "wagmi";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import LogoutIcon from "@/assets/header/logout.svg?react"
import { logoutUserRequest, resetGlobalData } from "@/redux/globalData/action";
import { useAppDispatch } from "@/hooks/useRedux";

const ConnectedDisplay = () => {
  const { isConnected, address } = useAccount();
  const dispatch = useAppDispatch();
    const { disconnect } = useDisconnect({
      mutation: {
        onSettled() {
          dispatch(logoutUserRequest({}));
          dispatch(resetGlobalData());
        },
      },
    });
  return (
    <div className="flex items-center gap-4 p-2">
      {isConnected && address && (
        <div className="relative flex items-center justify-between w-full gap-2 px-2">
          <div className="flex items-center gap-2 text-white font-medium min-w-[40px]">
            <Jazzicon
              diameter={40}
              seed={jsNumberForAddress(address || "")}
              paperStyles={{ borderRadius: "50%" }}
            />{" "}
            <span className="hidden text-sm md:inline-block text-white/80">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>

          <LogoutIcon onClick={()=>disconnect()} className="size-[28px] text-white/80 cursor-pointer"/>
        </div>
      )}
    </div>
  );
};

export default ConnectedDisplay;
