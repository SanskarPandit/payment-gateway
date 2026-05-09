import type { CardType } from "@/types/payment"; 
export function detectCardType(num: string): CardType {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(34|37)/.test(n)) return "amex"; 
  if (/^5[1-5]/.test(n)) return "mastercard";
  return "unknown";
}
 
export function maxCardLength(type: CardType): number {
  return type === "amex" ? 15 : 16;
}
 
export function cvvLength(type: CardType): number {
  return type === "amex" ? 4 : 3;
}
 
export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const type = detectCardType(digits);
  const max = maxCardLength(type);
  const trimmed = digits.slice(0, max);

  if (type === "amex") {
    const a = trimmed.slice(0, 4);
    const b = trimmed.slice(4, 10);
    const c = trimmed.slice(10, 15);
    return [a, b, c].filter(Boolean).join(" ");
  }
  return trimmed.replace(/(.{4})/g, "$1 ").trim();
}
 
export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

/** Last 4 digits helper (digit-only input). */
export function last4(num: string): string {
  const d = num.replace(/\D/g, "");
  return d.slice(-4);
}
