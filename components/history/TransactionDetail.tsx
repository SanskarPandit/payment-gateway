"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { StatusChip } from "@/components/ui/StatusChip";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/payment-store";
import { formatMoney, formatTimestamp } from "@/lib/payment-utils";

export function TransactionDetail() {
  const selectedId = usePaymentStore((s) => s.selectedTxId);
  const select = usePaymentStore((s) => s.selectTx);
  const tx = usePaymentStore((s) => s.transactions.find((t) => t.id === selectedId));
  const [copied, setCopied] = useState(false);

  const open = !!selectedId && !!tx;

  return (
    <Modal open={open} onClose={() => select(null)} title="Transaction details" variant="drawer">
      {tx && (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-2xl font-semibold tracking-tight">
                {formatMoney(tx.amount, tx.currency)}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {formatTimestamp(tx.timestamp)}
              </div>
            </div>
            <StatusChip status={tx.status} />
          </div>

          <dl className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-800/40">
            <Row label="Cardholder" value={tx.cardholder} />
            <Row label="Card" value={`${cardLabel(tx.cardType)} •••• ${tx.last4}`} />
            <Row label="Currency" value={tx.currency} />
            <Row label="Attempts" value={String(tx.attempts)} />
            {tx.failureReason && <Row label="Failure reason" value={tx.failureReason} />}
            <Row
              label="Transaction ID"
              value={
                <span className="flex items-center gap-2">
                  <code className="break-all rounded bg-white px-1.5 py-0.5 text-[11px] dark:bg-slate-900">
                    {tx.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(tx.id);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      } catch {
                        /* noop */
                      }
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </span>
              }
            />
          </dl>

          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => select(null)}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function cardLabel(t: string) {
  switch (t) {
    case "visa": return "Visa";
    case "mastercard": return "Mastercard";
    case "amex": return "Amex";
    default: return "Card";
  }
}
