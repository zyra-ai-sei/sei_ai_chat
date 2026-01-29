import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setGlobalData } from "@/redux/globalData/action";
import { axiosInstance } from "@/services/axios";
import { useLogin, usePrivy, useWallets, useSessionSigners } from "@privy-io/react-auth";


const LogIn = () => {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const globalData = useAppSelector((data) => data.globalData.data);
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();
  console.log("Wallets:", wallets);
  const {addSessionSigners} = useSessionSigners();
  const { login } = useLogin({
    onComplete: async ({ user, isNewUser }) => {
      console.log("User logged in:", user);
      console.log("Is new user:", isNewUser);

      // Only add session signers for NEW users
      if (isNewUser) {
        // Wait a moment for wallets to be ready
        if (wallets.length === 0) {
          console.log("⏳ Waiting for wallets to load...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const embeddedWallet = wallets.find(
          (wallet) => wallet.connectorType === "embedded"
        );

        if (embeddedWallet) {
          try {
            console.log("✅ Adding session signers for new user...");
            await addSessionSigners({
              address: embeddedWallet.address,
              signers: [{
                signerId: "oy161qmcpduokmko79zaz5zi",
                policyIds: []
              }]
            });
            console.log("✅ Session signers added successfully!");
          } catch (error) {
            console.error("❌ Failed to add session signers:", error);
          }
        } else {
          console.error("❌ Embedded wallet not found");
        }
      } else {
        console.log("ℹ️ Existing user - session signers already configured");
      }
      
      // Only call login API if user doesn't already have a token
      if (globalData?.token) {
        console.log("User already has token, skipping login API");
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
      // console.log("Login response:", response);

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
