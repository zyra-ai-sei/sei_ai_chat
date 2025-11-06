import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="bg-[#0D0C11] flex flex-col gap-[168px] items-center pb-[24px] pt-[84px] w-full max-w-[1440px] mx-auto relative overflow-clip">
      {/* Background decorative vectors - No animation */}
      <div className="absolute left-[-113.35px] top-[93.08px] w-[1886px] h-[217px] opacity-50 blur-[100px] bg-gradient-to-r from-[#204887] to-[#3B82F6]"></div>

      {/* CTA Content */}
      <div className="flex flex-col gap-[64px] h-[230px] items-center justify-center overflow-clip px-[8px] pb-[4px] w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-[16px] items-center text-center whitespace-pre"
        >
          <p className="bg-clip-text font-['Figtree',sans-serif] font-semibold text-[64px] leading-[70px] tracking-[-2.56px] text-transparent bg-gradient-to-r from-white to-[#7CABF9]">
            Ready to talk to chain ?
          </p>
          <p className="font-['Figtree',sans-serif] font-normal text-[18px] leading-[28px] text-[rgba(255,255,255,0.6)]">
            Join other users who are already using Zyra to simplify their blockchain interactions
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-[24px] items-start"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-l border border-solid border-white from-[#204887] gap-[8px] flex items-center justify-center px-[32px] py-[12px] rounded-[99px] to-[#3B82F6]"
            style={{
              boxShadow: 'inset 0px 0px 6px rgba(255, 255, 255, 0.4), inset 0px 0px 18px rgba(255, 255, 255, 0.16)',
            }}
          >
            <p className="font-['Figtree',sans-serif] font-semibold text-[16px] leading-[24px] text-center text-white whitespace-pre">
              Start for free
            </p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[rgba(255,255,255,0.04)] border border-solid border-white flex gap-[8px] items-center justify-center px-[32px] py-[12px] rounded-[99px]"
            style={{
              boxShadow: 'inset 0px 0px 6px rgba(255, 255, 255, 0.4), inset 0px 0px 18px rgba(255, 255, 255, 0.16)',
            }}
          >
            <p className="font-['Figtree',sans-serif] font-semibold text-[16px] leading-[24px] text-center text-white whitespace-pre">
              View code
            </p>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
