// AiManagementCard - Displays AI portfolio management toggle
import { Wallet } from "lucide-react";
import { AiPortfolioManagement } from "../types/dashboard.types";


interface AiManagementCardProps {
  data: AiPortfolioManagement & { borrowedUsd?: number };
  onToggle?: (enabled: boolean) => void;
}

const AiManagementCard = ({ data, onToggle }: AiManagementCardProps) => {
  const { mode, isAutoEnabled, activeCategories, totalCategories, borrowedUsd } = data;

  return (
    <div className="flex-1 border border-white/30 rounded-2xl  bg-gradient-to-r from-[#7cacf910] via-[#FFFFFF0A] to-[#FFFFFF0A] p-5 flex flex-col justify-between min-h-[168px]">
      <div className="flex items-center gap-4">
        <div className="bg-white/[0.08] border border-white/10 rounded-xl p-2 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <p className="text-base font-medium text-white">Ai Portfolio Management</p>
      </div>
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-white to-white/60 bg-clip-text">
            {mode} {/* API: mode */}
          </p>
          {typeof borrowedUsd === "number" && (
            <p className="mt-1 text-xs text-blue-300">Borrowed: ${borrowedUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          )}
        </div>
        <div className="text-xs leading-4 text-right text-white/60">
          <p>Manual control</p>
          <p>
            Active Categories {activeCategories}/{totalCategories} {/* API: activeCategories */}
          </p>
        </div>
      </div>
      {/* Toggle Switch */}
      <button
        onClick={() => onToggle?.(!isAutoEnabled)}
        className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
          isAutoEnabled ? "bg-blue-500" : "bg-white/[0.08]"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-lg transition-transform ${
            isAutoEnabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default AiManagementCard;
