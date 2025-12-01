import { cn } from "@/lib/utils";
import { normalizeStatus } from "@/utility/transactionHistory";

export const StatusBadge = ({ status = "pending" }: { status?: string | null }) => {
  const normalized = normalizeStatus(status);
  const lookup: Record<string, { label: string; className: string }> = {
    success: {
      label: "Success",
      className:
        "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    },
    failed: {
      label: "Failed",
      className: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
    },
  };

  const config = lookup[normalized] || lookup.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs",
        config.className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};