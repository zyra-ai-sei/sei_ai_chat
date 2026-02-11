import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/defaultLayout";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { useEffect, lazy, Suspense } from "react";

import { useAccount, useDisconnect } from "wagmi";

import useScreenWidth from "./hooks/useScreenWidth";
import { setGlobalData } from "./redux/globalData/action";

import DefaultAppLayout from "./layouts/defaultAppLayout";

// Lazy load the pages
const Home = lazy(() => import("./pages/home"));
const Chat = lazy(() => import("./pages/chat"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const PageNotFound = lazy(() => import("./pages/pageNotFound"));

// Create a simple loading fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center w-full h-screen bg-[#0D0C11]">
    <div className="w-10 h-10 border-2 border-blue-500 rounded-full animate-spin border-t-transparent" />
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
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
          <Route
            path="/terms"
            element={<DefaultLayout MainContentComponent={Terms} />}
          />
          <Route
            path="/privacy"
            element={<DefaultLayout MainContentComponent={Privacy} />}
          />
          <Route
            path="/cookie-policy"
            element={<DefaultLayout MainContentComponent={CookiePolicy} />}
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default RouterConfig;
