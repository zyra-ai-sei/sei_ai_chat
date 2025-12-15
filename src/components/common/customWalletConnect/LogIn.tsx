import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setGlobalData } from "@/redux/globalData/action";
import { axiosInstance } from "@/services/axios";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";


const LogIn = () => {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const globalData = useAppSelector((data) => data.globalData.data);
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();
  const { login } = useLogin({
    onComplete: async ({ user }) => {
      // Only call login API if user doesn't already have a token
      if (globalData?.token) {
        return;
      }
      
      const accessToken = await getAccessToken();
      const response = await axiosInstance.post("/auth/login", {
        userId: user.id,
        embeddedAddress: wallets.find(
          (wallet) => wallet.connectorType == "embedded"
        )?.address,
        injectedAddress: wallets.find(
          (wallet) => wallet.connectorType == "injected"
        )?.address,
        token: accessToken,
      });

      dispatch(setGlobalData({ ...globalData, token: accessToken || "" }));
      // Navigate to dashboard, show welcome message, etc.
    },

   onError(error) {
       console.log(error)
   },

    
  });

  const disableLogin = !ready || (ready && authenticated);
  return (
    <button
      onClick={login}
      disabled={disableLogin}
      className="px-5 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-500"
    >
      Connect
    </button>
  );
};

export default LogIn;
