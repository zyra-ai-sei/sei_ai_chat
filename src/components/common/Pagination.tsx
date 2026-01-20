import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white/40 transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Show only first, last, and pages around current
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-bold transition-all border",
                  currentPage === page
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white"
                )}
              >
                {page}
              </button>
            );
          } else if (
            (page === 2 && currentPage > 3) ||
            (page === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return (
              <span key={page} className="text-white/20 text-xs px-1">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white/40 transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
