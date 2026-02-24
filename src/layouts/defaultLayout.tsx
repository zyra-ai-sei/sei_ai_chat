import WebThreeProvider from "@/hooks/useWeb3Context";
import TransactionContextProvider from "@/components/common/Transaction/TransactionContextProvider";
import AlertProvider from "@/hooks/useAlert";
import Toast from "@/components/common/toast";

import { useAppSelector } from "@/hooks/useRedux";
import { sseManager } from "@/sseManager";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useChainId } from "wagmi";
import { getChainById } from "@/config/chains";

function DefaultLayout({
  MainContentComponent,
}: {
  MainContentComponent: React.FC;
}) {
  const isMobile = useAppSelector((state) => state?.globalData?.isMobile);
  const { getAccessToken, authenticated, ready } = usePrivy();
  const chainId = useChainId();
  const network = getChainById(chainId);

  useEffect(() => {
    if (!ready || !authenticated || !network?.id) {
      return;
    }

    let isMounted = true;

    const init = async () => {
      try {
        const token = await getAccessToken();
        if (!isMounted) return;
        if (token) {
          sseManager.connect(token, network.id);
        }
      } catch (error) {
        console.error("Failed to initialize SSE connection:", error);
      }
    };

    init();

    return () => {
      isMounted = false;
      sseManager.disconnect();
    };
  }, [ready, authenticated, network?.id, getAccessToken]);

  return (
    <WebThreeProvider>
      <AlertProvider>
        <Toast />
        <TransactionContextProvider>
          <div className="font-sans ">
            <div
              className={`${isMobile ? "" : " mx-auto"} flex flex-col overflow-hidden mx-auto relative`}
            >
              <div className="flex-1 overflow-hidden">
                <MainContentComponent />
              </div>
            </div>
          </div>
        </TransactionContextProvider>
      </AlertProvider>
    </WebThreeProvider>
  );
}

export default DefaultLayout;
