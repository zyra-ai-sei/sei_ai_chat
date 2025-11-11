import { Parallax } from "react-scroll-parallax";
import { MessageSquare, Cpu, Link2 } from "lucide-react";
import avatar from "@/assets/home/avatar.png";
import ellipseOuter from "@/assets/home/ellipse-outer.png";
import ellipseInner from "@/assets/home/ellipse-inner.png";
import { motion } from "framer-motion";

const Working = () => {
  const worksData = [
    {
      index: "1",
      title: "Type Your Intent",
      content:
        'Tell Zyra what you want to do in plain English like "Send 10 SEI to 0x..", "Swap $100 USDC for SEI when SEI is up 10%"',
      icon: MessageSquare,
    },
    {
      index: "2",
      title: "AI Processing",
      content: "Our advanced AI understands your intent and converts it into precise blockchain transactions",
      icon: Cpu,
    },
    {
      index: "3",
      title: "Execute On-Chain",
      content:
        "Review and confirm the transaction. Zyra executes it securely on the blockchain in real-time",
      icon: Link2,
    },
  ];

  return (
    <section className="bg-[#0D0C11] flex flex-col gap-[48px] md:gap-[64px] items-center justify-center py-[48px] md:py-[84px] w-full">
      <div className="flex flex-col lg:flex-row gap-[48px] lg:gap-[64px] items-start lg:items-start justify-center px-4 sm:px-8 md:px-16 lg:px-[135px] w-full max-w-[1440px] mx-auto">
        {/* Left Side - Avatar Animation */}
        <div className="flex flex-col gap-[48px] md:gap-[64px] w-full lg:flex-1 items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-[16px] items-start justify-center w-full"
          >
            <p className="bg-clip-text font-['Figtree',sans-serif] font-semibold text-[32px] md:text-[48px] leading-[40px] md:leading-[54px] tracking-[-0.96px] text-transparent bg-gradient-to-r from-white to-[#7CABF9]">
              See how <span className="text-[#3B82F6]">Zyra</span> works
            </p>
            <p className="font-['Figtree',sans-serif] font-normal text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] text-white">
              Three simple steps to transform your words into blockchain actions
            </p>
          </motion.div>

          {/* Avatar Placeholder - Ellipse Arcs */}
          <Parallax speed={-5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col gap-[8px] h-[300px] md:h-[450px] lg:h-[552px] items-center justify-center w-full"
            >
              <div className="relative flex items-center justify-center w-[350px] h-[350px]">
                {/* Outer ellipse */}
                <img src={ellipseOuter} alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-auto" />

                {/* Inner ellipse */}
                <img src={ellipseInner} alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[262px] w-auto" />

                {/* Avatar image with pulse effect */}
                <div className="relative w-[160px] h-[160px] flex items-center justify-center animate-pulse z-10">
                  <img src={avatar} alt="Zyra Avatar" className="w-[160px] h-[160px] object-contain" />
                </div>
              </div>
            </motion.div>
          </Parallax>
        </div>

        {/* Right Side - Steps */}
        <div className="flex flex-col gap-[48px] md:gap-[64px] items-start w-full lg:w-[520px]">
          {/* Vertical dotted lines between circles */}
          <div className="relative w-full">
            {/* Dotted line between circle 1 and 2 */}
            <div className="absolute left-[22px] top-[54px] w-[1px] h-[215px] border-l border-dashed border-[rgba(255,255,255,0.12)]" style={{ borderWidth: '1px' }}></div>

            {/* Dotted line between circle 2 and 3 */}
            <div className="absolute left-[22px] top-[315px] w-[1px] h-[215px] border-l border-dashed border-[rgba(255,255,255,0.12)]" style={{ borderWidth: '1px' }}></div>

            {worksData.map((work, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex gap-[24px] items-center w-full ${index > 0 ? 'mt-[64px]' : ''}`}
              >
                {/* Step number */}
                <div className="flex flex-row items-center self-stretch">
                  <div className="flex gap-[8px] h-full items-start justify-center pt-[10px]">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.2, type: "spring", stiffness: 200 }}
                      className="bg-[#201F24] border border-solid border-white flex flex-col gap-[8px] items-center justify-center p-[8px] rounded-[99px] w-[44px]"
                    >
                      <p className="font-['Figtree',sans-serif] font-semibold text-[18px] leading-[28px] text-center text-white">
                        {work.index}
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-[8px] items-start justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                    className="border border-[rgba(255,255,255,0.24)] border-solid flex flex-col gap-[8px] items-center justify-center p-[8px] rounded-[99px] w-[64px]"
                  >
                    <work.icon className="w-[48px] h-[48px] text-white" />
                  </motion.div>
                  <div className="flex flex-col gap-[12px] items-start w-[330px]">
                    <p className="font-['Figtree',sans-serif] font-semibold text-[32px] leading-[38px] text-center text-white tracking-[-0.64px] whitespace-pre">
                      {work.title}
                    </p>
                    <p className="font-['Figtree',sans-serif] font-normal text-[16px] leading-[24px] text-[rgba(255,255,255,0.6)]">
                      {work.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
