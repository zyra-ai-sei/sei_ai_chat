import CrossIcon from "@/assets/common/crossCurrent.svg?react";
import { useAppSelector } from "@/hooks/useRedux";
import { useEffect, useMemo, useRef, useState } from "react";

function AlertGeneric() {
  const alertData = {message:"make the logic later with redux", type:0}
  const [isAlertDisplay, setIsAlertDisplay] = useState<boolean>(true);

  const paraRef = useRef<HTMLParagraphElement>(null);
  const isMobile = useAppSelector((state) => state?.globalData?.isMobile);

  useEffect(() => {
    if (paraRef?.current) {
      paraRef.current.innerHTML = alertData?.message;
    }
  }, [alertData?.message]);

  const alertComp = useMemo(() => {
    if (alertData?.type === 0) {
      return (
        <div
          className={`${isMobile ? "w-full" : "w-[390px] left-[calc(50%_-_195px)]"} py-[10px] relative  flex items-center bg-primary-main-500 justify-center`}
        >
          <p className="w-full text-center text-neutral-greys-0 typo-c1-regular">
            {alertData?.message}
          </p>
          <CrossIcon
            className="md:h-[24px] md:w-[24px] h-[20px] w-[20px] top-[8px] right-[20px] absolute cursor-pointer hover:opacity-50 text-neutral-greys-50"
            onClick={() => setIsAlertDisplay(false)}
          />
        </div>
      );
    } else if (alertData?.type === 1) {
      return (
        <div
          className={`${isMobile ? "w-full" : "w-[390px] left-[calc(50%_-_195px)]"} py-[10px] relative  flex items-center bg-primary-main-600 justify-center`}
        >
          <p
            className="w-full text-center text-neutral-greys-0 typo-c1-regular"
            ref={paraRef}
          ></p>
          <CrossIcon
            className="md:h-[24px] md:w-[24px] h-[20px] w-[20px] top-[8px] right-[20px] absolute cursor-pointer hover:opacity-50 text-neutral-greys-50"
            onClick={() => setIsAlertDisplay(false)}
          />
        </div>
      );
    } else if (alertData?.type === 2) {
      return (
        <div
          className={`${isMobile ? "w-full" : "w-[390px] left-[calc(50%_-_195px)]"} py-[10px] relative  flex items-center bg-system-warning-500 justify-center`}
        >
          <p className="w-full text-center text-neutral-greys-0 typo-c1-regular">
            {alertData?.message}
          </p>
          <CrossIcon
            className="md:h-[24px] md:w-[24px] h-[20px] w-[20px] top-[8px] right-[20px] absolute cursor-pointer hover:opacity-50 text-neutral-greys-50"
            onClick={() => setIsAlertDisplay(false)}
          />
        </div>
      );
    } else if (alertData?.type === 3) {
      return (
        <div
          className={` ${isMobile ? "w-full" : "w-[390px] left-[calc(50%_-_195px)]"} py-[10px] relative  flex items-center bg-system-error-500 justify-center`}
        >
          <p className="w-full text-center text-neutral-greys-0 typo-c1-regular">
            {alertData?.message}
          </p>
        </div>
      );
    } else if (alertData?.type === 4) {
      return (
        <div
          className={`${isMobile ? "w-full" : "w-[390px] left-[calc(50%_-_195px)]"} py-[10px] relative  flex items-center bg-primary-main-800 justify-center`}
        >
          <p
            className="w-full text-center text-neutral-greys-0 typo-c1-regular"
            ref={paraRef}
          ></p>
          <CrossIcon
            className="md:h-[24px] md:w-[24px] h-[20px] w-[20px] top-[8px] right-[20px] absolute cursor-pointer hover:opacity-50 text-neutral-greys-50"
            onClick={() => setIsAlertDisplay(false)}
          />
        </div>
      );
    }
  }, [alertData?.message, alertData?.type, isMobile]);

  return (
    <div className={`${isMobile ? "" : " bg-neutral-greys-200"}`}>
      {isAlertDisplay && alertComp}
    </div>
  );
}

export default AlertGeneric;
