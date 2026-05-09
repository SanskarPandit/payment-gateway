import type { PaymentStatus, Transaction } from "@/types/payment";

type Status = Transaction["status"] | PaymentStatus;

const COLORS: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  failed: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
  timeout: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  processing: "bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-200",
  idle: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

const LABELS: Record<string, string> = {
  success: "Success",
  failed: "Failed",
  timeout: "Timed out",
  processing: "Processing",
  idle: "Idle",
};

export function StatusChip({ status }: { status: Status }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        COLORS[status],
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}
