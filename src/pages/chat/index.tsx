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
import WrongNetworkPopup from "@/components/common/wrongNetworkPopup";
import LeftSidebar from "@/components/chat/LeftSidebar";
import MainChatArea from "@/components/chat/MainChatArea";
import RightSidebar from "@/components/chat/RightSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import SignatureVerification from "@/components/common/customWalletConnect/SignatureVerification";

interface Message {
  type: "user" | "bot";
  content: string;
}

function Chat() {
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { token } = globalData || {};
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [isWrongNetworkPopupOpened, setIswrongNetworkpopupOpened] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSignatureVerificationOpen, setIsSignatureVerificationOpen] = useState(false);
  const [isWalletPanelOpen, setIsWalletPanelOpen] = useState(false);

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

  useEffect(() => {
    if (isConnected) {
      setIsSignatureVerificationOpen(true);
      setIsWalletPanelOpen(false); // Close wallet panel when connected
    } else {
      setIsSignatureVerificationOpen(false);
    }
  }, [isConnected]);

  const handleSendMessage = (message: string) => {
    // Add user message
    const newUserMessage: Message = {
      type: "user",
      content: message,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Check if wallet is connected
    if (!token || !isConnected) {
      // Add bot response prompting to connect wallet
      setTimeout(() => {
        const botResponse: Message = {
          type: "bot",
          content:
            "Oh looks like you are not logged in yet! please connect to a wallet to get started",
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 500);
    } else {
      // Handle actual message processing when connected
      // TODO: Integrate with existing chat logic
    }
  };

  const toggleWalletPanel = () => {
    setIsWalletPanelOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0D0C11] overflow-hidden">
      {/* Top Header */}
      <ChatHeader onToggleWalletPanel={toggleWalletPanel} isWalletConnected={isConnected && !!token} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <MainChatArea messages={[]} />
        </div>

        {/* Right Sidebar with Chat Input and Messages */}
        <RightSidebar
          isWalletConnected={isConnected && !!token}
          onSendMessage={handleSendMessage}
          messages={messages}
          isWalletPanelOpen={isWalletPanelOpen}
          onCloseWalletPanel={() => setIsWalletPanelOpen(false)}
        />
      </div>

      {/* Signature Verification Modal */}
      <SignatureVerification
        isCenterAlignPopupOpen={isSignatureVerificationOpen}
        setIsCenterAlignPopupOpen={setIsSignatureVerificationOpen}
      />

      {/* Wrong Network Popup */}
      <WrongNetworkPopup
        isCenterAlignPopupOpen={isWrongNetworkPopupOpened}
        setIsCenterAlignPopupOpen={setIswrongNetworkpopupOpened}
        isNonClosable
      />
    </div>
  );
}

export default Chat;
