import { ComponentType, Dispatch, SetStateAction, useEffect } from "react";
import { Modal } from "antd";
import CrossIcon from "@/assets/popup/close.svg?react";
import "./index.scss";
import { useAppSelector } from "@/hooks/useRedux";

interface WithBottomAlignPopupProps {
  isCenterAlignPopupOpen: boolean;
  setIsCenterAlignPopupOpen?: Dispatch<SetStateAction<boolean>>;
  isFullWidth?: boolean;
  isBlurRemoved?: boolean;
  isCloseButtonDisplay?: boolean;
  className?: string;
  isNonClosable?: boolean;
  isTopCrossIconDisplay?: boolean;
}

export function withBottomAlignPopup<P>(Component: ComponentType<P>) {
  return function CenterAlignPopup(props: P & WithBottomAlignPopupProps) {
    const {
      isCenterAlignPopupOpen,
      setIsCenterAlignPopupOpen,
      className = "",
      isBlurRemoved,
      isFullWidth,
      isCloseButtonDisplay,
      isNonClosable,
      isTopCrossIconDisplay,
    } = props;

    const handleCancel = () => {
      if (setIsCenterAlignPopupOpen && !isNonClosable) {
        setIsCenterAlignPopupOpen(false);
      }
    };

    useEffect(() => {
      if (isCenterAlignPopupOpen) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
      
      return () => document.body.classList.remove("modal-open");
    }, [isCenterAlignPopupOpen]);

    const isMobile = useAppSelector((state) => state?.globalData?.isMobile);
    return (
      <Modal
        open={isCenterAlignPopupOpen}
        transitionName="ant-modal-slide-up"
        onCancel={handleCancel}
        footer={null}
        maskClosable={true}
        centered={false}
        keyboard={true}
        wrapClassName={`${
          isFullWidth ? "w-full" : ""
        }  ${className} ${isMobile ? "full-width-bottom-align-popup !max-w-full !max-h-[100vh]" : "full-width-bottom-align-popup !max-w-[390px] !max-h-[100vh] mx-auto"}  ${""} `}
        className={` ${isMobile ? "!min-w-full !pb-0" : "!max-w-[390px] !pb-0"} '`}
        style={{ top: "0px", paddingBottom: 0 }}
        styles={{
          mask: {
            backdropFilter: isBlurRemoved ? "none" : "blur(15px)",
            transition: "all 500ms ease-in-out",
          },
          content: {
            padding: 0,
            background: "transparent",
            boxShadow: "none",
          },
          body: {
            padding: "0 0 0 0",
          },
        }}
        closeIcon={isCloseButtonDisplay}
        mask
      >
        {isTopCrossIconDisplay && (
          <div className="absolute -top-[45px] h-[32px]  flex items-center justify-center w-full">
            <CrossIcon
              className="h-[40px] w-[40px] cursor-pointer"
              onClick={() => setIsCenterAlignPopupOpen?.(false)}
            />
          </div>
        )}{" "}
        <Component {...props} />
      </Modal>
    );
  };
}
