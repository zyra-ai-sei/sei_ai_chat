import { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What exactly does Zyra do?",
      answer:
        "Zyra is an AI-powered trading assistant that lets users perform DeFi actions — like swaps, lending, staking, or creating strategies — using simple natural language commands. Instead of connecting to multiple dApps, you can just tell Zyra what you want to do, and it executes it for you securely on-chain.",
    },
    {
      question: "Is Zyra safe to use with my wallet?",
      answer:
        "Yes. Zyra never takes custody of your assets. All transactions happen through your connected wallet, and every action is user-signed before execution. We also undergo regular security reviews and contract audits to ensure your funds remain secure.",
    },
    {
      question: "What is the Zyra SDK, and who can use it?",
      answer:
        "The Zyra SDK lets other Sei dApps integrate Zyra's natural language trading directly into their own platforms. That means a DEX, lending protocol, or portfolio app can add a \"Chat to Trade\" interface instantly — giving their users Zyra's AI features without leaving their app.",
    },
    {
      question: "Will Zyra have a token or community launch?",
      answer:
        "Yes! We're planning a closed token launch and NFT-based airdrop to early users and partner dApp communities on Sei. Joining early or being part of our Discord and partner dApps will give you access to these exclusive events.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#0D0C11] flex flex-col gap-[64px] items-center justify-center py-[84px] w-full max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-[16px] items-start text-center w-full"
      >
        <p className="bg-clip-text font-['Figtree',sans-serif] font-semibold text-[48px] leading-[54px] tracking-[-0.96px] text-transparent bg-gradient-to-r from-white to-[#7CABF9] w-full">
          We got your <span className="text-[#3B82F6]">answer</span>
        </p>
        <p className="font-['Figtree',sans-serif] font-normal text-[16px] leading-[24px] text-white w-full">
          Everything you might want to know before we work together answered clearly and simply
        </p>
      </motion.div>

      {/* FAQ Items */}
      <div className="flex flex-col gap-[24px] items-start justify-center px-[135px] w-full">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border-b border-[rgba(255,255,255,0.08)] border-solid flex flex-col gap-[16px] items-start py-[24px] w-full"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex items-center justify-between w-full"
            >
              <p className="font-['Figtree',sans-serif] font-medium text-[24px] leading-[30px] text-center text-white tracking-[-0.48px] whitespace-pre text-left">
                {faq.question}
              </p>
              <div className="overflow-clip shrink-0 w-[24px] h-[24px]">
                {openIndex === index ? (
                  <X className="w-[24px] h-[24px] text-white" strokeWidth={1.5} />
                ) : (
                  <Plus className="w-[24px] h-[24px] text-white" strokeWidth={1.5} />
                )}
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <div className="flex gap-[8px] items-center justify-center pr-[84px] w-full">
                <p className="basis-0 font-['Figtree',sans-serif] font-normal grow text-[14px] leading-[20px] opacity-60 text-white min-h-px min-w-px">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
