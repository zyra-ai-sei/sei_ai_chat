import { withCenterAlignPopup } from "@/hoc/withCenterAlignedPopup";
import React, { useState } from "react";
import { useConnect, useConnections } from "wagmi";
import okxIcon from "@/assets/walletPopup/okx.png";
import metamaskIcon from "@/assets/walletPopup/metamask.png";
import coinbaseIcon from "@/assets/walletPopup/coinbase.png";
import walletconnectIcon from "@/assets/walletPopup/walletconnect.png";

const WalletConnectModal = () => {

  const {} = useConnections();
  const { connect, connectors, isPending, isSuccess } = useConnect();
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null);

  const IdtoIcon = {
    walletConnect: walletconnectIcon,
    coinbaseWalletSDK: coinbaseIcon,
    "io.metamask": metamaskIcon,
    okxwallet: okxIcon,
  };
  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-white/10 rounded-3xl backdrop-blur-2xl bg-white/5">
      <div className="text-[24px] text-white">Connect Your Wallet</div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => {
            setPendingConnectorId(connector.id);
            connect({ connector:connector });
          }}
          className="w-full border border-white/10 hover:bg-white/10 rounded-full min-h-[40px] flex gap-3 items-center justify-center text-white font-medium"
        >
          {isPending && pendingConnectorId === connector.id ? (
            <div className="w-[25px] h-[25px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <img
              src={
                IdtoIcon[connector.id as keyof typeof IdtoIcon]
                  ? IdtoIcon[connector.id as keyof typeof IdtoIcon]
                  : connector.icon
              }
              className="w-[25px] h-[25px]"
            />
          )}
          {connector.name}
        </button>
      ))}
    </div>
  );
};

const WalletConnectPopup = withCenterAlignPopup(WalletConnectModal);

export default WalletConnectPopup;
