"use client";

import { useEffect, useMemo, useState } from "react";
import type { Currency, CardType } from "@/types/payment";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  cvvLength,
  detectCardType,
  formatCardNumber,
  formatExpiry,
  maxCardLength,
} from "@/lib/card-utils";
import {
  FieldErrors,
  validateAmount,
  validateCardNumber,
  validateCardholder,
  validateCvv,
  validateExpiry,
} from "@/lib/validation";

export interface PaymentFormValues {
  cardholder: string;
  cardNumber: string;   // formatted
  expiry: string;       // MM/YY
  cvv: string;
  amount: string;
  currency: Currency;
}

interface Props {
  values: PaymentFormValues;
  onChange: (next: PaymentFormValues) => void;
  onCardTypeChange: (t: CardType) => void;
  onCvvFocusChange: (focused: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
  disabled?: boolean;
}

type Touched = Partial<Record<keyof PaymentFormValues, boolean>>;

export function PaymentForm({
  values,
  onChange,
  onCardTypeChange,
  onCvvFocusChange,
  onSubmit,
  submitting,
  disabled,
}: Props) {
  const [touched, setTouched] = useState<Touched>({});

  const cardType = useMemo(() => detectCardType(values.cardNumber), [values.cardNumber]);

  useEffect(() => {
    onCardTypeChange(cardType);
  }, [cardType, onCardTypeChange]);

  // Compute live errors
  const errors: FieldErrors = useMemo(() => {
    return {
      cardholder: validateCardholder(values.cardholder),
      cardNumber: validateCardNumber(values.cardNumber),
      expiry: validateExpiry(values.expiry),
      cvv: validateCvv(values.cvv, values.cardNumber),
      amount: validateAmount(values.amount),
    };
  }, [values]);

  const isValid =
    !errors.cardholder &&
    !errors.cardNumber &&
    !errors.expiry &&
    !errors.cvv &&
    !errors.amount;

  // Show error if field touched OR (after change) when there's content
  function shownError(field: keyof FieldErrors): string | undefined {
    if (!errors[field]) return;
    // Show on blur. Also show on change once user typed something.
    const hasContent = String(values[field as keyof PaymentFormValues] ?? "").length > 0;
    if (touched[field] || hasContent) return errors[field];
    return;
  }

  function setVal<K extends keyof PaymentFormValues>(key: K, v: PaymentFormValues[K]) {
    onChange({ ...values, [key]: v });
  }

  function blur(field: keyof Touched) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault(); 
        setTouched({
          cardholder: true,
          cardNumber: true,
          expiry: true,
          cvv: true,
          amount: true,
        });
        if (isValid && !submitting && !disabled) onSubmit();
      }}
      className="grid gap-4"
    >
      <Input
        label="Cardholder name"
        autoComplete="cc-name"
        placeholder="Jane Appleseed"
        value={values.cardholder}
        onChange={(e) => setVal("cardholder", e.target.value)}
        onBlur={() => blur("cardholder")}
        error={shownError("cardholder")}
      />

      <Input
        label="Card number"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder={cardType === "amex" ? "3782 822463 10005" : "4242 4242 4242 4242"}
        value={values.cardNumber}
        onChange={(e) => setVal("cardNumber", formatCardNumber(e.target.value))}
        onBlur={() => blur("cardNumber")}
        error={shownError("cardNumber")}
        maxLength={cardType === "amex" ? 17 : 19}
        rightAdornment={<CardTypeBadge type={cardType} />}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Input
          label="Expiry (MM/YY)"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          value={values.expiry}
          onChange={(e) => setVal("expiry", formatExpiry(e.target.value))}
          onBlur={() => blur("expiry")}
          error={shownError("expiry")}
          maxLength={5}
        />
        <Input
          label="CVV"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder={cardType === "amex" ? "1234" : "123"}
          value={values.cvv}
          onChange={(e) => setVal("cvv", e.target.value.replace(/\D/g, "").slice(0, cvvLength(cardType)))}
          onBlur={() => {
            blur("cvv");
            onCvvFocusChange(false);
          }}
          onFocus={() => onCvvFocusChange(true)}
          error={shownError("cvv")}
          maxLength={cvvLength(cardType)}
          type="password"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 sm:gap-4 items-start">
        <Input
          label="Amount"
          inputMode="decimal"
          placeholder="100.00"
          value={values.amount}
          onChange={(e) => {
            // Allow only digits and a single dot
            const v = e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
            setVal("amount", v);
          }}
          onBlur={() => blur("amount")}
          error={shownError("amount")}
        />
        <div className="w-28">
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
          >
            Currency
          </label>
          <select
            id="currency"
            value={values.currency}
            onChange={(e) => setVal("currency", e.target.value as Currency)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus-ring dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={submitting}
        disabled={!isValid || submitting || disabled}
        className="mt-2 w-full"
      >
        {submitting ? "Processing payment…" : "Pay securely"}
      </Button>
 
    </form>
  );
}

function CardTypeBadge({ type }: { type: CardType }) {
  if (type === "unknown")
    return <Badge className="bg-slate-100 dark:bg-slate-800">Card</Badge>;
  const labels: Record<Exclude<CardType, "unknown">, string> = {
    visa: "Visa",
    mastercard: "MC",
    amex: "Amex",
  };
  const colors: Record<Exclude<CardType, "unknown">, string> = {
    visa: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
    mastercard: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
    amex: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  };
  return <Badge className={colors[type]}>{labels[type]}</Badge>;
}

// Re-export to satisfy unused import of maxCardLength when tree-shaking — kept for clarity.
void maxCardLength;
