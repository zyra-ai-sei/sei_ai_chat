import Icon from "@/assets/common/icon.svg";
import Github from "@/assets/footer/github.svg?react";
import Twitter from "@/assets/footer/twitter.svg?react";
import Telegram from "@/assets/footer/telegram.svg?react";
import Discord from "@/assets/footer/discord.svg?react";
import { Parallax } from "react-scroll-parallax";

const Footer = () => {
  return (
    <Parallax speed={-10}>
      <div className="p-4 mx-4 mt-6 border border-white/20 rounded-xl backdrop-blur-sm h-[240px]">
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-center gap-2 h-[80px]">
            <img src={Icon} className="size-[34px] md:size-[42px]" />
            <h1 className="font-bold text-white text-[28px] md:text-[38px]">
              Zyra.ai
            </h1>
          </div>
          <div className="flex gap-2">
            <a
              target="_blank"
              href="https://github.com/zyra-ai-sei"
              className=""
            >
              <Github className="size-[48px] border rounded-full p-1 text-white/50 hover:text-white border-white/20 hover:bg-white/20 cursor-pointer" />
            </a>
            <a target="_blank" href="" className="">
              <Twitter className="size-[48px] border rounded-full p-1 text-white/50 hover:text-white border-white/20 hover:bg-white/20 cursor-pointer" />
            </a>

            <a target="_blank" href="" className="">
              <Telegram className="size-[48px] border rounded-full p-1 text-white/50 hover:text-white border-white/20 hover:bg-white/20 cursor-pointer" />
            </a>

            <a target="_blank" href="" className="">
              <Discord className="size-[48px] border rounded-full p-1 text-white/50 hover:text-white border-white/20 hover:bg-white/20 cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
    </Parallax>
  );
};

export default Footer;
