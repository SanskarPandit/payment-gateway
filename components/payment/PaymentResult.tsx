"use client";
import { Button } from "@/components/ui/Button";
import type { PaymentStatus } from "@/types/payment";
import { useEffect, useRef } from "react";

interface Props {
  status: PaymentStatus;
  reason?: string;
  attempts: number;
  maxAttempts: number;
  amountDisplay: string;
  transactionId: string | null;
  onRetry: () => void;
  onNew: () => void;
}

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  failed: (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
    </svg>
  ),
  timeout: (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  ),
};

export function PaymentResult({
  status,
  reason,
  attempts,
  maxAttempts,
  amountDisplay,
  transactionId,
  onRetry,
  onNew,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  // Move focus to the result heading for accessibility
  useEffect(() => {
    headingRef.current?.focus();
  }, [status]);

  if (status === "idle") return null;

  if (status === "processing") {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-10 animate-fade-in">
        <div className="h-14 w-14 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin-slow" aria-hidden />
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
        >
          Processing your payment
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Please don’t close this window…
        </p>
      </div>
    );
  }

  const isSuccess = status === "success";
  const isTimeout = status === "timeout";
  const isFailed = status === "failed";
  const exhausted = !isSuccess && attempts >= maxAttempts;

  const tone = isSuccess
    ? "text-emerald-600 dark:text-emerald-400"
    : isTimeout
      ? "text-amber-600 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";

  const ring = isSuccess
    ? "bg-emerald-100 dark:bg-emerald-500/15"
    : isTimeout
      ? "bg-amber-100 dark:bg-amber-500/15"
      : "bg-rose-100 dark:bg-rose-500/15";

  const heading = isSuccess
    ? "Payment successful"
    : isTimeout
      ? "Payment timed out"
      : "Payment failed";

  const message = isSuccess
    ? `We've received ${amountDisplay} successfully.`
    : isTimeout
      ? "We didn't hear back from the bank in time. Your card has not been charged."
      : reason
        ? `Reason: ${reason}.`
        : "Your payment couldn't be completed.";

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center text-center py-8 animate-fade-in">
      <div className={["flex h-20 w-20 items-center justify-center rounded-full animate-pop", ring, tone].join(" ")}>
        {isSuccess ? ICONS.success : isTimeout ? ICONS.timeout : ICONS.failed}
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
      >
        {heading}
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-slate-600 dark:text-slate-300">{message}</p>

      <dl className="mt-6 w-full max-w-sm space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
          <dd className="font-medium">{amountDisplay}</dd>
        </div>
        {transactionId && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">Txn ID</dt>
            <dd className="truncate font-mono text-xs">{transactionId}</dd>
          </div>
        )}
        {!isSuccess && (
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Attempts</dt>
            <dd className="font-medium">
              {attempts} of {maxAttempts}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        {!isSuccess && !exhausted && (
          <Button onClick={onRetry} className="flex-1">
            Retry payment
          </Button>
        )}
        {!isSuccess && exhausted && (
          <p className="flex-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
            Maximum retry attempts reached. Please use a different card or try again later.
          </p>
        )}
        <Button variant="secondary" onClick={onNew} className="flex-1">
          {isSuccess ? "Make another payment" : "Cancel"}
        </Button>
      </div>
    </div>
  );
}
