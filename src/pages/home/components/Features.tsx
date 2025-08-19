import SecondaryCard from "@/components/home/cards/SecondaryCard";
import feature1 from "@/assets/features/nlp.svg";
import feature2 from "@/assets/features/time.svg";
import feature3 from "@/assets/features/multichain.svg";
import feature4 from "@/assets/features/security.svg";
import feature5 from "@/assets/features/analytics.svg";
import feature6 from "@/assets/features/sei.png";
import { Parallax } from "react-scroll-parallax";

const Features = () => {
  const featuresList = [
    {
      image: feature1,
      title: "Natural Language Trading",
      className: "bg-gradient-to-r from-[#581C874D] to-[#1E3A8A4D]",
      content:
        "No need to learn commands—just type in plain English. Zyra understands and turns your intent into blockchain trades seamlessly.",
    },
    {
      image: feature2,
      title: "TWAP & DCA",
      className: "bg-gradient-to-r from-[#1E3A8A4D] to-[#164E634D]",
      content:
        "Automate trades with TWAP and DCA to reduce slippage and market risk—no constant monitoring needed.",
    },
    {
      image: feature3,
      title: "Multi-DEX Support",
      className: "bg-gradient-to-r from-[#164E634D] to-[#14532D4D]",
      content:
        "Currently routes trades through DragonSwap, with support for more Sei-native DEXs coming soon.",
    },
    {
      image: feature4,

      title: "Self-Custody",
      className: "bg-gradient-to-r from-[#14532D4D] to-[#713F124D]",
      content:
        "Your wallet, your control. Zyra never holds your keys or tokens, ensuring full self-custody at all times.",
    },
    {
      image: feature5,
      title: "Transaction Analytics",
      className: "bg-gradient-to-r from-[#97551a64] to-[#97580a37]",
      content:
        "Track all your tokens and transaction history in real-time with a comprehensive dashboard—monitor performance, analyze activity, and maintain complete visibility of your portfolio.",
    },
    {
      image: feature6,
      title: "Built on Sei",
      className: "bg-gradient-to-r from-[#F9731633] to-[#7f1d1d37]",
      content:
        "Runs on Sei’s fast, low-fee, parallelized chain—perfect for real-time DeFi actions.",
    },
  ];
  return (
    <Parallax speed={-5}>
      <div
        id="features"
        className="flex flex-col gap-[min(6vw,80px)] justify-start py-[80px] max-w-[1440px] mx-auto "
      >
        <div className="font-bold  text-[min(4vw,40px)] flex flex-col justify-center items-center">
          <h1 className="text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E099] bg-clip-text">
            Key Features
          </h1>
          <h2 className="font-thin font-sans text-[#98999A] text-[min(2vw,16px)]">
            Get the information you need about the Zyra
          </h2>
        </div>
        <div className="flex justify-around md:flex-wrap flex-col flex-wrap md:flex-row items-center w-full gap-8 md:gap-[min(2vw,30px)]">
          {featuresList.map((feature) => {
            // Calculate translateX for each card

            return (
              <SecondaryCard
                key={feature.title}
                image={feature.image}
                className={feature.className}
                title={feature.title}
                content={feature.content}
              />
            );
          })}
        </div>
      </div>
    </Parallax>
  );
};

export default Features;
