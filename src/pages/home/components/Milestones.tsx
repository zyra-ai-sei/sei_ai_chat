import MileStone from "@/assets/home/milestone.svg?react";
import Dot from "@/assets/home/dot.svg?react";
import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Milestones = () => {
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0.5,
    triggerOnce: true,
  });
  const variants = {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: {
      opacity: 0,
      scale: 0.65,
      y: 50,
    },
  };

  const timelineData = [
    {
      quarter: "Q2 2025",
      title: "Basic Blockchain Integration",
      description: [
        "Forked and customized SEI's MCP repository to create our core infrastructure",
        "Built foundational chat application with real-time SEI blockchain data integration",
        "Developed transaction creation tools that generate unsigned transactions for secure user signing",
      ],
    },
    {
      quarter: "Q3 2025",
      title: "Strategies Integration",
      description: [
        "Successfully integrated Orbs Network Layer 3 solution for sophisticated limit orders",
        "Launch comprehensive strategy selection system (DCA, limit orders, and custom strategies)",
      ],
    },
    {
      quarter: "Q4 2025",
      title: "Advanced Bots Integration",
      description: [
        "Implement strategy performance analytics and backtesting capabilities",
        "Launch automated trading bot infrastructure",
      ],
    },
    {
      quarter: "Q1 2026",
      title: "Grow tools and support",
      description: [
        "Launch advanced market analysis tools integrated with chat functionality",
        "Deploy cross-chain trading capabilities (expanding beyond SEI)",
        "Launch API access for advanced users and developers",
      ],
    },
  ];

  return (
    <Parallax speed={5}>
      <div
        id="timeline"
        className="flex flex-col gap-[min(6vw,80px)] py-[80px] justify-center w-full mx-auto"
      >
        <div className="font-bold text-[min(4vw,40px)] flex flex-col justify-center items-center">
          <h1 className="text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E099] bg-clip-text flex items-center gap-3">
            <MileStone className="w-[34px] h-[40px]" />
            Key Milestones Ahead{" "}
          </h1>
        </div>

        <div className="flex justify-center items-center w-full gap-[min(2vw,20px)]">
          <div className="mx-auto max-w-7xl">
            {/* Desktop/Tablet Timeline - Horizontal */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Horizontal dashed line */}
                <div
                  className="absolute top-2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-600"
                  style={{
                    borderImage:
                      "repeating-linear-gradient(to right, #4b5563 0, #4b5563 20px, transparent 20px, transparent 35px) 1",
                  }}
                ></div>
                {/* Timeline items */}
                <div className="relative flex items-start justify-between">
                  {timelineData.map((item, index) => (
                    <motion.div
                      key={index}
                      ref={ref}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                      variants={variants}
                      className="flex flex-col items-center w-64"
                    >
                      {/* Dot */}
                      <div>
                        <Dot className="relative z-10 w-5 h-5 mb-4 rounded-full" />
                      </div>

                      {/* Quarter */}
                      <Parallax
                        opacity={[0, 1, "easeOutExpo"]}
                        scale={[0, 1, "easeOutExpo"]}
                        className="absolute mb-2 text-[24px] font-medium text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E000] bg-clip-text whitespace-nowrap -top-12"
                      >
                        {item.quarter}
                      </Parallax>

                      {/* Content card */}
                      <div className="p-4 rounded-lg max-w-60">
                        <h3 className="mb-3 text-sm font-semibold text-[#94A3B8]">
                          {item.title}
                        </h3>
                        {item.description?.map((content, index) => (
                          <p
                            key={index}
                            className="text-xs leading-relaxed text-[#94A3B8] list-item "
                          >
                            {content}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Timeline - Vertical */}
            <div className="px-4 md:hidden">
              <div className="relative pl-8">
                {/* Vertical dashed line */}
                <div
                  className="absolute left-3 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-600"
                  style={{
                    borderImage:
                      "repeating-linear-gradient(to bottom, #4b5563 0, #4b5563 20px, transparent 20px, transparent 35px) 1",
                  }}
                ></div>

                {/* Timeline items */}
                <div className="space-y-8">
                  {timelineData.map((item, index) => (
                    <div key={index} className="relative ">
                      {/* Dot */}
                      <Dot className="absolute w-5 h-5 bg-white rounded-full -left-7 top-2" />
                      {/* Quarter */}
                      <div className=" mb-2 text-[24px] font-medium text-transparent bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E000] bg-clip-text whitespace-nowrap ">
                        {item.quarter}
                      </div>

                      {/* Content card */}
                      <div className="p-4 rounded-lg max-w-60">
                        <h3 className="mb-3 text-sm font-semibold text-[#94A3B8]">
                          {item.title}
                        </h3>
                        {item.description?.map((content, index) => (
                          <p
                            key={index}
                            className="text-xs leading-relaxed text-[#94A3B8] list-item "
                          >
                            {content}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Parallax>
  );
};

export default Milestones;
