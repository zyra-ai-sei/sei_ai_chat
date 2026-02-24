import React from "react";
import { motion } from "framer-motion";

interface MobileViewToggleProps {
  activeView: "chat" | "canvas";
  onToggle: (view: "chat" | "canvas") => void;
}

const MobileViewToggle: React.FC<MobileViewToggleProps> = ({
  activeView,
  onToggle,
}) => {
  return (
    <div className="flex p-1 mx-4 my-3 bg-[#0d0d10] border border-white/10 rounded-xl relative">
      {/* Sliding background */}
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 border border-white/20 rounded-lg"
        initial={false}
        animate={{
          left: activeView === "chat" ? "4px" : "calc(50%)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => onToggle("chat")}
        className={`flex-1 py-2.5 text-sm font-medium z-10 transition-colors ${
          activeView === "chat"
            ? "text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Chat Interface
      </button>

      <button
        onClick={() => onToggle("canvas")}
        className={`flex-1 py-2.5 text-sm font-medium z-10 transition-colors ${
          activeView === "canvas"
            ? "text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Transactions
      </button>
    </div>
  );
};

export default MobileViewToggle;
