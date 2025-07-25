import coinIcon from "@/assets/header/coin.png";
import maticIcon from "@/assets/header/matic.png";
import usdcIcon from "@/assets/leaderBoard/usdc.svg";
import { useEffect, useState } from "react";
import { HeaderToggleEnum } from "@/enum/headerToggle.enum.ts";
import { Link, useLocation } from "react-router-dom";
import {
  ICoinFilterItem,
  ISportsFilterItem,
} from "@/interface/sports.interface.ts";
import { useAppSelector } from "@/hooks/useRedux.ts";
import { TokenTypeEnum } from "@/enum/utility.enum.ts";
import { useAccount, useDisconnect } from "wagmi";
import "./index.scss";
import WalletConnectPopup from "../customWalletConnect";
import ConnectedDisplay from "../customWalletConnect/ConnectedDisplay";
import SignatureVerification from "../customWalletConnect/SignatureVerification";

function Header({ isBackNavigation }: { isBackNavigation?: boolean }) {
  const [headerToggleState, setHeaderToggleState] = useState<HeaderToggleEnum>(
    HeaderToggleEnum.Home
  );

  const [isShowStatic, setIsShowStatic] = useState<boolean>(false);

  const location = useLocation();
  const isPWAOpened = useAppSelector(
    (state) => state?.globalData?.data?.isPWAOpened
  );


  const token = useAppSelector((state) => state?.globalData?.data?.token);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowStatic(true);
    }, 2000); // Duration of the GIF in ms

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <header className="mx-auto px-[16px] md:px-[0px] sticky top-0 z-[5] w-full flex justify-end">
        <div className="pt-[15px] flex pb-[3px] sticky ">
          <ConnectedDisplay />
        </div>
        <WalletConnectPopup isCenterAlignPopupOpen={!token} />
      </header>
    </>
  );
}

export default Header;
