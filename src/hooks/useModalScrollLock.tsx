import { useEffect } from "react";

function useModalScrollLock({
  isCenterAlignPopupOpen,
}: {
  isCenterAlignPopupOpen: boolean;
}) {
  useEffect(() => {
    if (isCenterAlignPopupOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [isCenterAlignPopupOpen]);
}

export default useModalScrollLock;
