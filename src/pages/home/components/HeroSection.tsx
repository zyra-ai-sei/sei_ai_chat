import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ChatPage from "@/assets/home/chatpage.webp";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const navigate = useNavigate()

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center pt-[80px] md:pt-[120px] overflow-hidden pointer-events-none"
    >
   
      {/* Content Container */}
      <div className="flex flex-col py-10 items-center gap-8 px-4 z-10 max-w-[900px] mx-auto text-center">
        {/* Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-[60px] md:w-[100px] h-[1px] bg-gradient-to-r from-transparent to-white/30" />
            <div className="w-2 h-2 rotate-45 border border-white/30" />
          </div>
          <div className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5">
            <span className="font-['Figtree',sans-serif] text-sm md:text-base text-white/90">
              AI-Powered Trading
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-white/30" />
            <div className="w-[60px] md:w-[100px] h-[1px] bg-gradient-to-l from-transparent to-white/30" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="font-['Figtree',sans-serif] font-semibold text-[40px] md:text-[56px] lg:text-[72px] leading-[1.1] tracking-[-0.02em] text-white">
          Trade crypto with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7CABF9]">
            natural language
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-['Figtree',sans-serif] text-base md:text-lg text-white/60 max-w-[600px] leading-relaxed">
          Execute complex DeFi strategies using everyday language. Our AI
          understands your intent and translates it into blockchain transactions
          on Sei Network.
        </p>

        {/* CTA Button */}
        <button onClick={()=>navigate('/chat')} className="px-8 py-3.5 rounded-full border border-white/20 bg-[#ffffffd1] text-black font-['Figtree',sans-serif] font-medium text-base hover:bg-white/90 transition-colors pointer-events-auto">
          Get started
        </button>
      </div>

     

      <motion.div
        initial={{ y: 200, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        style={{ y }}
        className="relative mx-[5vw] rounded-t-[22px] md:rounded-t-[30px] border-8 border-white/5 isolate"
      >
        <div className="absolute -top-2 -left-2 bg-red-500 blur-[60px] z-0 w-12 h-24 md:h-48 md:w-24 opacity-80 md:opacity-100"/>
        <div className="absolute -top-2 -right-2 bg-red-500 blur-[60px] z-0 w-12 h-24 md:h-48 md:w-24 opacity-80 md:opacity-100"/>
        <img
          src={ChatPage}
          alt="Zyra AI Trading Interface"
          className="relative z-10 w-full h-auto object-cover object-top rounded-t-[18px] md:rounded-t-[24px]"
        />
        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#0D0C11] to-transparent pointer-events-none" />
      </motion.div>

      {/* Bottom section fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#0D0C11] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
