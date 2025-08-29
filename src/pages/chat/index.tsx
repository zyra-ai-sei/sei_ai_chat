import InputBox from "@/components/common/inputBox";
import ResponseBox from "@/components/common/responseBox";
import "./index.scss";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import {
  fetchUserData,
  resetGlobalData,
  setGlobalData,
  validateToken,
} from "@/redux/globalData/action";
import WalletConnectPopup from "@/components/common/customWalletConnect";
import TransactionHistory from "@/components/Components/TransactionHistory";
import Assets from "@/components/Components/Assets";
import WrongNetworkPopup from "@/components/common/wrongNetworkPopup";

function Chat() {
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token } = globalData || {};
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [isWrongNetworkPopupOpened, setIswrongNetworkpopupOpened] =
    useState<boolean>(false);

  const chainId = useChainId();

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

  useEffect(() => {
    if (
      chainId &&
      chainId !== Number(import.meta.env?.VITE_BASE_CHAIN_ID) &&
      chainId !== Number(import.meta.env?.VITE_ALTERNATE_CHAIN_ID)
    ) {
      setIswrongNetworkpopupOpened(true);
    } else {
      setIswrongNetworkpopupOpened(false);
    }
  }, [chainId]);

  return (
    <div className="flex flex-col h-screen w-screen p-4 bg-gradient-to-tr from-[#0c04214d] via-[#12053454] to-[#4d02a838]">
      <div className="relative flex flex-col border rounded-[16px] border-zinc-800 justify-end h-full w-full">
        <div
          style={{ boxShadow: " -10vw 20vh 200px 17vw rgba(60,0,160,0.12)" }}
          className="absolute rounded-full top-[15vh] shadow-3xl size-4 right-[20vw] shadow-purple-200"
        ></div>
        <div className="flex justify-end w-full h-full">
          <TransactionHistory />

          <div className="relative z-30 flex flex-col justify-end flex-grow h-full p-4 mx-auto overflow-auto border-x border-zinc-800">
            <ResponseBox />
            <InputBox />
          </div>

          <Assets />
        </div>
        <WalletConnectPopup isCenterAlignPopupOpen={!token || !isConnected} />
        <WrongNetworkPopup
          isCenterAlignPopupOpen={isWrongNetworkPopupOpened}
          setIsCenterAlignPopupOpen={setIswrongNetworkpopupOpened}
          isNonClosable
        />
      </div>
    </div>
  );
}

export default Chat;
