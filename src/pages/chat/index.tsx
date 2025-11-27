import "./index.scss";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useRef, useState } from "react";
import {
  fetchUserData,
  resetGlobalData,
  validateToken,
} from "@/redux/globalData/action";
import ChatBox from "@/components/chat/chatBox";
import TransactionResponseBox from "@/components/common/responseBox/TransactionResponseBox";
import { TransactionNavigationProvider } from "@/contexts/TransactionNavigationContext";

function Chat() {
  // Select only token to avoid re-renders when other globalData properties change
  const token = useAppSelector((state) => state?.globalData?.data?.token);
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

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
        setUserData: () => {},
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
    <TransactionNavigationProvider>
      <div className="flex flex-col w-screen h-[calc(100vh-68px)]">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56, 189, 248, 0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex flex-col justify-end w-full h-full mixbls border-zinc-800">
          <div ref={containerRef} className="flex justify-end w-full h-full">
            <div
              style={{ width: `${chatBoxWidth}%` }}
              className="relative z-30 flex flex-col justify-end h-full p-4 mx-auto overflow-auto border-x border-zinc-800"
            >
              <TransactionResponseBox />
            </div>
            <div
              onMouseDown={() => setIsDragging(true)}
              className={`w-[2px] hover:w-[4px] mix-blend-soft bg-zinc-800 hover:bg-blue-500 cursor-col-resize transition-colors relative group z-40 ${
                isDragging ? "bg-blue-500" : ""
              }`}
            >
              <div className="absolute inset-y-0 w-4 -left-2" />
            </div>
            <ChatBox width={chatBoxWidth} ref={chatBoxRef} />
          </div>
        </div>
      </div>
    </TransactionNavigationProvider>
  );
}

export default Chat;
