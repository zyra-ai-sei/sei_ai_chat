import { motion } from "framer-motion";

const partners = [
  { name: "Solana", icon: "🔷" },
  { name: "Hyperliquid", icon: "💧" },
  { name: "Capsule", icon: "💊" },
  { name: "Starling", icon: "⭐" },
  { name: "Linea", icon: "📐" },
  { name: "Uniswap", icon: "🦄" },
  { name: "Chainlink", icon: "🔗" },
  { name: "Aave", icon: "👻" },
];

export default function Trusted() {
  return (
    <section className="bg-[#0D0C11] flex flex-col gap-[84px] items-start py-[84px] w-full max-w-[1440px] mx-auto">
      {/* First Section - Trusted by */}
      <div className="w-full flex flex-col items-start gap-[24px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="font-['Figtree',sans-serif] font-medium text-[20px] leading-[30px] text-white text-center w-full"
        >
          Trusted by
        </motion.p>
        <div className="w-full flex flex-wrap gap-[48px] items-center justify-center overflow-clip px-[135px]">
          <div className="flex gap-[32px] items-center justify-center w-[987px]">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                whileHover={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-[48px] flex items-center justify-center transition-all duration-300"
              >
                <span className="text-white text-base font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-2xl">{partner.icon}</span>
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Section - Audited & Verified By */}
      <div className="w-full flex flex-col items-start gap-[24px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="font-['Figtree',sans-serif] font-medium text-[20px] leading-[30px] text-white text-center w-full"
        >
          Audited & Verified By Leading Firms
        </motion.p>
        <div className="w-full flex flex-wrap gap-[48px] items-center justify-center overflow-clip px-[135px]">
          <div className="flex gap-[32px] items-center justify-center w-[987px]">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name + "-powered"}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                whileHover={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-[48px] flex items-center justify-center transition-all duration-300"
              >
                <span className="text-white text-base font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-2xl">{partner.icon}</span>
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}