"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PaymentStatus, Transaction } from "@/types/payment";

export const MAX_ATTEMPTS = 3;

interface PaymentState {
  status: PaymentStatus; 
  currentTxId: string | null; 
  lastReason?: string; 
  attempts: number;

  transactions: Transaction[];
  selectedTxId: string | null;
 
  setStatus: (s: PaymentStatus, reason?: string) => void;
  beginTransaction: (id: string) => void;
  incrementAttempt: () => void;
  recordResult: (tx: Omit<Transaction, "timestamp">) => void;
  resetCurrent: () => void;
  selectTx: (id: string | null) => void;
  clearHistory: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      status: "idle",
      currentTxId: null,
      lastReason: undefined,
      attempts: 0,
      transactions: [],
      selectedTxId: null,

      setStatus: (status, reason) => set({ status, lastReason: reason }),

      beginTransaction: (id) =>
        set({ currentTxId: id, attempts: 0, status: "idle", lastReason: undefined }),

      incrementAttempt: () => set({ attempts: get().attempts + 1 }),

      recordResult: (tx) => {
        const ts = Date.now();
        const existingIdx = get().transactions.findIndex((t) => t.id === tx.id);
        const next = [...get().transactions];
        const merged: Transaction = { ...tx, timestamp: ts };
        if (existingIdx >= 0) {
          next[existingIdx] = merged;
        } else {
          next.unshift(merged);
        } 
        next.sort((a, b) => b.timestamp - a.timestamp);
        set({ transactions: next.slice(0, 100) });
      },

      resetCurrent: () =>
        set({
          status: "idle",
          currentTxId: null,
          attempts: 0,
          lastReason: undefined,
        }),

      selectTx: (id) => set({ selectedTxId: id }),

      clearHistory: () => set({ transactions: [], selectedTxId: null }),
    }),
    {
      name: "payment-store-v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? (undefined as unknown as Storage)
          : window.localStorage,
      ), 
      partialize: (s) => ({ transactions: s.transactions }),
    },
  ),
);
