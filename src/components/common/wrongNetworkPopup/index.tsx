import { withCenterAlignPopup } from "@/hoc/withCenterAlignedPopup";
import wrongNetwork from "@/assets/popup/wrongNetwork.svg";
import { useSwitchChain } from "wagmi";
import useModalScrollLock from "@/hooks/useModalScrollLock";

function WrongNetworkPopupExport({isCenterAlignPopupOpen}:{isCenterAlignPopupOpen:boolean}) {
  const { switchChain } = useSwitchChain();
  useModalScrollLock({ isCenterAlignPopupOpen });
  return (
    <div className="bg-neutral-greys-0 shadow1  rounded-t-[10px] md:rounded-[10px]  border-[1px] border-solid border-neutral-greys-100 px-[24px] py-[24px]  w-full md:min-w-[580px]">
      <section className="flex items-center flex-col gap-y-[32px]">
        <img
          src={wrongNetwork}
          alt=""
          className="h-[100px] w-[100px] mx-[10px] my-[10px]"
        />

        <h4 className="text-center typo-h4-bold text-neutral-greys-800 ">
          Wrong Network
        </h4>
      </section>
      <div className="flex flex-col items-center ">
        <p className="text-center max-w-[266px] typo-b2-regular text-neutral-greys-950 mt-[8px]">
          Please switch to the appropriate network for this platform
        </p>
      </div>

      <button
        className="rounded-[10px] bg-primary-main-500 text-center w-full px-[20px] py-[12px]    text-neutral-greys-100 typo-b2-semiBold mt-[32px]"
        onClick={() => {
          switchChain?.({chainId:Number(import.meta.env?.VITE_BASE_CHAIN_ID)});
        }}
      >
        Switch to Sei Network
      </button>
    </div>
  );
}

const WrongNetworkPopup = withCenterAlignPopup(WrongNetworkPopupExport);

export default WrongNetworkPopup;
