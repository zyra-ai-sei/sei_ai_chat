import { motion } from "framer-motion";
import avatarImg from "@/assets/home/avatar.png";
import noFormIcon from "@/assets/chat/no-form-view.png";

interface Message {
  type: "user" | "bot";
  content: string;
}

interface MainChatAreaProps {
  messages: Message[];
}

const MainChatArea = ({ messages }: MainChatAreaProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0D0C11] relative overflow-auto">
      {messages.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-[80px] h-[80px] flex items-center justify-center">
            <img src={noFormIcon} alt="No form to view" className="w-[80px] h-[80px] object-contain opacity-40" />
          </div>
          <p className="text-white/40 text-sm font-['Figtree',sans-serif]">No form to view</p>
        </div>
      ) : (
        // Messages Display
        <div className="w-full max-w-[800px] px-6 py-8 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "bot" && (
                <div className="flex gap-3 max-w-[80%]">
                  {/* Bot Avatar */}
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full blur-[8px] opacity-60"
                         style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                    <img src={avatarImg} alt="Zyra" className="w-8 h-8 object-contain relative z-10" />
                  </div>

                  {/* Bot Message */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-white text-sm font-['Figtree',sans-serif] leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              )}

              {message.type === "user" && (
                <div className="bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                  <p className="text-white text-sm font-['Figtree',sans-serif] leading-relaxed">
                    {message.content}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainChatArea;
