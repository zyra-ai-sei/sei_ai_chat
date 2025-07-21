import { setGLobalMobileData } from "@/redux/globalData/action";
import { useAppDispatch,} from "./useRedux";
import { useCallback, useEffect } from "react";

function useScreenWidth() {
  const dispatch = useAppDispatch();

  const handleResize = useCallback(() => {
    dispatch(setGLobalMobileData());
  }, [dispatch]);

  useEffect(() => {
    window?.addEventListener("resize", handleResize);
    return () => {
      window?.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);
}

export default useScreenWidth;
