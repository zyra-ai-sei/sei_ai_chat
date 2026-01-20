import Navbar from "@/components/navbar";
import { setTokenFetcher } from "@/services/axios";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

const DefaultAppLayout = ({
  MainContentComponent,
}: {
  MainContentComponent: any;
}) => {
    const { getAccessToken } = usePrivy();

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
