"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CardPreview } from "@/components/payment/CardPreview";
import { PaymentForm, PaymentFormValues } from "@/components/payment/PaymentForm";
import { PaymentResult } from "@/components/payment/PaymentResult";
import { TransactionList } from "@/components/history/TransactionList";
import { TransactionDetail } from "@/components/history/TransactionDetail";
import { MAX_ATTEMPTS, usePaymentStore } from "@/store/payment-store";
import { detectCardType, last4 } from "@/lib/card-utils";
import { formatMoney, newTransactionId } from "@/lib/payment-utils";
import type { CardType, Currency, PayApiResponse } from "@/types/payment";

const INITIAL: PaymentFormValues = {
  cardholder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

const REQUEST_TIMEOUT_MS = 6000;

export default function PaymentPage() {
  const [values, setValues] = useState<PaymentFormValues>(INITIAL);
  const [cardType, setCardType] = useState<CardType>("unknown");
  const [cvvFocused, setCvvFocused] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const status = usePaymentStore((s) => s.status);
  const setStatus = usePaymentStore((s) => s.setStatus);
  const currentTxId = usePaymentStore((s) => s.currentTxId);
  const beginTransaction = usePaymentStore((s) => s.beginTransaction);
  const incrementAttempt = usePaymentStore((s) => s.incrementAttempt);
  const attempts = usePaymentStore((s) => s.attempts);
  const lastReason = usePaymentStore((s) => s.lastReason);
  const recordResult = usePaymentStore((s) => s.recordResult);
  const resetCurrent = usePaymentStore((s) => s.resetCurrent);
 
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);
 
  const amountNum = Number(values.amount) || 0;
  const amountDisplay = formatMoney(amountNum, values.currency);
 
  const submitPayment = useCallback(
    async (txId: string) => {
      setStatus("processing");
      incrementAttempt();

      const startedAt = Date.now();
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      let result: { kind: "success" } | { kind: "failed"; reason: string } | { kind: "timeout" } | { kind: "network" };

      try {
        const res = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: txId,
            amount: amountNum,
            currency: values.currency as Currency,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          result = { kind: "failed", reason: "Gateway error. Please try again." };
        } else {
          const data = (await res.json()) as PayApiResponse;
          if (data.status === "success") result = { kind: "success" };
          else result = { kind: "failed", reason: data.reason ?? "Payment was declined" };
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          result = { kind: "timeout" };
        } else {
          result = { kind: "network" };
        }
      } finally {
        clearTimeout(timeoutHandle);
      }
 
      const elapsed = Date.now() - startedAt;
      if (elapsed < 2000) {
        await new Promise((r) => setTimeout(r, 2000 - elapsed));
      }
 
      const latestAttempts = usePaymentStore.getState().attempts;

      const baseTx = {
        id: txId,
        amount: amountNum,
        currency: values.currency,
        attempts: latestAttempts,
        last4: last4(values.cardNumber),
        cardType: detectCardType(values.cardNumber),
        cardholder: values.cardholder.trim(),
      };

      if (result.kind === "success") {
        setStatus("success");
        recordResult({ ...baseTx, status: "success" });
      } else if (result.kind === "timeout") {
        setStatus("timeout", "Request timed out");
        recordResult({ ...baseTx, status: "timeout", failureReason: "Request timed out" });
      } else if (result.kind === "network") {
        setStatus("failed", "Network error — please check your connection");
        recordResult({ ...baseTx, status: "failed", failureReason: "Network error" });
      } else {
        setStatus("failed", result.reason);
        recordResult({ ...baseTx, status: "failed", failureReason: result.reason });
      }
    },
    [amountNum, values, setStatus, incrementAttempt, recordResult],
  );

  const handleSubmit = useCallback(() => { 
    const id = newTransactionId();
    beginTransaction(id);
    void submitPayment(id);
  }, [beginTransaction, submitPayment]);

  const handleRetry = useCallback(() => {
    if (!currentTxId) return;
    if (attempts >= MAX_ATTEMPTS) return;
    void submitPayment(currentTxId);
  }, [currentTxId, attempts, submitPayment]);

  const handleNewPayment = useCallback(() => {
    resetCurrent();
    setValues(INITIAL);
  }, [resetCurrent]);

  const showResultPanel = status !== "idle";

  const headerSubtitle = useMemo(() => {
    if (status === "processing") return "Awaiting confirmation from your bank";
    if (status === "success") return "All done";
    if (status === "failed") return `Attempt ${attempts} of ${MAX_ATTEMPTS}`;
    if (status === "timeout") return `Attempt ${attempts} of ${MAX_ATTEMPTS}`;
    return "Enter your card details to continue";
  }, [status, attempts]);

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                <path d="M3 7l9-4 9 4-9 4-9-4z" strokeLinejoin="round" />
                <path d="M3 12l9 4 9-4M3 17l9 4 9-4" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Payment Gateway</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Secure checkout demo</p>
            </div>
          </div> 
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]"> 
          <div className="space-y-6"> 
            <div className="flex justify-center lg:justify-start">
              <CardPreview
                cardNumber={values.cardNumber}
                cardholder={values.cardholder}
                expiry={values.expiry}
                cvv={values.cvv}
                cardType={cardType}
                flipped={cvvFocused}
              />
            </div>

            <Card className="p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {showResultPanel ? "Payment status" : "Payment details"}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{headerSubtitle}</p>
              </div>

              {!showResultPanel ? (
                <PaymentForm
                  values={values}
                  onChange={setValues}
                  onCardTypeChange={setCardType}
                  onCvvFocusChange={setCvvFocused}
                  onSubmit={handleSubmit}
                  submitting={false}
                />
              ) : (
                <PaymentResult
                  status={status}
                  reason={lastReason}
                  attempts={attempts}
                  maxAttempts={MAX_ATTEMPTS}
                  amountDisplay={amountDisplay}
                  transactionId={currentTxId}
                  onRetry={handleRetry}
                  onNew={handleNewPayment}
                />
              )}
            </Card>
          </div>
 
          <aside aria-label="Recent transactions">
            <TransactionList />
          </aside>
        </div>
 
      </div>

      <TransactionDetail />
    </main>
  );
}
