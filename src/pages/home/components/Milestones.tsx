import { motion } from "framer-motion";

const Milestones = () => {
  const timelineData = [
    {
      id: "01",
      quarter: "Q3",
      year: "2025",
      title: "Core Sei\nIntegration",
      status: "completed",
      theme: "from-[#FF6B6B] to-[#FF8E8E]",
      barColor: "bg-[#FF6B6B]",
      description: [
        "Connected base Sei swaps and transfers through natural language",
        "Live unsigned transaction preview with full edit controls",
        "Foundational chat UX improvements and reliable execution pipeline",
      ],
    },
    {
      id: "02",
      quarter: "Q4",
      year: "2025",
      title: "Strategies\nIntegration",
      status: "completed",
      theme: "from-[#FFA502] to-[#FFC048]",
      barColor: "bg-[#FFA502]",
      description: [
        "Add DCA, limit orders, and scheduled orders through NL prompts",
        "Build strategy templates users can reuse and modify easily",
      ],
    },
    {
      id: "03",
      quarter: "Q1",
      year: "2026",
      title: "Agents &\nIntelligence",
      status: "upcoming",
      theme: "from-[#D980FA] to-[#FDA7DF]",
      barColor: "bg-[#D980FA]",
      description: [
        "Introduce agent-based execution and monitoring",
        "Portfolio analytics & execution suggestions inside chat",
        "Support copy trading (single wallets & curated groups)",
      ],
    },
    {
      id: "04",
      quarter: "Q2",
      year: "2026",
      title: "Growth &\nEcosystem",
      status: "upcoming",
      theme: "from-[#2ED573] to-[#7BED9F]",
      barColor: "bg-[#2ED573]",
      description: [
        "User Generated Content Marketplace for AI agent templates",
        "Expand to multi-app distribution via developer tooling",
        "Launch API access for advanced users",
      ],
    },
  ];

  return (
    <section
      id="timeline"
      className="bg-[#0D0C11] flex flex-col gap-16 md:gap-24 pointer-events-none items-center justify-center py-20 md:py-32 w-full max-w-[1440px] mx-auto overflow-hidden"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6 items-center text-center w-full px-4"
      >
        <p className="bg-clip-text font-['Figtree'] font-bold text-4xl md:text-5xl lg:text-7xl tracking-[-0.02em] text-transparent bg-gradient-to-r from-white to-[#7CABF9]">
          Key Milestones <span className="text-[#3B82F6]">Ahead</span>
        </p>
        <p className="font-['Figtree'] text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed">
          We're just getting started. Here's what's coming next as we build the
          future of conversational trading.
        </p>
      </motion.div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-12 lg:gap-y-0 w-full px-6 md:px-12 lg:px-16 pb-20">
        {timelineData.map((item, index) => {
          const isEven = index % 2 !== 0;
          return (
            <div key={index} className="relative lg:px-4 lg:h-full">
              {/* Vertical Separator (Desktop Only) */}
              {index !== timelineData.length - 1 && (
                <div
                  className={`hidden lg:block absolute right-0 bottom-0 w-px bg-white/20 ${isEven ? "top-36" : "top-4"}`}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`
                  group relative flex flex-col gap-4 
                  ${isEven ? "items-end text-right lg:items-start lg:text-left lg:mt-32" : "items-start text-left"}
                `}
              >
                <div
                  className={`flex items-center gap-6 ${isEven ? "flex-row-reverse lg:flex-row" : "flex-row"}`}
                >
                  {/* Number */}
                  <span
                    className={`text-7xl md:text-8xl font-black font-['Figtree'] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b ${item.theme}`}
                  >
                    {item.id}
                  </span>

                  {/* Colored Vertical Bar */}
                  <div
                    className={`
                    w-1.5 h-20 ${item.barColor} rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:opacity-80 z-10
                    lg:absolute lg:-right-4 lg:translate-x-1/2 lg:top-4
                  `}
                  />
                </div>

                <div
                  className={`flex flex-col gap-3 ${isEven ? "items-end lg:items-start" : "items-start"}`}
                >
                  <h3
                    className={`text-2xl font-bold text-white font-['Figtree'] uppercase tracking-wide leading-tight whitespace-pre-line group-hover:text-[#7CABF9] transition-colors duration-300 ${isEven ? "text-right lg:text-left" : "text-left"}`}
                  >
                    {item.title}
                  </h3>

                  <div
                    className={`flex items-center gap-3 mb-2 ${isEven ? "flex-row-reverse lg:flex-row" : "flex-row"}`}
                  >
                    <div
                      className={`flex flex-col ${isEven ? "items-end lg:items-start" : "items-start"}`}
                    >
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {item.quarter} {item.year}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${item.status === "completed" ? "text-green-400" : item.status === "in-progress" ? "text-blue-400" : "text-purple-400"}`}
                      >
                        {item.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {item.description.map((desc, i) => (
                      <li
                        key={i}
                        className={`text-sm md:text-[15px] text-gray-400 leading-relaxed font-['Figtree'] font-medium ${isEven ? "text-right lg:text-left" : "text-left"}`}
                      >
                        {isEven ? <span>{desc}</span> : <span>{desc}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Milestones;
