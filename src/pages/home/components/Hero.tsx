import HeroImage from "@/assets/common/HeroBg.jpg";
import { FlipLink } from "@/components/animation/FlipLink";
import { Parallax } from "react-scroll-parallax";

const Hero = () => {
  return (
    <Parallax speed={-2}>
      <div className="relative p-2">
        <div className="relative">
          <img src={HeroImage} className="" />
          {/* Overlay for left and right opacity effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent via-10% via-90% to-black/50 pointer-events-none"></div>
        </div>
        <div className="absolute flex justify-between items-center md:w-[90%] font-sans font-extrabold text-white bottom-4 md:bottom-12 left-[5%] right-[5%] md:left-[5%] text-[min(4vw,48px)]">
          <div className="flex flex-col gap-1 text-center ">
            <FlipLink href={"#"}>TALK&nbsp;&nbsp;TO </FlipLink>
            <FlipLink href="#">THE&nbsp;&nbsp;CHAIN</FlipLink>
          </div>
          <div className="flex flex-col gap-4 md:gap-6">
            <p className=" text-center text-[min(4vw,48px)] flex flex-col gap-1">
              <FlipLink href={"#"}>YOUR&nbsp;&nbsp;AI-POWERED</FlipLink>{" "}
              <FlipLink href={"#"}>CRYPTO&nbsp;&nbsp;ASSISTANT</FlipLink>
            </p>
            <p className="text-[min(2vw,20px)] font-extralight font-sans text-center text-[#98999A] line-clamp-2">
              Zyra turns natural language into real transactions on Sei.
              <br /> Market orders, DCA, limit trades — all via chat.
            </p>
          </div>
        </div>
      </div>
    </Parallax>
  );
};

export default Hero;
