import { ComponentType, Dispatch, SetStateAction } from "react";
import { Modal } from "antd";
import CrossIcon from "@/assets/popup/close.svg?react";

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
}

export function withTopAlignPopup<P>(Component: ComponentType<P>) {
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
      isMobile,
      isTopCrossIconDisplay,
    } = props;

    const handleCancel = () => {
      if (setIsCenterAlignPopupOpen && !isNonClosable) {
        setIsCenterAlignPopupOpen(false);
      }
    };
    // const isMobile = window.innerWidth <= 768;

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
        centered={false}
        keyboard={true}
        wrapClassName={`${isFullWidth ? "w-full" : ""}  ${className} ${
          isMobile
            ? "full-width-top-align-popup !max-w-full "
            : "full-width-top-align-popup"
        } `}
        className={` ${isMobile ? "!max-w-full !pb-0" : ""}  ${isTopCrossIconDisplay ? "relative" : ""} `}
        style={{
          bottom: "0px",
          top: "0px",
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
            padding: 0,
          },
        }}
        closeIcon={isCloseButtonDisplay || false}
        mask
        destroyOnClose
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
