import { motion } from "framer-motion";
import ClickToCopy from "../../../components/common/ClickToCopy";

const CTA = () => {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden pointer-events-none">

      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 p-8 md:p-16 rounded-[40px] backdrop-blur-sm ">
            
            {/* Icon */}
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-2 shadow-inner shadow-white/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="m22 6-10 7L2 6"/>
                </svg>
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold font-['Figtree'] leading-tight tracking-tight text-white">
                    Get in <br className="md:hidden"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Touch
                    </span>
                </h2>

                <p className="text-lg md:text-xl text-gray-400 font-['Figtree'] max-w-xl mx-auto leading-relaxed">
                    Have questions regarding the project or feedback? We'd love to hear from you. Reach out to our team anytime.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
                <motion.a
                    href="mailto:admin@zyrachat.app"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 pointer-events-auto rounded-full bg-white text-black font-semibold font-['Figtree'] hover:bg-gray-100 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Contact Us
                </motion.a>
                
<ClickToCopy textToCopy="admin@zyrachat.app">
                <div 
                    className="px-6 py-4 pointer-events-auto rounded-full border border-white/10 bg-white/5 text-white/60 font-medium font-['Figtree'] flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors group"
                >
                    <span className="text-sm">admin@zyrachat.app</span>
                    <svg className="w-4 h-4 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </div>
                </ClickToCopy>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
