import PrimaryCard from "@/components/home/cards/PrimaryCard";

const Working = () => {
  const worksData = [
    {
      index: "01",
      title: "Chat",
      content:
        'Type your intent in plain English: "Swap 50 SEI to USDC every hour."',
    },
    {
      index: "02",
      title: "Zyra parses and plans",
      content: "Zyra turns your text into optimized blockchain strategy.",
    },
    {
      index: "03",
      title: "Transaction Executed",
      content:
        "The trade is executed trustlessly on Sei using smart contracts.",
    },
  ];
  return (
    <div className="flex flex-col gap-[min(6vw,80px)] justify-center w-full mx-auto">
      <div className="font-bold  text-[min(4vw,40px)] flex flex-col justify-center items-center">
        <h1 className="text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E099] bg-clip-text">HOW IT WORKS</h1>
        <h2 className="font-thin font-sans text-[#98999A] text-[min(2vw,16px)]">
          "Trade crypto like you're texting a friend."
        </h2>
      </div>
      <div className="flex justify-center flex-col md:flex-row items-center  w-full gap-[min(2vw,20px)]">
        {worksData.map((work) => (
          <PrimaryCard
            index={work.index}
            title={work.title}
            content={work.content}
          />
        ))}
      </div>
    </div>
  );
};

export default Working;
