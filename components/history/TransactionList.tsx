"use client";

import { Card } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { usePaymentStore } from "@/store/payment-store";
import { formatMoney, formatTimestamp } from "@/lib/payment-utils";
import { Button } from "@/components/ui/Button";

export function TransactionList() {
  const transactions = usePaymentStore((s) => s.transactions);
  const selectTx = usePaymentStore((s) => s.selectTx);
  const clearHistory = usePaymentStore((s) => s.clearHistory);

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M3 10h18M7 15h4" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">No transactions yet</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Your payments will appear here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Transaction history
        </h3>
        <Button variant="ghost" size="sm" onClick={() => {
          if (confirm("Clear all transaction history?")) clearHistory();
        }}>
          Clear
        </Button>
      </div>
      <ul role="list" className="divide-y divide-slate-100 dark:divide-slate-800">
        {transactions.map((tx) => (
          <li key={tx.id}>
            <button
              onClick={() => selectTx(tx.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60 focus-ring"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {formatMoney(tx.amount, tx.currency)}
                  </span>
                  <StatusChip status={tx.status} />
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                  •••• {tx.last4} · {formatTimestamp(tx.timestamp)} · {tx.attempts} attempt{tx.attempts === 1 ? "" : "s"}
                </div>
              </div>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
