import { useState } from "react";
import feature1 from "@/assets/features/nlp.svg";
import natlanImg from "@/assets/features/natlan2.png";
import dashboardImg from "@/assets/features/dashboard.png";

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);

  const featuresList = [
    {
      image: natlanImg,
      title: "Natural Language Trading",
      tab: "Natural Language Trading",
      content:
        "Trade Using Everyday Language, No Commands to Memorize",
      description:
        "Our cutting-edge artificial intelligence is designed to deeply comprehend your intentions, seamlessly translating them into accurate and efficient blockchain transactions. This technology not only enhances the speed of processing but also ensures that every transaction aligns perfectly with your specific needs.",
    },
    {
      image: feature1,
      title: "TWAP & DCA",
      tab: "TWAP & DCA",
      content:
        "Automate Your Trading Strategy",
      description:
        "Automate trades with TWAP and DCA to reduce slippage and market risk—no constant monitoring needed. Execute sophisticated trading strategies with ease.",
    },
    {
      image: feature1,
      title: "Multi-DEX Support",
      tab: "Multi-DEX Support",
      content:
        "Access Multiple Exchanges",
      description:
        "Currently routes trades through DragonSwap, with support for more Sei-native DEXs coming soon. Get the best prices across multiple exchanges.",
    },
    // {
    //   image: feature1,
    //   title: "Natural Language Trading",
    //   tab: "Natural Language Trading",
    //   content:
    //     "Advanced AI Processing",
    //   description:
    //     "Our AI understands context and intent, making blockchain interactions as simple as having a conversation.",
    // },
    {
      image: dashboardImg,
      title: "Transaction Analytics",
      tab: "Transaction Analytics",
      content:
        "Real-Time Portfolio Tracking",
      description:
        "Track all your tokens and transaction history in real-time with a comprehensive dashboard—monitor performance, analyze activity, and maintain complete visibility of your portfolio.",
    },
    {
      image: feature1,
      title: "Built on Sei",
      tab: "Built on Sei",
      content:
        "Powered by Sei Network",
      description:
        "Runs on Sei's fast, low-fee, parallelized chain—perfect for real-time DeFi actions.",
    },
  ];
  return (
    <section className="bg-[#0D0C11] flex flex-col gap-[64px] items-center justify-center py-[84px] w-full max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-[16px] items-start text-center w-full">
        <p className="bg-clip-text font-['Figtree',sans-serif] font-semibold text-[48px] leading-[54px] tracking-[-0.96px] text-transparent bg-gradient-to-r from-white to-[#7CABF9] w-full">
          Our key <span className="text-[#3B82F6]">features</span>
        </p>
        <p className="font-['Figtree',sans-serif] font-normal text-[16px] leading-[24px] text-white w-full">
          See various way zyra helps you out. Get the information you need about the Zyra
        </p>
      </div>

      {/* Features Content */}
      <div className="flex flex-col gap-[64px] items-start px-[135px] w-full">
        {/* Tabs */}
        <div className="flex items-start w-full overflow-x-auto scrollbar-hide py-2 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {featuresList.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex gap-[8px] h-[64px] items-center px-[32px] py-[16px] relative flex-shrink-0 ${
                activeTab === index
                  ? 'bg-[rgba(255,255,255,0.01)] rounded-[99px] shadow-[0px_0px_8px_0px_#629BF8]'
                  : ''
              }`}
            >
              <p className={`font-['Figtree',sans-serif] ${
                activeTab === index ? 'font-semibold text-white' : 'font-medium text-[rgba(255,255,255,0.3)]'
              } text-[20px] leading-[30px] whitespace-nowrap`}>
                {feature.tab}
              </p>
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <div className="flex flex-col gap-[48px] items-start justify-center w-full">
          <div className="flex flex-col gap-[32px] items-start w-full">
            {/* Feature Image/Demo */}
            <div className="h-[900px] overflow-clip w-full relative rounded-[24px] bg-gradient-to-br from-[#204887]/20 to-[#3B82F6]/10 border border-[#3B82F6]/30">
              <div className="absolute inset-0 flex items-start justify-center">
                <img
                  src={featuresList[activeTab].image}
                  alt={featuresList[activeTab].title}
                  className={activeTab === 0 || activeTab === 3 ? "w-full h-full object-cover object-top rounded-[24px]" : "w-[200px] h-[200px] opacity-50"}
                />
              </div>
            </div>

            {/* Feature Description */}
            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="font-['Figtree',sans-serif] font-medium text-[32px] leading-[38px] text-white tracking-[-0.64px] w-full">
                {featuresList[activeTab].content}
              </p>
              <p className="font-['Figtree',sans-serif] font-normal text-[16px] leading-[24px] text-[#98A2B3] w-full">
                {featuresList[activeTab].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
