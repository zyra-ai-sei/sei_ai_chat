import L3 from '@/assets/home/L3.webp';
import OrbsIcon from '@/assets/home/orbs.svg'
import { motion } from "framer-motion";

const Orbs = () => {
  const features = [
    {
      title: "Better Prices",
      desc: "Time‑weighted execution smooths volatility and ensures optimal entry.",
    },
    {
      title: "MEV Resistant",
      desc: "Sliced swaps significantly reduce the risk of sandwich attacks.",
    },
    {
      title: "Non‑Custodial",
      desc: "Maintain full control. Your funds stay in your wallet at all times.",
    },
    {
      title: "Configurable",
      desc: "Full control over intervals, trade count, and slippage tolerance.",
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden pointer-events-none">
      {/* Background Decor */}
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-4">
              <img src={OrbsIcon} alt="Orbs" className="w-10 h-10 object-contain" />
              <div className="h-6 w-[1px] bg-white/20" />
              <span className="text-white/60 font-medium tracking-wider text-sm uppercase">Protocol Integration</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                Trade Smarter with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  ORBs TWAP
                </span>
              </h2>
              <p className="text-xl text-white/70">
                Chat‑Native, Cross‑Chain Order Execution
              </p>
              <p className="text-white/50 max-w-xl leading-relaxed">
                We've integrated ORBs protocol-grade contracts to call DEXs across all prominent chains. 
                Execute DCA, limit, and optimized market orders directly through our chat interface 
                using your EOA, ensuring lower slippage and reduced MEV risk.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <h4 className="text-white font-medium mb-1">{f.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
               {["DCA", "Limit Orders", "Market Orders"].map((tag) => (
                 <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80">
                   {tag}
                 </span>
               ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 overflow-hidden "
            >
              <img 
                src={L3} 
                alt="ORBs L3 Visual" 
                className="w-full h-auto object-cover mix-blend-lighten opacity-80 hover:opacity-100 transition-opacity duration-500 scale-[1.3] origin-center"
              />
            
            </motion.div>

            {/* Pulsing Decorative Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-10 blur-[100px] -z-10 rounded-full" 
            />
          </motion.div>

        </div>

        {/* Footer Intent Message */}
        <div className="mt-24 p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-medium text-white mb-3">Trade by Intent</h3>
          <p className="text-white/50 leading-relaxed">
            Tell the app <span className="text-white font-semibold">what</span> you want to do. 
            ORBs handles <span className="text-white font-semibold">how</span> it’s executed. 
            One chat interface, protocol‑grade execution across all supported chains.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Orbs;