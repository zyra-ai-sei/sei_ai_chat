import { Carousel } from "antd";
import "@/components/home/index.scss";
import banner1 from "@/assets/home/banner1.png";
import WatchVideoButton from "../common/button/watchVideoButton";

const data = [
  {
    title: "IPL Fantasy launch",
    desc: " This NFT is for the OG Questers of WALL, giving you 2x rewards on Quests completion & Exclusive offer",
  },
  {
    title: "IPL Fantasy launch",
    desc: " This NFT is for the OG Questers of WALL, giving you 2x rewards on Quests completion & Exclusive offer",
  },
  {
    title: "IPL Fantasy launch",
    desc: " This NFT is for the OG Questers of WALL, giving you 2x rewards on Quests completion & Exclusive offer",
  },
];

function BannerCarousal({ bannerData = data }) {
  return (
    <Carousel
      draggable
      waitForAnimate
      autoplay
      pauseOnHover
      className=" overflow-hidden rounded-[20px] pb-[20px] px-[20px]">
      {bannerData.map((item, index) => (
        <div className="" key={index}>
          <div className="flex items-center rounded-[20px] ">
            <div className="bannerBackground   h-[200px] rounded-l-[20px]  min-w-[882px] py-[32px] pl-[32px]">
              <p className="text-neutral-greys-950 typo-h4-semiBold">
                {item.title}
              </p>
              <p className="mt-[8px] max-w-[452px] text-neutral-greys-500 typo-b3-regular">
                {item.desc}
              </p>
              <WatchVideoButton classname="mt-[16px]" />
            </div>
            <div className="relative w-[680px] rounded-l-[20px]">
              {" "}
              <img
                src={banner1}
                alt=""
                className="w-[680px]  min-w-[680px] absolute -left-[185px] -top-[100px]  h-[200px] flex-[1] rounded-r-[20px]"

                
              />
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}

export default BannerCarousal;
