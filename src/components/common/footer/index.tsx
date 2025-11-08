import Icon from "@/assets/home/avatar.png";
import Github from "@/assets/footer/github.svg?react";
import Twitter from "@/assets/footer/twitter.svg?react";
import Discord from "@/assets/footer/discord.svg?react";

const Footer = () => {
  return (
    <footer className="bg-[#0D0C11] flex items-end justify-between w-[1170px] mx-auto">
      {/* Left Column - Logo and Social */}
      <div className="flex flex-row items-end self-stretch">
        <div className="flex flex-col h-full items-start justify-between w-[275px]">
          {/* Logo and Description */}
          <div className="flex flex-col gap-[12px] items-start justify-end w-full">
            <div className="flex gap-[8px] items-center">
              <div className="w-[32px] h-[32px] flex items-center justify-center">
                <img src={Icon} alt="Zyra Logo" className="w-full h-full object-contain" />
              </div>
              <p className="font-['Satoshi',sans-serif] font-black text-[27px] leading-normal text-white text-center whitespace-pre">
                Zyra
              </p>
            </div>
            <p className="font-['Figtree',sans-serif] font-medium text-[14px] leading-[20px] text-[#98A2B3] w-full">
              Revolutionizing blockchain interaction through natural language AI
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-[12px] items-start">
            <a
              href="https://github.com/zyra-ai-sei"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[24px] h-[24px]"
            >
              <Github className="w-full h-full text-[#98A2B3] hover:text-white transition-colors" />
            </a>
            <a
              href="https://x.com/Zyra_ai_"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[24px] h-[24px]"
            >
              <Twitter className="w-full h-full text-[#98A2B3] hover:text-white transition-colors" />
            </a>
            <a
              href="https://discord.gg/pGu7pfh8r"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#98A2B3] hover:bg-white flex gap-[8px] items-center justify-center p-[10px] rounded-[99px] w-[24px] h-[24px] transition-colors"
            >
              <Discord className="w-[16px] h-[16px] text-[#0D0C11]" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column - Links and Copyright */}
      <div className="flex flex-col gap-[64px] items-start">
        {/* Links Container */}
        <div className="flex gap-[24px] items-start justify-center w-full">
          {/* Product Column */}
          <div className="flex flex-col gap-[20px] items-start w-[148px]">
            <p className="font-['Figtree',sans-serif] font-semibold text-[16px] leading-[24px] text-white w-full">
              Product
            </p>
            <div className="flex flex-col font-['Figtree',sans-serif] font-normal gap-[8px] items-start text-[16px] leading-[24px] text-[#98A2B3] w-full">
              <a href="#features" className="hover:text-white transition-colors w-full">
                Features
              </a>
              <a href="#milestones" className="hover:text-white transition-colors w-full">
                Timeline
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="flex font-['Figtree',sans-serif] font-normal items-center justify-between text-[10px] leading-[14px] text-[#98A2B3] text-center w-full whitespace-pre">
          <p>© 2025 Zyra. All Rights Reserved</p>
          <p>Privacy & Cookies Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
