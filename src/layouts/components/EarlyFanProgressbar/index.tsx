import EarlyFanImg from "@/assets/common/early_fan.png";
import { PaymasterABI } from "@/contract/abi/Paymaster_1.1.0_ABI";
import { Contract, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
const EarlyFanProgressbar = () => {
  const [compPercent, setCompPercent] = useState(0);

  const completedPercent = async () => {
    const polygonRpc = import.meta.env?.VITE_BASE_POLYGON_RPC;

    const provider = new ethers.JsonRpcProvider(polygonRpc);

    const paymasterContract = new Contract(
      import.meta.env?.VITE_BASE_BICONOMY_POLYGON_PAYMASTER_CONTRACT_ADDRESS,
      PaymasterABI,
      provider
    );

    const paymasterBalanceInHex = await paymasterContract.getBalance(
      import.meta.env?.VITE_BASE_BICONOMY_POLYGON_PAYMASTER_CREATOR_EOA
    );

    const paymasterBalance = parseFloat(
      ethers.formatEther(paymasterBalanceInHex)
    );

    const adjustedPaymasterBalance =
      paymasterBalance <=
      parseFloat(ethers.formatEther(ethers.parseEther("5")))
        ? 0
        : paymasterBalance -
          parseFloat(ethers.formatEther(ethers.parseEther("5")));

    const threshold = parseFloat(
      ethers.formatEther(ethers.parseEther("50"))
    );

    if (adjustedPaymasterBalance >= threshold) {
      setCompPercent(100);
    } else {
      setCompPercent(Math.floor((adjustedPaymasterBalance / threshold) * 100));
    }
  };

  useEffect(() => {
    completedPercent();
  }, []);

  const completeColor = useMemo(() => {
    if (compPercent <= 20) {
      return "bg-[#FF4141]";
    } else if (compPercent <= 90) {
      return "bg-primary-main-950";
    } else {
      return "bg-primary-main-500";
    }
  }, [compPercent]);

  return (
    <div
      style={{
        background: "linear-gradient(96deg, #6D41CB 45.6%, #8E41CB 110.83%)",
      }}
      className="md:h-[42.5px] flex flex-row items-center gap-3 justify-center py-[4px] md:p-0 hidden"
    >
      <div className="flex flex-row items-center gap-1">
        <img src={EarlyFanImg} className="w-[87px] h-[34px]" />
        <div className="typo-b3-regular text-neutral-greys-950">
          Matic Budget
        </div>
      </div>
      <div className="bg-[rgba(148,163,184,0.4)] w-[135px] md:w-[452px] md:h-3 h-[20px] rounded-[8px] overflow-hidden relative">
        <div
          className={`${completeColor} h-full`}
          style={{ width: `${compPercent}%` }}
        />
        <div className="w-full absolute flex items-center justify-center top-[2px] md:hidden ">
          <p className="typo-c1-regular text-neutral-greys-100  z-[2] flex items-center gap-x-[2px]">
            <span>{compPercent}</span> <span>%</span>
          </p>
        </div>
      </div>
      <div className="typo-b3-regular text-neutral-greys-800 hidden md:block">
        {compPercent}% Remaining
      </div>
    </div>
  );
};

export default EarlyFanProgressbar;
