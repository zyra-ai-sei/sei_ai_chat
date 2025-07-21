import comingSoonImage from "@/assets/nftLaunch/comingSoon.png";
import "./index.scss";
import launchBanner from "@/assets/nftLaunch/launchBanner.png";

function NftLaunchBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`${className} md:max-w-[1200px] max-w-[calc(100vw_-_40px)] mx-[auto] md:mt-[90px] mt-[10px]`}
    >
      <div className="relative w-full">
        <img
          src={comingSoonImage}
          alt=""
          className="md:w-[313px] md:h-[143px] w-[148px] h-[73px] absolute md:-top-[71px] md:-right-[0px]  -top-[40px] right-[69px]"
        />
        <h1 className="nftLaunchTypo md:max-w-full max-w-[350px] mx-auto z-[2]">
          NFT LAUNCH
        </h1>
      </div>
      <div className="mt-[43px] relative min-h-[250px] md:min-h-[439px]">
        <div className="flex justify-center absolute -top-[22px] w-full z-[0]">
          {" "}
          <div className="nftLaunchRedBlur " />
        </div>

        <img
          src={launchBanner}
          alt=""
          className="w-full z-[2] absolute top-0 min-[250px] md:min-h-[372px]"
        />
      </div>
    </div>
  );
}

export default NftLaunchBox;
