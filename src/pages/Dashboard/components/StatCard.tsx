// StatCard Component - Displays individual stat cards in the dashboard header
import { Wallet } from "lucide-react";

interface StatCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, children, className = "" }: StatCardProps) => {
  return (
    <div
      className={`flex-1 border border-white/30 rounded-2xl p-5 flex flex-col bg-gradient-to-r from-[#7cacf910] via-[#FFFFFF0A] to-[#FFFFFF0A] justify-between min-h-[168px] ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/[0.08] border border-white/10 rounded-xl p-2 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <p className="text-base font-medium text-white">{title}</p>
      </div>
      <div className="flex items-center justify-between w-full">{children}</div>
    </div>
  );
};

export default StatCard;
