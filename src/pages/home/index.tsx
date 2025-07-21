import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useEffect, useRef } from "react";

import { GameTabEnum } from "@/enum/headerToggle.enum";
import { Input } from "antd";
import InputBox from "@/components/common/inputBox";
import ResponseBox from "@/components/common/responseBox";
import WalletConnectPopup from "@/components/common/customWalletConnect";
import { initializePrompt } from "@/redux/chatData/action";
function Home() {
  const token = useAppSelector((state) => state?.globalData?.data?.token);
  const sessionId = useAppSelector((state)=> state?.chatData.sessionId);
  const dispatch = useAppDispatch();
  useEffect(()=>{
    if(!sessionId){
      dispatch(initializePrompt())
    }
  },[])
  return (
    <div className="h-full p-4 overflow-hidden">
      <div className="flex flex-col justify-end h-full gap-0 lg:max-w-[60%] mx-auto">
        <ResponseBox/>
        <InputBox />
      </div>
    </div>
  );
}

export default Home;
