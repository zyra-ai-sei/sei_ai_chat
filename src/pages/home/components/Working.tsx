import PrimaryCard from "@/components/home/cards/PrimaryCard";
import { Parallax } from "react-scroll-parallax";

const Working = () => {
  const worksData = [
    {
      index: "1",
      title: "Speak Naturally",
      content:
        'Tell Zyra what you want to do in plain English. "Send 10 SEI to Alice" or "Swap my USDC for BTC"',
    },
    {
      index: "2",
      title: "AI Processing",
      content: "Our advanced AI understands your intent and converts it into precise blockchain transactions",
    },
    {
      index: "3",
      title: "Execute On-Chain",
      content:
        "Review and confirm the transaction. Zyro executes it securely on the blockchain in real-time",
    },
  ];


  return (
    <Parallax speed={2}>
      <div id="#about" className="flex flex-col gap-[min(6vw,80px)] bg-[#13161a80] py-[20px] justify-start max-w-[1440px] mx-auto">
        <div className="font-bold  text-[min(4vw,40px)] flex flex-col justify-center items-center">
          <h1 className="text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E099] bg-clip-text">
            HOW ZYRA WORKS
          </h1>
          <h2 className="font-thin font-sans text-[#98999A] text-[min(2vw,16px)]">
          Three simple steps to transform your words into blockchain actions
          </h2>
        </div>
        <div className="flex justify-center flex-col md:flex-row items-center  w-full gap-[min(2vw,30px)]">
          {worksData.map((work) => (
            <div>

            <PrimaryCard
              index={work.index}
              title={work.title}
              content={work.content}
            />
            </div>
          ))}
        </div>
      </div>
    </Parallax>
  );
};

export default Working;
