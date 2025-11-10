import { useState, useRef, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { motion } from "framer-motion";
import metamaskIcon from "@/assets/walletPopup/metamask.png";
import coinbaseIcon from "@/assets/walletPopup/coinbase.png";
import okxIcon from "@/assets/walletPopup/okx.png";
import walletconnectIcon from "@/assets/walletPopup/walletconnect.png";
import avatarImg from "@/assets/home/avatar.png";

interface Message {
  type: "user" | "bot";
  content: string;
}

interface RightSidebarProps {
  isWalletConnected: boolean;
  onSendMessage: (message: string) => void;
  messages: Message[];
  isWalletPanelOpen: boolean;
  onCloseWalletPanel: () => void;
}

const RightSidebar = ({ isWalletConnected, onSendMessage, messages, isWalletPanelOpen, onCloseWalletPanel }: RightSidebarProps) => {
  const { connect, connectors, isPending } = useConnect();
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null);
  const { address } = useAccount();
  const [width, setWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const IdtoIcon = {
    walletConnect: walletconnectIcon,
    coinbaseWalletSDK: coinbaseIcon,
    "io.metamask": metamaskIcon,
    okxwallet: okxIcon,
  };

  const getWalletDisplayName = (connectorId: string, connectorName: string) => {
    if (connectorId === "io.metamask") return "MetaMask";
    if (connectorId === "coinbaseWalletSDK") return "Coinbase Wallet";
    if (connectorId === "okxwallet") return "Binance Wallet";
    if (connectorId === "walletConnect") return "Phantom Wallet";
    return connectorName;
  };

  // Resize handlers
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 320 && newWidth <= 800) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Chat input handlers
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="relative h-full bg-[#0D0C11] border-l border-white/10 flex flex-col"
    >
      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-[#3B82F6]/50 transition-colors ${
          isResizing ? "bg-[#3B82F6]" : ""
        }`}
      />

      {/* Messages Display OR Wallet Connection */}
      <div className="flex-1 overflow-auto">
        {isWalletPanelOpen && !isWalletConnected ? (
          // Show Wallet Connection UI when panel is open and not connected
          <>
            <div className="p-4 flex flex-col gap-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-lg font-['Figtree',sans-serif] font-semibold">
                  Connect a wallet
                </h2>
                <button
                  onClick={onCloseWalletPanel}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Uniswap Mobile - Primary Option */}
              <div className="flex flex-col gap-2">
                <button className="w-full p-4 bg-[#3B82F6] rounded-xl hover:bg-[#3B82F6]/90 transition-colors flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF007A">
                      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-['Figtree',sans-serif] font-medium text-sm">
                      Uniswap mobile
                    </p>
                    <p className="text-white/70 font-['Figtree',sans-serif] text-xs">
                      Scan QR code to connect
                    </p>
                  </div>
                </button>

                {/* Uniswap Mobile - Secondary Option */}
                <button className="w-full p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="5" height="5" fill="white" />
                      <rect x="9" y="2" width="5" height="5" fill="white" />
                      <rect x="2" y="9" width="5" height="5" fill="white" />
                      <rect x="9" y="9" width="5" height="5" fill="white" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-['Figtree',sans-serif] text-sm">
                      Uniswap mobile
                    </p>
                    <p className="text-white/50 font-['Figtree',sans-serif] text-xs">
                      Scan QR code to connect
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Other wallets section */}
            <div className="p-4">
              <p className="text-white/50 text-xs font-['Figtree',sans-serif] mb-3">
                Other wallets
              </p>

              <div className="flex flex-col gap-2">
                {connectors.map((connector) => {
                  const icon = IdtoIcon[connector.id as keyof typeof IdtoIcon];
                  const displayName = getWalletDisplayName(connector.id, connector.name);
                  const isDetected = connector.id === "io.metamask";

                  return (
                    <button
                      key={connector.id}
                      onClick={() => {
                        setPendingConnectorId(connector.id);
                        connect({ connector });
                      }}
                      disabled={isPending && pendingConnectorId === connector.id}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {isPending && pendingConnectorId === connector.id ? (
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <img
                            src={icon || connector.icon}
                            alt={displayName}
                            className="w-8 h-8 rounded-lg"
                          />
                        )}
                        <span className="text-white font-['Figtree',sans-serif] text-sm">
                          {displayName}
                        </span>
                      </div>
                      {isDetected && (
                        <span className="text-white/50 text-xs font-['Figtree',sans-serif]">
                          Detected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Terms and Privacy */}
              <p className="text-white/30 text-[10px] font-['Figtree',sans-serif] mt-4 leading-relaxed">
                By connecting a wallet, you agree to Uniswap Lab's terms of service and consent to its privacy policy
              </p>
            </div>
          </>
        ) : messages.length > 0 ? (
          // Show Messages
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="flex gap-3 max-w-[90%]">
                    {/* Bot Avatar */}
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <div className="absolute inset-0 rounded-full blur-[8px] opacity-60"
                           style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                      <img src={avatarImg} alt="Zyra" className="w-8 h-8 object-contain relative z-10" />
                    </div>

                    {/* Bot Message */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-white text-sm font-['Figtree',sans-serif] leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}

                {message.type === "user" && (
                  <div className="bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[90%]">
                    <p className="text-white text-sm font-['Figtree',sans-serif] leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          // Empty state - Connected but no messages yet
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full blur-[16px] opacity-60"
                     style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                <img src={avatarImg} alt="Zyra" className="w-20 h-20 object-contain relative z-10" />
              </div>
              <p className="text-white/60 text-sm font-['Figtree',sans-serif]">
                {isWalletConnected ? "Start a conversation" : "Connect your wallet to get started"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input at Bottom */}
      <div className="border-t border-white/10 bg-[#0D0C11] p-4">
        <div className="flex flex-col gap-2">
          {/* Input Field */}
          <div className="flex items-end gap-3 bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe your blockchain transaction..."
              className="flex-1 bg-transparent text-white text-sm font-['Figtree',sans-serif] placeholder-white/40 outline-none resize-none min-h-[24px] max-h-[120px] scrollbar-thin scrollbar-thumb-white/10"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                message.trim()
                  ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                  : "bg-white/10 cursor-not-allowed"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 10H17M17 10L12 5M17 10L12 15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-white/30 text-xs font-['Figtree',sans-serif] text-center">
            Zyra can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
