import SecondaryCard from "@/components/home/cards/SecondaryCard";
import feature1 from '@/assets/home/feature1.png'
import feature2 from '@/assets/home/feature2.png'
const Features = () => {
  const featuresList = [
    {
      image: feature1,
      title:'Natural Language Trading',
      content:'No need to learn commands—just type in plain English. Zyra understands and turns your intent into blockchain trades seamlessly.',
    },
    {
      image: feature2,
      title:'TWAP & DCA',
      content:'Automate trades with TWAP and DCA to reduce slippage and market risk—no constant monitoring needed.',
    },
    {
      image: feature2,
      title:'Self-Custody',
      content:'Your wallet, your control. Zyra never holds your keys or tokens, ensuring full self-custody at all times.',
    },
    {
      image: feature2,
      title:'Multi-DEX Support',
      content:'Currently routes trades through DragonSwap, with support for more Sei-native DEXs coming soon.',
    },
    {
      image: feature2,
      title:'Built on Sei',
      content:'Runs on Sei’s fast, low-fee, parallelized chain—perfect for real-time DeFi actions.',
    },
   
  ]
  return (
    <div className="flex flex-col gap-[min(6vw,80px)] justify-center w-full mx-auto">
      <div className="font-bold  text-[min(4vw,40px)] flex flex-col justify-center items-center">
        <h1 className="text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E099] bg-clip-text">
          Key Features
        </h1>
        <h2 className="font-thin font-sans text-[#98999A] text-[min(2vw,16px)]">
         Get the information you need about the Zyra
        </h2>
      </div>
      <div className="flex justify-around md:flex-wrap flex-col md:flex-row items-center  w-full gap-8 md:gap-[min(2vw,30px)]">
        {/* {worksData.map((work) => (
          <PrimaryCard
            index={work.index}
            title={work.title}
            content={work.content}
          />
        ))} */}
        {
          featuresList.map(feature => (
            <SecondaryCard image={feature.image} title={feature.title} content={feature.content} />
          ))
        }
      </div>
    </div>
  );
};

export default Features;
