import { useAppSelector } from "@/hooks/useRedux.ts";
import "./index.scss";
import WalletConnectPopup from "../customWalletConnect";
import ConnectedDisplay from "../customWalletConnect/ConnectedDisplay";

function Header() {


  // const [isShowStatic, setIsShowStatic] = useState<boolean>(false);



  const token = useAppSelector((state) => state?.globalData?.data?.token);

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
