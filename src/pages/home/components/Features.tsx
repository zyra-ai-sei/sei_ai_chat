import SecondaryCard from "@/components/home/cards/SecondaryCard";
import feature1 from "@/assets/features/natural.png";
import feature2 from "@/assets/features/twap.svg";
import feature3 from "@/assets/features/self-custody.svg";
import feature4 from "@/assets/features/multiDex.svg";
import feature5 from "@/assets/features/sei_2.svg"
import { Parallax } from "react-scroll-parallax";
const Features = () => {
  const featuresList = [
    {
      image: feature1,
      title: "Natural Language Trading",
      content:
        "No need to learn commands—just type in plain English. Zyra understands and turns your intent into blockchain trades seamlessly.",
    },
    {
      image: feature2,
      title: "TWAP & DCA",
      content:
        "Automate trades with TWAP and DCA to reduce slippage and market risk—no constant monitoring needed.",
    },
    {
      image: feature3,
      title: "Self-Custody",
      content:
        "Your wallet, your control. Zyra never holds your keys or tokens, ensuring full self-custody at all times.",
    },
    {
      image: feature4,
      title: "Multi-DEX Support",
      content:
        "Currently routes trades through DragonSwap, with support for more Sei-native DEXs coming soon.",
    },
    {
      image: feature5,
      title: "Built on Sei",
      content:
        "Runs on Sei’s fast, low-fee, parallelized chain—perfect for real-time DeFi actions.",
    },
  ];
  return (
    <Parallax speed={-5}>
      <div className="flex flex-col gap-[min(6vw,80px)] justify-center w-full mx-auto">
        <div className="font-bold  text-[min(4vw,40px)] flex flex-col justify-center items-center">
          <h1 className="text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E099] bg-clip-text">
            Key Features
          </h1>
          <h2 className="font-thin font-sans text-[#98999A] text-[min(2vw,16px)]">
            Get the information you need about the Zyra
          </h2>
        </div>
        <div className="flex justify-around md:flex-wrap flex-col md:flex-row items-center w-full gap-8 md:gap-[min(2vw,30px)]">
          {featuresList.map((feature, idx) => {
            // Calculate translateX for each card
            let translateX = 0;
            if (idx === 0) translateX = -60;
            else if (idx === featuresList.length - 1) translateX = 60;
            else if (idx === 1) translateX = -30;
            else if (idx === featuresList.length - 2) translateX = 30;

            const isDesktop =
              typeof window !== "undefined" && window.innerWidth >= 1080;

            return isDesktop ? (
              <Parallax key={feature.title} speed={10} translateX={[translateX, 0, 'easeOutExpo']} opacity={[0,1,'easeOutExpo']}>
                <SecondaryCard
                  image={feature.image}
                  title={feature.title}
                  content={feature.content}
                />
              </Parallax>
            ) : (
              <SecondaryCard
                key={feature.title}
                image={feature.image}
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
