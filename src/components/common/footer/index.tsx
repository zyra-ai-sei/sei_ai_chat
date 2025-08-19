import Icon from "@/assets/common/icon.svg";
import Github from "@/assets/footer/github.svg?react";
import Twitter from "@/assets/footer/twitter.svg?react";
import Telegram from "@/assets/footer/telegram.svg?react";
import Discord from "@/assets/footer/discord.svg?react";
import { Parallax } from "react-scroll-parallax";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Parallax speed={-10}>
      <div className="mt-6 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] py-10 flex flex-col gap-4 items-center">
          <h1 className="text-[24px] md:text-[36px] text-white">
            Ready to Talk to the Chain ?
          </h1>

          <p className="w-[80%] md:max-w-[50%] self-center text-white">
            Join other users who are already using Zyra to simplify their
            blockchain interactions
          </p>
          <div className="flex gap-6">
            <button onClick={()=>navigate("/chat")} className=" p-3 px-5 rounded-full text-[#667EEA] bg-white font-light">
              Start For Free
            </button>
            <a href="https://github.com/zyra-ai-sei" target="_blank" className="p-3 px-5 font-light text-white border rounded-full border-white/50">
              View Code
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row justify-between max-w-[1440px] mx-auto py-[30px] px-[20px] ">
          <div className="flex flex-col items-start gap-4 ">
            <div className="flex items-center justify-center gap-3">
              <img
                src={Icon}
                className="size-[30px] md:size-[40px] bg-gradient-to-r from-[#9ED9F9] to-[#D6D6D6] rounded-xl p-2 "
              />
              <h1 className="font-bold text-white text-[28px] md:text-[38px]">
                Zyra
              </h1>
            </div>
            <p className="text-white/80 max-w-[280px]">
              Revolutionizing blockchain interaction through natural language AI
            </p>
          </div>

          <div className="flex-col hidden gap-3 text-white md:flex">
            <h1 className="text-[18px]">Product</h1>
            <a href="#features" className="font-light text-white/70">
              Features
            </a>
            <a href="#timeline" className="font-light text-white/70">
              Timeline
            </a>
          </div>

          <div className="flex-col hidden gap-3 text-white md:flex">
            <h1 className="text-[18px]">Company</h1>
            <a href="#about" className="font-light text-white/70">
              About
            </a>
            <a href="" className="font-light text-white/70">
              Blog
            </a>
          </div>

          <div className="flex flex-col items-start gap-3 ">
            <p className="text-white text-[18px]">Connect</p>
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
      </div>
    </Parallax>
  );
};

export default Footer;
