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
    <div className="relative flex flex-col justify-end w-full h-screen p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent via-10% via-90% to-black/50 pointer-events-none z-20"></div>

      <img src={BackgroundImage} className="absolute bottom-0 z-0" />
      <div className="flex flex-col justify-end h-[calc(100%-40px)] w-full gap-0 lg:max-w-[60%] mx-auto z-30">
        <ResponseBox />
        <InputBox />
      </div>
      <WalletConnectPopup isCenterAlignPopupOpen={!token || !isConnected} />
    </div>
  );
}

export default Chat;
