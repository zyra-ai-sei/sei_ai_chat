import React from "react";
import { motion } from "framer-motion";
import { Wallet, Activity, Zap, PieChart, ChevronDown } from "lucide-react";

const DashboardHeader = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: any) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
        {/* 1. Total Portfolio Value - Features a Gradient Glow */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <Wallet size={20} className="text-purple-400" />
            </div>
            <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
          <p className="text-zinc-500 text-sm font-medium">
            Total Portfolio Value
          </p>
          <h2 className="text-3xl font-bold mt-1 tracking-tight">$3,024.84</h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-emerald-400 text-sm font-bold">+2.4%</span>
            <span className="text-zinc-600 text-xs">past 24h</span>
          </div>
        </motion.div>

        {/* 2. Trading Summary - Interactive Hover state */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-3xl bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-xl hover:border-zinc-700 transition-colors"
        >
          <div className="p-3 bg-blue-500/20 w-fit rounded-2xl mb-4">
            <Activity size={20} className="text-blue-400" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Trading Summary</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold">1</h2>
            <span className="text-zinc-500 text-sm">Trade</span>
          </div>
          <div className="mt-4 flex justify-between items-center border-t border-zinc-800 pt-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                P&L
              </p>
              <p className="text-emerald-400 font-bold text-sm">$0.00</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Active Chains
              </p>
              <p className="text-zinc-300 font-bold text-sm">3</p>
            </div>
          </div>
        </motion.div>

        {/* 3. Chain Balance - Focused on the "Blue" accent */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-3xl bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">
              Chain Balance
            </p>
            <button className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700 transition-all">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-blue-400">Arbitrum</span>
              <ChevronDown size={14} className="text-zinc-500" />
            </button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">0.0003 ETH</h2>
          <div className="mt-2 flex justify-between items-end">
            <p className="text-zinc-500 text-sm">$0.92 USD</p>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
              +0.78%
            </span>
          </div>
        </motion.div>

        {/* 4. Portfolio Overview - Segmented Bar Animation */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-3xl bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={18} className="text-purple-400" />
            <p className="text-zinc-200 font-bold">Portfolio Overview</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold">$3,024.84</h2>
              <span className="text-zinc-500 text-xs mb-1">
                5 Chains Active
              </span>
            </div>

            {/* Animated Multi-segment Bar */}
            <div className="h-2.5 w-full bg-zinc-800/50 rounded-full flex overflow-hidden ring-1 ring-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "70%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-blue-500"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "20%" }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-purple-500"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "10%" }}
                transition={{ duration: 1, delay: 0.9 }}
                className="bg-zinc-600"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase">
                  ARB 70%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase">
                  SEI 20%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHeader;
