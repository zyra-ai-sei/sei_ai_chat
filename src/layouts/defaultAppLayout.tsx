import Navbar from "@/components/navbar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { resetGlobalData } from "@/redux/globalData/action";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useDisconnect } from "wagmi";

const DefaultAppLayout = ({
  MainContentComponent,
}: {
  MainContentComponent: any;
}) => {
  const { getAccessToken } = usePrivy();
  const globalData = useAppSelector((data) => data.globalData.data);
  const dispatch = useAppDispatch();
  const { disconnectAsync } = useDisconnect();
  const { logout } = useLogout();

  useEffect(() => {
    const checkTokenExpiry = async () => {
      const latestToken = await getAccessToken();
      if (globalData.token != latestToken) {
        dispatch(resetGlobalData());
        await disconnectAsync();
        await logout();
      }
    };
    checkTokenExpiry();
  }, []);
  return (
    <>
      <Navbar />
      <MainContentComponent />
    </>
  );
};

export default DefaultAppLayout;
