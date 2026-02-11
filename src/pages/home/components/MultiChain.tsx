import Eth from '@/assets/chains/eth.svg';
import Sei from '@/assets/chains/sei.svg';
import Arb from '@/assets/chains/arbitrum.svg';
import Pol from '@/assets/chains/pol.svg';
import Base from '@/assets/chains/base.svg';
import ZyraIcon from '@/assets/icon.svg';
import { motion } from "framer-motion";

const chainsData = [
  { id: 'eth', icon: Eth, angle: -91 },   // Top
  { id: 'arb', icon: Arb, angle: -25 },     // Right
  { id: 'base',icon: Base, angle: 43 },      // Bottom-right
  { id: 'pol', icon: Pol, angle: 135 },    // Bottom-left
  { id: 'sei', icon: Sei, angle: 205 },       // Left
];

const RADIUS = 140; 
const CENTER = 180; // Absolute center of the 360x360 SVG box

const MultiChain = () => {
  
  // Helper to generate clean L-shaped paths
  const getPath = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const endX = CENTER + RADIUS * Math.cos(rad);
    const endY = CENTER + RADIUS * Math.sin(rad);

    // To create a structured "circuit" look, we route based on the angle
    // If it's more horizontal, we go horizontal then vertical, and vice versa.
    const useHorizontalFirst = Math.abs(Math.cos(rad)) > Math.abs(Math.sin(rad));
    
    if (useHorizontalFirst) {
      return `M ${CENTER} ${CENTER} L ${endX} ${CENTER} L ${endX} ${endY}`;
    } else {
      return `M ${CENTER} ${CENTER} L ${CENTER} ${endY} L ${endX} ${endY}`;
    }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Visual Section */}
          <div className="flex-1 relative order-2 lg:order-1 flex items-center justify-center">
            <div className="relative w-[360px] h-[360px]">
              
              {/* SVG Layer for Connections */}
              <svg 
                className="absolute inset-0 w-full h-full z-0" 
                viewBox="0 0 360 360" 
                fill="none" 
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#cc1442" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {chainsData.map((chain) => (
                  <motion.path
                    key={`line-${chain.id}`}
                    d={getPath(chain.angle)}
                    stroke="url(#lineGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                ))}
              </svg>

              {/* Center Hub (Zyra) */}
              <div 
                className="absolute z-20" 
                style={{ left: CENTER, top: CENTER, transform: 'translate(-50%, -50%)' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="relative flex items-center justify-center w-16 h-16 bg-[#1A1B1F] rounded-2xl border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <img src={ZyraIcon} alt="Zyra" className="w-10 h-10 relative z-10" />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl border-2 border-emerald-500/30"
                  />
                </motion.div>
              </div>

              {/* Chain Nodes */}
              {chainsData.map((chain) => {
                const rad = (chain.angle * Math.PI) / 180;
                const x = CENTER + RADIUS * Math.cos(rad);
                const y = CENTER + RADIUS * Math.sin(rad);

                return (
                  <motion.div
                    key={chain.id}
                    className="absolute z-10 pointer-events-auto"
                    style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.3)" }}
                      className="w-12 h-12 rounded-xl bg-[#16171A] border border-white/10 flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors"
                    >
                      <img src={chain.icon} alt={chain.id} className="w-7 h-7 object-contain" />
                    </motion.div>
                    
                  
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-10 order-1 lg:order-2 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                One App. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                  Every Chain.
                </span>
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto lg:mx-0">
                Experience true interoperability. Navigate the multi-chain ecosystem without switching tabs.
              </p>
            </div>
            
            {/* Features remain the same... */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiChain;