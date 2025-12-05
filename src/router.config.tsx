import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/pageNotFound";
import Chat from "./pages/chat";
import DefaultLayout from "./layouts/defaultLayout";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { useEffect } from "react";

import { useAccount, useDisconnect } from "wagmi";

import useScreenWidth from "./hooks/useScreenWidth";
import { setGlobalData } from "./redux/globalData/action";

import Home from "./pages/home";
import DefaultAppLayout from "./layouts/defaultAppLayout";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";

function RouterConfig() {
  const dispatch = useAppDispatch();

  const globalData = useAppSelector((state) => state?.globalData?.data);
  const { eoaAddress } = globalData || {};

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

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
          element={
            <DefaultAppLayout
              MainContentComponent={() => (
                <DefaultLayout MainContentComponent={Chat} />
              )}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DefaultAppLayout
              MainContentComponent={() => (
                <DefaultLayout MainContentComponent={Dashboard} />
              )}
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <DefaultAppLayout
              MainContentComponent={() => (
                <DefaultLayout MainContentComponent={Transactions} />
              )}
            />
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default RouterConfig;
