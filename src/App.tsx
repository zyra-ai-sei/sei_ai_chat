import { WagmiProvider } from "wagmi";
import "./App.css";
import RouterConfig from "./router.config";
import "@/scss/index.scss";
import { wagmiConfig } from "./config/wagmiConfig";
import useLocalStorage, { getLocalStorageData } from "./hooks/useLocalStorage";
import { LocalStorageIdEnum } from "./enum/utility.enum";

import { useEffect, useState } from "react";
import { useAppSelector } from "./hooks/useRedux";
import * as amplitude from "@amplitude/analytics-browser";
import trackUserEvent from "@/utility/amplitude";
import moengage from "./utility/moengage";
import CookiePopup from "@/components/popups/cookie";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cookieValue]: any = useLocalStorage(
    LocalStorageIdEnum.COOKIE_DATA,
    null
  );

  const [isCookiePopupOpen, setCookiePopupOpen] = useState(
    !cookieValue || !cookieValue.necessary
  );

  const globalData = useAppSelector((state) => state.globalData.data);
  useEffect(() => {
    try{

      if (globalData?.eoaAddress) {
        const userId = globalData.eoaAddress;
        const userName = globalData.name;
        amplitude.setUserId(userId);
        moengage.call_web_push({ soft_ask: false });
        if (globalData.userEmail) {
          moengage.add_email(globalData.userEmail);
        }
        if (globalData.name) {
          moengage.add_first_name(globalData.name);
          moengage.add_user_name(globalData.name);
        }
        moengage.add_unique_user_id(userId);
        
        trackUserEvent("user_engagement_session", {
          user_id: userId,
          user_name: userName,
          session_start_time: new Date().getTime(),
          is_referred_user: "NA",
        });
      }
    } catch(error){
      
    }
  }, [globalData.eoaAddress, globalData.name, globalData.userEmail]);

  const deletePerformanceCookies = () => {
    const cookies = document.cookie.split("; ");
    let cookieDeleted = false;
    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      if (
        name.startsWith("_ga") ||
        name.startsWith("moe") ||
        name.startsWith("amp") ||
        name.startsWith("AMP")
      ) {
        Cookies.remove(name, {
          domain: `.${window.location.hostname.split(".").slice(-3).join(".")}`,
        });
        Cookies.remove(name, {
          domain: `.${window.location.hostname.split(".").slice(-2).join(".")}`,
        });
        Cookies.remove(name);
        cookieDeleted = true;
      }
    });
    return cookieDeleted;
  };

  const deleteFunctionalCookies = () => {
    const cookies = document.cookie.split("; ");
    let cookieDeleted = false;
    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      if (
        name.includes("user_preferences") &&
        cookieValue.functional == false
      ) {
        Cookies.remove(name, {
          domain: `.${window.location.hostname.split(".").slice(-3).join(".")}`,
        });
        Cookies.remove(name, {
          domain: `.${window.location.hostname.split(".").slice(-2).join(".")}`,
        });
        Cookies.remove(name);
        cookieDeleted = true;
      }
    });
    return cookieDeleted || cookieValue.functional == false;
  };

  useEffect(() => {
    const cookieData = getLocalStorageData(LocalStorageIdEnum.COOKIE_DATA, {
      necessary: null,
      functional: null,
      performance: null,
    });
    const intervalId = setInterval(() => {
      const performaceCookieDeleted = false;
      const functionalCookieDeleted = false;
      if (cookieData && cookieData.performance === false) {
        deletePerformanceCookies();
      }
      if (cookieData && cookieData.functional === false) {
        deleteFunctionalCookies();
      }
      if (!performaceCookieDeleted && !functionalCookieDeleted) {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCookiePopupOpen, cookieValue]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>

        <RouterConfig />

        <CookiePopup
          isCenterAlignPopupOpen={isCookiePopupOpen}
          setIsCenterAlignPopupOpen={setCookiePopupOpen}
        />

      </QueryClientProvider>
    </WagmiProvider>
  );
}

const RootApp = () => {
  // console.log("Navigator::", navigator, "URL::", process.env.PUBLIC_URL);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`/serviceworker.js`)

        .then((registration) => {
          console.debug("process.env.PUBLIC_URL", process.env.PUBLIC_URL);
          console.debug(
            "ServiceWorker registration successful with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.debug("ServiceWorker registration failed:", error);
        });
    });
  }

  return <App />;
};

export default RootApp;
