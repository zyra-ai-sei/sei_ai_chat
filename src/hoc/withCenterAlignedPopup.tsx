import { ComponentType, Dispatch, SetStateAction } from "react";
import { Modal } from "antd";
import CrossIcon from "@/assets/popup/close.svg?react";
import { useAppSelector } from "@/hooks/useRedux";

interface WithCenterAlignPopupProps {
  isCenterAlignPopupOpen: boolean;
  setIsCenterAlignPopupOpen?: Dispatch<SetStateAction<boolean>>;
  isFullWidth?: boolean;
  isBlurRemoved?: boolean;
  isCloseButtonDisplay?: boolean;
  className?: string;
  isNonClosable?: boolean;
  onClose?: () => void;
  maskCloseDisable?: boolean;
  isMobile?: boolean;
  isTopCrossIconDisplay?: boolean;
  zIndex?: number;
}

export function withCenterAlignPopup<P>(Component: ComponentType<P>) {
  return function CenterAlignPopup(props: P & WithCenterAlignPopupProps) {
    const {
      isCenterAlignPopupOpen,
      setIsCenterAlignPopupOpen,
      className = "",
      isBlurRemoved,
      isFullWidth,
      isCloseButtonDisplay,
      isNonClosable,
      onClose,
      maskCloseDisable,

      isTopCrossIconDisplay,
    } = props;

    const handleCancel = () => {
      if (setIsCenterAlignPopupOpen && !isNonClosable) {
        setIsCenterAlignPopupOpen(false);
      }
    };

    const isMobile = useAppSelector((state) => state?.globalData?.isMobile);
    return (
      <Modal
        open={isCenterAlignPopupOpen}
        onCancel={() => {
          handleCancel();
          onClose?.();
        }}
        footer={null}
        title={null}
        width={"full"}
        maskClosable={!maskCloseDisable}
        centered={true}
        keyboard={true}
        wrapClassName={`${isFullWidth ? "w-full" : ""}  ${className} ${
          isMobile
            ? "full-width-top-align-popup !max-w-full "
            : "center-align-popup !max-w-[390px] mx-auto "
        } `}
        className={` ${isMobile ? isFullWidth ? "!max-w-[100vw] !pb-0 !min-w-[100vw] !m-0" : "!max-w-[100vw_-_20px] !pb-0 !min-w-[calc(100vw_-_32px)]" : isFullWidth ? "!max-w-[390px] !min-w-[390px]" : "!max-w-[358px] min-w-[358px]"}  ${isTopCrossIconDisplay ? "relative" : ""} `}
        style={{
          bottom: "0px",
          // fontFamily: 'Sora',
          paddingBottom: 0,
        }}
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
        closeIcon={isCloseButtonDisplay || false}
        mask
        destroyOnClose
        {...props}
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
