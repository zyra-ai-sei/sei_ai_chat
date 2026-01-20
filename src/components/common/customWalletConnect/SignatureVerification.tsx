
import { useEffect, useState } from "react";

import { usePrivy } from "@privy-io/react-auth";

const SignatureVerificationPopup = () => {
  const { authenticated } = usePrivy();


  const [pending, setPending] = useState(false);

  const handleVerification = async () => {
    try {
    

  
    } catch (err: any) {
      setPending(false);
      // setError(err?.message ? err?.message : "Error in signing the message");
    }
  };
  
  useEffect(() => {
    // Only auto-verify if user doesn't have a token yet
    if (!authenticated) {
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
