import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import okxIcon from "@/assets/walletPopup/okx.png";
import metamaskIcon from "@/assets/walletPopup/metamask.png";
import coinbaseIcon from "@/assets/walletPopup/coinbase.png";
import walletconnectIcon from "@/assets/walletPopup/walletconnect.png";

const WalletConnectModal = () => {
  const [_, setIsSignatureVerificationOpen] =
    useState(false);
  const { isConnected, connector: myConnector } = useAccount();
  const { connect, connectors, isPending } = useConnect({
    mutation: {
      onSettled: () => {
        setIsSignatureVerificationOpen(true);
      },
    },
  });
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(
    null
  );

  const IdtoIcon = {
    walletConnect: walletconnectIcon,
    coinbaseWalletSDK: coinbaseIcon,
    "io.metamask": metamaskIcon,
    okxwallet: okxIcon,
  };
  useEffect(() => {
    if (isConnected) {
      setIsSignatureVerificationOpen(true);
    } else {
      setIsSignatureVerificationOpen(false);
    }
  }, [isConnected]);
  return (
    <div className="p-[1px] bg-gradient-to-r from-[#7CABF9] to-[#B37AE8] rounded-[24px]">
      <div className="flex flex-col items-center gap-4 p-[24px] rounded-[24px] bg-[#18171C]">
     
        <div className="text-[24px] text-white w-full">Connect Your Wallet</div>
        <div className="rounded-[12px] overflow-hidden w-full">
          {connectors.map((connector, idx) => (
            <button
              key={connector.id}
              onClick={() => {
                setPendingConnectorId(connector.id);
                connect({ connector: connector });
              }}
              className={`w-full hover:bg-white/10 min-h-[40px] ${idx == 0 ? "" : "border-t border-[#3B3A3E]"} p-4 flex gap-3 items-center justify-start text-white font-medium ${connector.id == myConnector?.id ? "bg-[#3B83F7]" : "bg-[#212025]"}  `}
            >
              {isPending && pendingConnectorId === connector.id ? (
                <div className="w-[42px] h-[42px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <img
                  src={
                    IdtoIcon[connector.id as keyof typeof IdtoIcon]
                      ? IdtoIcon[connector.id as keyof typeof IdtoIcon]
                      : connector.icon
                  }
                  className="w-[42px] h-[42px] border border-primary-border p-1 rounded-[8px]"
                />
              )}
              {connector.name}
            </button>
          ))}
        </div>
        <div className="text-[12px] text-[#FFFFFF99]">
          By connecting a wallet, you agree to Uniswap Lab’s terms of service
          and consent to its privacy policy
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
