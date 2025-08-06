import InputBox from "@/components/common/inputBox";
import ResponseBox from "@/components/common/responseBox";
import "./index.scss";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from "react";
import {
  fetchUserData,
  resetGlobalData,
  setGlobalData,
  validateToken,
} from "@/redux/globalData/action";
import WalletConnectPopup from "@/components/common/customWalletConnect";
import BackgroundImage from "@/assets/common/HeroBg.jpg";
import ChatHeader from "@/components/common/header/ChatHeader";
import TransactionHistory from "@/components/Components/TransactionHistory";
import Suggestions from "@/components/Components/Suggestions";

function Chat() {
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token } = globalData || {};
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!token || !isConnected) {
      return;
    }

    dispatch(
      fetchUserData({
        setUserData: () => {
          dispatch(
            setGlobalData({
              ...globalData,
            })
          );
        },
      })
    );
    dispatch(
      validateToken({
        onSuccessCb: () => {},
        onFailureCb: () => {
          disconnect();
          dispatch(resetGlobalData());
        },
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="relative flex flex-col justify-end w-full h-screen overflow-scroll ">
      <div className="flex justify-end h-full overflow-scroll">
        <div className="h-full w-[310px] min-w-[250px] border-r border-gray-500/50 flex flex-col p-2">
          <Suggestions />
          <TransactionHistory />
        </div>
        <div className="relative z-30 flex flex-col justify-end w-full h-screen gap-0 mx-auto overflow-scroll">
          <ChatHeader />
          <div className="z-30 p-4 h-[calc(100%-80px)] w-full overflow-auto relative flex flex-col justify-end max-w-[1440px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent via-10% via-90% to-black/50 pointer-events-none z-20"></div>
            <img src={BackgroundImage} className="absolute bottom-0 left-0 " />
            <ResponseBox />
            <InputBox />
          </div>
        </div>
      </div>
      <WalletConnectPopup isCenterAlignPopupOpen={!token || !isConnected} />
    </div>
  );
}

export default Chat;
