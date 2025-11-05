import InputBox from "@/components/common/inputBox";
import ResponseBox from "@/components/common/responseBox/ChatInterfaceBox";
import "./index.scss";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { useEffect, useRef, useState } from "react";
import {
  fetchUserData,
  resetGlobalData,
  setGlobalData,
  validateToken,
} from "@/redux/globalData/action";
import WalletConnectPopup from "@/components/common/customWalletConnect";
import Assets from "@/components/chat/Assets";
import WrongNetworkPopup from "@/components/common/wrongNetworkPopup";
import TransactionHistory from "@/components/chat/TransactionHistory";
import ChatBox from "@/components/chat/chatBox";
import TransactionResponseBox from "@/components/common/responseBox/TransactionResponseBox";

function Chat() {
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token } = globalData || {};
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [isWrongNetworkPopupOpened, setIswrongNetworkpopupOpened] =
    useState<boolean>(false);
  const [chatBoxWidth, setChatBoxWidth] = useState(70); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      e.preventDefault();
      const container: any = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 80%
      const clampedWidth = Math.min(Math.max(newWidth, 20), 80);
      setChatBoxWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    if (isDragging) {
      // Disable text selection globally during drag
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging]);

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
    <div className="flex flex-col w-screen h-[calc(100vh-68px)]">
      <div className="relative flex flex-col justify-end w-full h-full mixbls border-zinc-800">
        <div ref={containerRef} className="flex justify-end w-full h-full">
          <TransactionHistory />

          <div
            style={{ width: `${chatBoxWidth}%` }}
            className="relative z-30 flex flex-col justify-end h-full p-4 mx-auto overflow-auto border-x border-zinc-800"
          >
            <TransactionResponseBox />
          </div>
          <div
            onMouseDown={() => setIsDragging(true)}
            className={`w-[2px] hover:w-[4px] mix-blend-soft bg-zinc-800 hover:bg-blue-500 cursor-col-resize transition-colors relative group ${
              isDragging ? "bg-blue-500" : ""
            }`}
          >
            <div className="absolute inset-y-0 w-4 -left-2" />
          </div>
          <ChatBox width={chatBoxWidth} ref={chatBoxRef} />
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
