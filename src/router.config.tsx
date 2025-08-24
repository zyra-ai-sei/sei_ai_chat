import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/pageNotFound";
import Chat from "./pages/chat";
import DefaultLayout from "./layouts/defaultLayout";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { useEffect, useState } from "react";

import { useAccount, useChainId, useDisconnect } from "wagmi";
import WrongNetworkPopup from "./components/common/wrongNetworkPopup";

import useScreenWidth from "./hooks/useScreenWidth";
import { setGlobalData } from "./redux/globalData/action";

import useLocalStorage from "./hooks/useLocalStorage";
import { LocalStorageIdEnum } from "./enum/utility.enum";
import Home from "./pages/home";


function RouterConfig() {
  const dispatch = useAppDispatch();
  const [isWrongNetworkPopupOpened, setIswrongNetworkpopupOpened] =
    useState<boolean>(false);

  const [isIsPwaFirstTime, setIsPwaFirstTime] = useLocalStorage(
    LocalStorageIdEnum.IS_PWA_FIRST_TIME,
    true
  );

  const globalData = useAppSelector((state) => state?.globalData?.data);
  const {
    isPWAOpened,
    eoaAddress,
  } = globalData || {};

  const isMobile = useAppSelector((state) => state?.globalData?.isMobile);


  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId()


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
    console.log('chainid', chainId, chain?.id)
  }, [chainId]);

  useScreenWidth();

  useEffect(() => {
    if (
      isConnected &&
      address &&
      eoaAddress &&
      address?.toLowerCase() !== eoaAddress.toLowerCase()
    ) {
      disconnect();
      dispatch(setGlobalData({ ...globalData, token: "", eoaAddress: "" }));

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (!isPWAOpened && isMobile && isIsPwaFirstTime) {
      setTimeout(() => {
        setIsPwaFirstTime(false);
      }, 60000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Listen for the PWA installation event
    const handleAppInstalled = () => {
      console.log("PWA was installed");
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "PWA Installed", {
          event_category: "Engagement",
          event_label: "PWA Install",
          value: 1,
        });
      }
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Cleanup event listener
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<DefaultLayout MainContentComponent={Home} />}
        />
        <Route
          path="/chat"
          element={<DefaultLayout MainContentComponent={Chat} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <WrongNetworkPopup
        isCenterAlignPopupOpen={isWrongNetworkPopupOpened}
        setIsCenterAlignPopupOpen={setIswrongNetworkpopupOpened}
        isNonClosable
      />
    </Router>
  );
}

export default RouterConfig;
