import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What exactly does Zyra AI do?",
      answer:
        "Zyra AI is an advanced crypto AI trading assistant that lets users perform DeFi actions — like swaps, lending, staking, or creating strategies — using simple natural language. Instead of navigating multiple dApps, simply tell the Zyra AI bot your desired trading strategy, and it executes it securely on-chain.",
    },
    {
      question: "Is the Zyra AI crypto bot safe to use with my wallet?",
      answer:
        "Yes. Zyra AI never takes custody of your crypto assets. All transactions happen through your connected wallet, and every action is user-signed before execution on the blockchain. We also undergo regular security reviews and smart contract audits to ensure your funds remain secure.",
    },
    {
      question: "What is the Zyra AI SDK, and who can use it?",
      answer:
        'The Zyra AI SDK enables other Web3 dApps to integrate conversational crypto AI trading directly into their platforms. DEXs, lending protocols, and portfolio managers can instantly add a "Chat to Trade" Web3 interface—giving their users automated crypto AI capabilities natively.',
    },
    {
      question: "Will Zyra AI have a token or community launch?",
      answer:
        "Yes! We're planning an exclusive closed token launch and NFT-based airdrop to early users and partner dApp communities exploring crypto AI on the Sei Network. Joining our Discord or partner communities grants you early access to Zyra AI events.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden pointer-events-none">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 items-center text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="font-['Figtree'] font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            We've got your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              answers
            </span>
          </h2>
          <p className="font-['Figtree'] text-base md:text-lg text-gray-400 leading-relaxed max-w-xl">
            Everything you might want to know before we work together, answered
            clearly and simply.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? "bg-white/10 border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                  : "bg-white/5 border-white/5 hover:bg-white/[0.07]"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex pointer-events-auto items-center justify-between w-full p-6 md:p-8 text-left gap-4"
              >
                <span
                  className={`font-['Figtree'] font-semibold text-lg md:text-xl transition-colors duration-300 ${
                    openIndex === index ? "text-white" : "text-gray-200"
                  }`}
                >
                  {faq.question}
                </span>

                <div
                  className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    openIndex === index
                      ? "bg-blue-500 border-blue-400 rotate-45"
                      : "bg-white/5 border-white/10 group-hover:border-white/30"
                  }`}
                >
                  <Plus
                    className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                      openIndex === index
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                      <p className="font-['Figtree'] text-base text-gray-400 leading-relaxed border-t border-white/10 pt-6">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
