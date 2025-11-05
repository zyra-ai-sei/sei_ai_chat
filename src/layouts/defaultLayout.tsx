import "../components/icons/index.scss";
import WebThreeProvider from "@/hooks/useWeb3Context";
import TransactionContextProvider from "@/components/common/Transaction/TransactionContextProvider";
import AlertProvider from "@/hooks/useAlert";
import Toast from "@/components/common/toast";
import Navbar from '@/components/navbar';

import { useAppSelector } from "@/hooks/useRedux";

function DefaultLayout({
  MainContentComponent,
  showNavbar = false,
}: {
  MainContentComponent: React.FC;
  showNavbar?: boolean;
}) {

  const isMobile = useAppSelector((state) => state?.globalData?.isMobile);

  return (
    <WebThreeProvider>
      <AlertProvider>
        <Toast />
        <TransactionContextProvider>
          <div className="font-sans ">
            <div
              className={`${isMobile ? "" : " mx-auto"} flex flex-col overflow-hidden mx-auto relative`}
            >
              {showNavbar && <Navbar />}
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
