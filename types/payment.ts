export type Currency = "INR" | "USD";

export type CardType = "visa" | "mastercard" | "amex" | "unknown";

export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: Exclude<PaymentStatus, "idle" | "processing">;
  timestamp: number;
  attempts: number;
  failureReason?: string;
  last4: string;
  cardType: CardType;
  cardholder: string;
}

export interface PayApiResponse {
  status: "success" | "failed";
  reason?: string;
}
