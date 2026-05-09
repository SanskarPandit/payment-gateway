import { cvvLength, detectCardType, maxCardLength } from "./card-utils";

export type FieldErrors = Partial<{
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: string;
}>;

const CARDHOLDER_RE = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;

export function validateCardholder(v: string): string | undefined {
  const t = v.trim();
  if (!t) return "Cardholder name is required";
  if (!CARDHOLDER_RE.test(t)) return "Use letters, spaces, hyphens or apostrophes";
  return;
}

export function validateCardNumber(v: string): string | undefined {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "Card number is required";
  const type = detectCardType(digits);
  const max = maxCardLength(type);
  if (digits.length < max) return `Card number must be ${max} digits`;
  if (!luhnCheck(digits)) return "Card number is invalid";
  return;
}

export function validateExpiry(v: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return "Use MM/YY format";
  const month = Number(m[1]);
  const yy = Number(m[2]);
  if (month < 1 || month > 12) return "Invalid month";

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (yy < currentYear || yy > currentYear + 20) return "Invalid expiry year";
  if (yy === currentYear && month < currentMonth) return "Card has expired";
  return;
}

export function validateCvv(v: string, cardNumber: string): string | undefined {
  const digits = v.replace(/\D/g, "");
  const type = detectCardType(cardNumber);
  const need = cvvLength(type);
  if (!digits) return "CVV is required";
  if (digits.length !== need) return `CVV must be ${need} digits`;
  return;
}

export function validateAmount(v: string): string | undefined {
  if (!v.trim()) return "Amount is required";
  const n = Number(v);
  if (!Number.isFinite(n)) return "Amount must be a number";
  if (n <= 0) return "Amount must be greater than 0";
  if (n > 10_000_000) return "Amount is too large";
  return;
}
 
export function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (!digits) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}
