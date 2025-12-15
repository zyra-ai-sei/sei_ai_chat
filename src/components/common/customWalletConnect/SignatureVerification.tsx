import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setGlobalData } from "@/redux/globalData/action";
import { axiosInstance } from "@/services/axios";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

const SignatureVerificationPopup = () => {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const globalData = useAppSelector((state) => state.globalData.data);

  const handleVerification = async () => {
    try {
      setPending(true);
      // setError(null);
      const nonceResponse = await axiosInstance.get("/auth/login");

      const nonce = nonceResponse.data.data.message;

      const signedMessage = await signMessageAsync({ message: nonce });


      const response = await axiosInstance.post("/auth/login", {
        signedMessage: signedMessage,
        address: address,
        message: nonce,
      });
      if (response?.data?.data?.token) {
        dispatch(
          setGlobalData({
            ...globalData,
            token: response.data.data.token,
          })
        );
        setPending(false);
        // setError(null);
      }
    } catch (err: any) {
      setPending(false);
      // setError(err?.message ? err?.message : "Error in signing the message");
    }
  };
  
  useEffect(() => {
    // Only auto-verify if user doesn't have a token yet
    if (!globalData?.token) {
      handleVerification();
    }
  }, []);
  
  return (
    <div className="flex flex-col w-full gap-4 p-4 border border-white/10 rounded-3xl backdrop-blur-2xl ">
      <div className="text-[24px] text-white">Verify Your Account</div>
      {pending ? (
        <div className="w-[25px] h-[25px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        <button onClick={handleVerification} className="w-full border border-white/10 bg-white/5 hover:bg-white/10 rounded-[12px] min-h-[45px] flex gap-3 items-center justify-center text-white font-medium">
          Verify
        </button>
      )}
    </div>
  );
};

export default SignatureVerificationPopup;
