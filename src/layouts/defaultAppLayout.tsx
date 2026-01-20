import Navbar from "@/components/navbar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { resetGlobalData } from "@/redux/globalData/action";
import { setTokenFetcher } from "@/services/axios";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useDisconnect } from "wagmi";

const DefaultAppLayout = ({
  MainContentComponent,
}: {
  MainContentComponent: any;
}) => {
    const { getAccessToken, logout, user } = usePrivy();

  useEffect(() => {
    // 1. Set the dynamic token fetcher for Axios
    // This ensures every request gets a fresh 24h token from Privy
    setTokenFetcher(getAccessToken);
  }, [getAccessToken]);
  return (
    <>
      <Navbar />
      <MainContentComponent />
    </>
  );
};

export default DefaultAppLayout;
