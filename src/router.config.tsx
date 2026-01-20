import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/pageNotFound";
import DefaultLayout from "./layouts/defaultLayout";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import React, { Suspense, useEffect } from "react";

import { useAccount, useDisconnect } from "wagmi";

import useScreenWidth from "./hooks/useScreenWidth";
import { setGlobalData } from "./redux/globalData/action";

import DefaultAppLayout from "./layouts/defaultAppLayout";

const Home = React.lazy(() => import("./pages/home"));
const Chat = React.lazy(() => import("./pages/chat"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

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
      dispatch(setGlobalData({ ...globalData, eoaAddress: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    // Listen for the PWA installation event
    const handleAppInstalled = () => {
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
      <Suspense
        fallback={
          <div className="h-screen bg-[#0B0F1A] flex items-center justify-center text-white">
            <div className="w-12 h-12 border-2 border-white/20 border-t-[#2AF598] rounded-full animate-spin" />
          </div>
        }
      >
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
      </Suspense>
    </Router>
  );
}

export default RouterConfig;
