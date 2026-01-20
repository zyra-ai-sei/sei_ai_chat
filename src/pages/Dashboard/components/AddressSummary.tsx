import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, CheckCircle2, Loader2, Sparkles, TrendingUp, Target, BrainCircuit, Info, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface AddressSummaryProps {
  address: string;
  summary: string;
  isLoading: boolean;
}

const AddressSummary: React.FC<AddressSummaryProps> = ({ address, summary, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px] border border-blue-500/20 rounded-2xl bg-blue-500/5">
        <div className="relative mb-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <BrainCircuit className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-blue-400" />
        </div>
        <p className="text-sm font-bold text-blue-400 uppercase tracking-widest animate-pulse">Running Profile Inference...</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-4 p-5 rounded-2xl text-white/70 font-light border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl"
    >
      {/* Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Zap size={18} className="text-blue-400" />
          <div>
            <p className="text-[10px] uppercase font-bold text-blue-400/70 tracking-tighter">AI Confidence</p>
            <p className="text-sm font-bold text-white">High Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <ShieldCheck size={18} className="text-purple-400" />
          <div>
            <p className="text-[10px] uppercase font-bold text-purple-400/70 tracking-tighter">Security Posture</p>
            <p className="text-sm font-bold text-white">Low Risk Profile</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <TrendingUp size={18} className="text-emerald-400" />
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-400/70 tracking-tighter">Activity Level</p>
            <p className="text-sm font-bold text-white">Active Surveillance</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-br from-blue-500 to-transparent rounded-bl-full" />
        
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <Info size={16} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Address Intelligence Report</h3>
        </div>

        <div className="prose prose-invert max-w-none 
          prose-headings:text-blue-400 prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-xl prose-h1:mb-6 prose-h1:uppercase
          prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-2
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-white/90
          prose-p:text-white/60 prose-p:leading-relaxed prose-p:text-sm prose-p:mb-4
          prose-li:text-white/50 prose-li:text-sm prose-li:mb-2
          prose-strong:text-blue-400 prose-strong:font-bold
          prose-table:border-collapse prose-table:w-full prose-table:my-6
          prose-th:bg-blue-500/10 prose-th:px-4 prose-th:py-2 prose-th:text-blue-400 prose-th:text-xs prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:border prose-th:border-blue-500/20
          prose-td:px-4 prose-td:py-3 prose-td:text-xs prose-td:font-mono prose-td:border prose-td:border-white/5 prose-td:bg-white/[0.01]
          prose-code:text-emerald-400 prose-code:bg-emerald-500/10 prose-code:px-1 prose-code:rounded
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {summary}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default AddressSummary;

