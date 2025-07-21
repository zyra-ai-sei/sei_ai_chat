import CrossIcon from "@/assets/header/cross.svg?react";
import { withCenterAlignPopup } from "@/hoc/withCenterAlignedPopup";
import mobileIcon from "@/assets/popup/mobile.png";

function PwaDownloadPopupExport({
  setIsPwapopupOpened,
}: {
  setIsPwapopupOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-[calc(100vw_-_32px)] mx-auto md:w-[356px] px-[16px] py-[16px] rounded-[20px] border-[1px]  border-solid border-neutral-greys-200 bg-neutral-greys-0 shadow2 mainFont">
      <div className="flex items-center w-full justify-end">
        {" "}
        <button
          type="button"
          className="hover:opacity-80"
          onClick={() => setIsPwapopupOpened(false)}
        >
          <CrossIcon className="h-[20px] w-[20px]" />
        </button>
      </div>
      <div className="flex flex-col items-center mt-3">
        <img src={mobileIcon} alt="" className="h-[100px] w-[100px]" />
        <p className="mt-3 typo-h5-semiBold text-neutral-greys-950">
          Add to home screen
        </p>
        <p className="max-w-[225px] text-neutral-greys-950 typo-b3-regular mt-1 text-center">
          Enjoy a smoother experience with our web app
        </p>

        <div className="flex items-center gap-x-[8px]">
          <p className="rounded-[50%] bg-neutral-greys-200 h-5 w-5 flex items-center justify-center text-neutral-greys-950 typo-c1-semiBold">
            1
          </p>
          <p className="text-neutral-greys-950 typo-c1-regular">
            Click your browser’s share button{" "}
          </p>
        </div>
        <div className="flex items-center gap-x-[8px] mt-5">
          <p className="rounded-[50%] bg-neutral-greys-200 h-5 w-5 flex items-center justify-center text-neutral-greys-950 typo-c1-semiBold">
            2
          </p>
          <p className="text-neutral-greys-950 typo-c1-regular">
            Choose install app or add to home screen
          </p>
        </div>
        <button
          className="text-primary-main-500 typo-b3-semiBold underline mt-8 select-none"
          type="button"
          onClick={() =>
            window?.open(
              "https://docs.chaquen.io/install-the-app/ios-devices",
              "_blank"
            )
          }
        >
          Learn more
        </button>
      </div>
    </div>
  );
}

const PwaDownloadPopup = withCenterAlignPopup(PwaDownloadPopupExport);
export default PwaDownloadPopup;
