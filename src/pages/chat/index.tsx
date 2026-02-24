import "./index.scss";
import { useEffect, useRef, useState } from "react";

import ChatBox from "@/components/chat/chatBox";
import TransactionResponseBox from "@/components/common/responseBox/TransactionResponseBox";
import { TransactionNavigationProvider } from "@/contexts/TransactionNavigationContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAccount, useChainId } from "wagmi";
import { getChainById } from "@/config/chains";
import { getChatHistory, setHistoryLoading } from "@/redux/chatData/action";
import iconSvg from "@/assets/icon.svg";
import MobileViewToggle from "@/components/chat/MobileViewToggle";
import { SEO } from "@/components/common/SEO";

function Chat() {
  const historyLoading = useAppSelector(
    (state) => state.chatData.historyLoading,
  );
  const chats = useAppSelector((state) => state.chatData.chats);
  const { address } = useAccount();
  const chainId = useChainId();
  const network = getChainById(chainId);
  const dispatch = useAppDispatch();

  const [activeView, setActiveView] = useState<"chat" | "canvas">("chat");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (address) {
      dispatch(getChatHistory({ address: address!, network: network?.id }));
    } else {
      // If no address is found after initial mount, we shouldn't show the history loader
      // typically address will be available if user is already logged in
      const timeout = setTimeout(() => {
        if (!address) {
          dispatch(setHistoryLoading(false));
        }
      }, 5000); // 5 second grace period for wagmi/privy to init
      return () => clearTimeout(timeout);
    }
  }, [address, chainId, dispatch]);

  const [chatBoxWidth, setChatBoxWidth] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 1090) return 50;
    }
    return 70;
  }); // percentage

  // Update chatBoxWidth on resize for 1090px breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
      if (window.innerWidth < 1090) {
        setChatBoxWidth(50);
      } else {
        setChatBoxWidth(70);
      }
    };
    handleResize(); // trigger initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

  if (historyLoading && chats.length === 0) {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-164px)] items-center justify-center bg-[#0a0d14] relative">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56, 189, 248, 0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-[#2AF598] rounded-full animate-spin" />
            <img src={iconSvg} alt="Zyra" className="absolute w-6 h-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TransactionNavigationProvider>
      <SEO
        title="AI Chat"
        description="Interact with Zyra AI, the advanced conversational AI crypto trading assistant. Manage your portfolio and execute intelligent strategies effortlessly."
      />
      <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56, 189, 248, 0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {isMobile && (
          <div className="relative z-50 flex-none">
            <MobileViewToggle
              activeView={activeView}
              onToggle={setActiveView}
            />
          </div>
        )}
        <div className="relative flex-1 flex flex-col justify-end w-full min-h-0 mixbls border-zinc-800">
          <div
            ref={containerRef}
            className="flex justify-end w-full h-full min-h-0"
          >
            {(!isMobile || activeView === "canvas") && (
              <div
                style={{ width: isMobile ? "100%" : `${chatBoxWidth}%` }}
                className="relative z-30 flex flex-col justify-end h-full p-4 mx-auto overflow-hidden "
              >
                <TransactionResponseBox />
              </div>
            )}
            {!isMobile && (
              <div
                onMouseDown={() => setIsDragging(true)}
                className={`w-[2px] hover:w-[4px] mix-blend-soft bg-zinc-800 hover:bg-blue-500 cursor-col-resize transition-colors relative group z-40 ${
                  isDragging ? "bg-blue-500" : ""
                }`}
              >
                <div className="absolute inset-y-0 w-4 -left-2" />
              </div>
            )}
            {(!isMobile || activeView === "chat") && (
              <ChatBox width={isMobile ? 0 : chatBoxWidth} ref={chatBoxRef} />
            )}
          </div>
        </div>
      </div>
    </TransactionNavigationProvider>
  );
}

export default Chat;
