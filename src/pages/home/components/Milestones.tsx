import { CheckCircle2 } from "lucide-react";

const Milestones = () => {
  const timelineData = [
    {
      quarter: "Q1",
      year: "2025",
      title: "Basic Blockchain\nIntegration",
      status: "completed",
      description: [
        "Forked and customized SEI's MCP repository to create our core infrastructure",
        "Built foundational chat application with real-time SEI blockchain data integration",
        "Developed transaction creation tools that generate unsigned transactions for secure user signing",
      ],
    },
    {
      quarter: "Q2",
      year: "2025",
      title: "Strategies\nIntegration",
      status: "in-progress",
      description: [
        "Successfully integrated Orbs Network",
        "Layer 3 solution for sophisticated limit orders",
        "Launch comprehensive strategy selection system (DCA, limit orders, and custom strategies)",
      ],
    },
    {
      quarter: "Q3",
      year: "2025",
      title: "Advanced Bots Integration",
      status: "upcoming",
      description: [
        "Implement strategy performance analytics and backtesting capabilities",
        "Launch automated trading bot infrastructure",
      ],
    },
    {
      quarter: "Q4",
      year: "2026",
      title: "Grow tools\nand support",
      status: "upcoming",
      description: [
        "Launch advanced market analysis tools integrated with chat functionality",
        "Deploy cross-chain trading capabilities (expanding beyond SEI)",
        "Launch API access for advanced users and developers",
      ],
    },
  ];

  return (
    <section className="bg-[#0D0C11] flex flex-col gap-[64px] items-center justify-center py-[84px] w-full max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-[16px] items-start text-center w-full">
        <p className="bg-clip-text font-['Figtree',sans-serif] font-semibold text-[48px] leading-[54px] tracking-[-0.96px] text-transparent bg-gradient-to-r from-white to-[#7CABF9] w-full">
          Key Milestones <span className="text-[#3B82F6]">ahead</span>
        </p>
        <p className="font-['Figtree',sans-serif] font-normal text-[16px] leading-[24px] text-white w-full">
          We're just getting started. Here's what's coming next as we build the future of conversational trading.
        </p>
      </div>

      {/* Timeline Cards */}
      <div className="flex gap-[24px] items-stretch px-[135px] w-full">
        {timelineData.map((item, index) => (
          <div
            key={index}
            className={`flex flex-row items-center self-stretch ${
              item.status === 'completed'
                ? 'bg-gradient-to-b from-[#3B82F6] to-[#193767]'
                : 'bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.12)]'
            } flex-col gap-[40px] items-start p-[24px] rounded-[24px] w-[274.5px] min-h-[400px]`}
          >
            {/* Quarter Badge */}
            <div className="flex gap-[12px] items-center">
              <div
                className={`${
                  item.status === 'completed'
                    ? 'bg-[rgba(255,255,255,0.3)]'
                    : 'bg-[rgba(53, 95, 212, 0.08)] border border-[rgba(3, 47, 136, 0.1)] border-solid'
                } flex flex-col gap-[8px] items-center justify-center p-[12px] rounded-[16px] w-[64px] h-[64px]`}
              >
                <p className="font-['Figtree',sans-serif] font-semibold text-[28px] leading-[28px] text-center text-white">
                  {item.quarter}
                </p>
              </div>
              <div className="flex flex-col justify-center font-['Figtree',sans-serif] font-normal text-[16px] leading-[24px] text-white">
                <p>{item.year}</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="font-['Figtree',sans-serif] font-semibold text-[24px] leading-[30px] text-white tracking-[-0.48px] w-full whitespace-pre-line">
                {item.title}
              </p>
              <div className="flex flex-col gap-[12px] items-start w-full">
                {item.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex gap-[8px] items-start w-full">
                    <CheckCircle2
                      className="w-[20px] h-[20px] shrink-0 text-white"
                      fill="none"
                    />
                    <p className="basis-0 font-['Figtree',sans-serif] font-normal grow text-[14px] leading-[18px] text-white min-h-px min-w-px">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Milestones;
