import Icon from "@/assets/icon.svg";
import Github from "@/assets/footer/github.svg?react";
import Twitter from "@/assets/footer/twitter.svg?react";
import Discord from "@/assets/footer/discord.svg?react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" border-t bg-black/10 border-white/5 w-full mt-20 relative z-10 pointer-events-none">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-3">
              <img src={Icon} alt="Zyra Logo" className="w-10 h-10" />
              <span className="font-['Satoshi',sans-serif] font-black text-3xl text-white tracking-tight">
                Zyra
              </span>
            </div>
            <p className="font-['Figtree',sans-serif] text-base text-gray-400 leading-relaxed text-left">
              Revolutionizing blockchain interaction through natural language AI. Execute complex strategies with simple commands.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-2 pointer-events-auto">
              <a
                href="https://github.com/zyra-ai-sei"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 pointer-events-auto rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://x.com/Zyra_ai_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://discord.gg/fSQEBj4q"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all group"
              >
                <Discord className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">
            <div className="flex flex-col gap-6">
              <h4 className="font-['Figtree',sans-serif] font-semibold text-white text-lg text-left">Product</h4>
              <div className="flex flex-col gap-4 text-gray-400 font-['Figtree',sans-serif] text-left">
                <a href="/#tracking" className="hover:text-white transition-colors pointer-events-auto">Features</a>
                <a href="/#timeline" className="hover:text-white transition-colors pointer-events-auto">Timeline</a>
                <Link to="/dashboard" className="hover:text-white transition-colors pointer-events-auto">Dashboard</Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-['Figtree',sans-serif] font-semibold text-white text-lg text-left">Company</h4>
              <div className="flex flex-col gap-4 text-gray-400 font-['Figtree',sans-serif] text-left">
                {/* <a href="#about" className="hover:text-white transition-colors pointer-events-auto">About</a> */}
                <a target="_blank" href="https://dev.to/shreyansh_b89bf259255b814/introduction-to-zyra-ai-powered-crypto-trading-companion-30pp" className="hover:text-white transition-colors pointer-events-auto">Blog</a>
                <a href="mailto:admin@zyrachat.app" className="hover:text-white transition-colors pointer-events-auto">Contact</a>
              </div>
            </div>

             <div className="flex flex-col gap-6">
              <h4 className="font-['Figtree',sans-serif] font-semibold text-white text-lg text-left">Legal</h4>
              <div className="flex flex-col gap-4 text-gray-400 font-['Figtree',sans-serif] text-left">
                <Link to="/terms" className="hover:text-white transition-colors pointer-events-auto">Terms</Link>
                <Link to="/privacy" className="hover:text-white transition-colors pointer-events-auto">Privacy</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-['Figtree',sans-serif] text-sm text-gray-500">
          <p>© 2025 Zyra. All Rights Reserved.</p>
          <div className="flex gap-8">
             <Link to="/privacy" className="hover:text-gray-300 cursor-pointer transition-colors pointer-events-auto">Privacy Policy</Link>
             <Link to="/terms" className="hover:text-gray-300 cursor-pointer transition-colors pointer-events-auto">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
