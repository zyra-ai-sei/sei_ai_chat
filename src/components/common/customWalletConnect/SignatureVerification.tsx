import { withCenterAlignPopup } from "@/hoc/withCenterAlignedPopup";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setGlobalData } from "@/redux/globalData/action";
import { axiosInstance } from "@/services/axios";
import { isPending } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

const SignatureVerificationPopup = () => {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const globalData = useAppSelector((state) => state.globalData.data);

  const handleVerification = async () => {
    try {
      setPending(true);
      setError(null);
      const nonceResponse = await axiosInstance.get("/auth/login");

      const nonce = nonceResponse.data.data.message;
      console.log('nonce',nonce)

      const signedMessage = await signMessageAsync({ message: nonce });


      const response = await axiosInstance.post("/auth/login", {
        signedMessage: signedMessage,
        address: address,
        message: nonce,
      });
      console.log('login response',response.data.data)
      if (response?.data?.data?.token) {
        dispatch(
          setGlobalData({
            ...globalData,
            token: response.data.data.token,
          })
        );
        setPending(false);
        setError(null);
      }
    } catch (err: any) {
      setPending(false);
      setError(err?.message ? err?.message : "Error in signing the message");
    }
  };
  useEffect(() => {
    handleVerification();
  }, []);
  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-white/10 rounded-3xl backdrop-blur-2xl bg-white/5">
      <div className="text-[24px] text-white">Verify Your Account</div>
      {pending ? (
        <div className="w-[25px] h-[25px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        <button onClick={handleVerification} className="w-full border border-white/10 hover:bg-white/10 rounded-full min-h-[40px] flex gap-3 items-center justify-center text-white font-medium">
          Verify
        </button>
      )}
    </div>
  );
};
const SignatureVerification = withCenterAlignPopup(SignatureVerificationPopup);
export default SignatureVerification;
