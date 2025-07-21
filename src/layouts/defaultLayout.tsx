import Header from "@/components/common/header";
import "../components/icons/index.scss";
import WebThreeProvider from "@/hooks/useWeb3Context";
import TransactionContextProvider from "@/components/common/Transaction/TransactionContextProvider";
import AlertProvider from "@/hooks/useAlert";
import Toast from "@/components/common/toast";

import EarlyFanProgressbar from "./components/EarlyFanProgressbar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import {
  fetchUserData,
  logoutUserRequest,
  resetGlobalData,
  setGlobalData,
  validateToken,
} from "@/redux/globalData/action";
import { useNavigate } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { AuthStatusEnum } from "@/enum/utility.enum";
import { fetchReleaseNotes } from "@/utility/releaseNotes";
import bgImage from '@/assets/common/background.jpeg';
import "./index.scss"

function DefaultLayout({
  MainContentComponent,
  isBackNavigation,
}: {
  MainContentComponent: React.FC;
  isBackNavigation?: boolean;
}) {
  const isEarlyFan = useAppSelector(
    (state) => state?.globalData?.data?.isEarlyFan
  );
  const globalData = useAppSelector((state) => state?.globalData?.data);
  const isMobile = useAppSelector((state) => state?.globalData?.isMobile);
  const { token, isPWAOpened, eoaAddress, name } = globalData || {};
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const referralCodeParams = window?.location?.href?.split("inviteCode=")?.[1];
  const [isWelcomeBackPopupOpened, setIsWelcomeBackPopupOpened] =
    useState<boolean>(false);
  const [authStatus, setAuthStatus] = useState<AuthStatusEnum>(
    AuthStatusEnum.Default
  );
  const [releaseNotes, setReleaseNotes] = useState<{
    version: string;
    changes: string[];
  } | null>(null);

  useEffect(() => {
    if (!token || !isConnected) {
      return;
    }

    dispatch(
      fetchUserData({
        setUserData: (name, email, earlyFan, tgVerified, referralCode) => {
          if (!name) {
            setAuthStatus(AuthStatusEnum.Default);
            navigate("/profile");
          }
          dispatch(
            setGlobalData({
              ...globalData,
              userEmail: email,
              name: name,
              isEarlyFan: earlyFan,
              isEmailVerified: email?.length > 0,
              referralCode: referralCode,
              inviteCode: referralCodeParams,
              tgVerified,
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

  const handleSetWelcomeBackPopupOpened: React.Dispatch<
    React.SetStateAction<boolean>
  > = (value) => {
    setIsWelcomeBackPopupOpened(value);
  };

  const handleRefresh = async () => {
    if (isPWAOpened) {
      window?.location?.reload();
    }
  };

  useEffect(() => {
    if (token) {
      if (authStatus === AuthStatusEnum.LoggedOut)
        setAuthStatus(AuthStatusEnum.NewLogin);
    } else {
      setAuthStatus(AuthStatusEnum.LoggedOut);
    }
    if (name) {
      if (authStatus === AuthStatusEnum.NewLogin)
        fetchReleaseNotes(
          (data: { version: string; changes: string[] } | null) => {
            if (data) {
              setReleaseNotes({
                version: data?.version,
                changes: data?.changes,
              });
            }
            setIsWelcomeBackPopupOpened(true);
          }
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, token]);

  return (
    <WebThreeProvider>
      <AlertProvider>
        <Toast />
        <TransactionContextProvider>
          <div className="h-screen overflow-hidden  bg-[#020617]">
            <div
            id="bg"
            // style={{background:`url(${bgImage})`,backgroundSize:'', backgroundPosition:'bottom', backgroundRepeat:'no-repeat'}}
              className={`${isMobile ? "h-screen" : " mx-auto h-screen"} flex flex-col overflow-hidden max-w-[1440px] mx-auto`}
            >
              {isEarlyFan && <EarlyFanProgressbar />}
              <Header isBackNavigation={isBackNavigation} />
              
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
