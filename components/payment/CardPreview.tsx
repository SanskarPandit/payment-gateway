"use client";
import { CardType } from "@/types/payment";

interface Props {
  cardNumber: string;       // formatted with spaces
  cardholder: string;
  expiry: string;           // MM/YY
  cvv: string;
  cardType: CardType;
  flipped: boolean;
}

const GRADIENTS: Record<CardType, string> = {
  visa: "bg-card-gradient-visa",
  mastercard: "bg-card-gradient-mc",
  amex: "bg-card-gradient-amex",
  unknown: "bg-card-gradient",
};

function CardLogo({ type }: { type: CardType }) {
  if (type === "visa")
    return <span className="text-white text-2xl font-extrabold italic tracking-tight">VISA</span>;
  if (type === "mastercard")
    return (
      <div className="flex items-center -space-x-3">
        <span className="h-7 w-7 rounded-full bg-rose-500/90" />
        <span className="h-7 w-7 rounded-full bg-amber-400/90 mix-blend-screen" />
      </div>
    );
  if (type === "amex")
    return (
      <span className="rounded bg-white/95 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
        Amex
      </span>
    );
  return <span className="text-white/70 text-xs uppercase tracking-widest">Card</span>;
}

export function CardPreview({ cardNumber, cardholder, expiry, cvv, cardType, flipped }: Props) {
  const display = cardNumber || (cardType === "amex" ? "•••• •••••• •••••" : "•••• •••• •••• ••••");
  const padded = cardType === "amex"
    ? padTemplate(display, "•••• •••••• •••••")
    : padTemplate(display, "•••• •••• •••• ••••");

  return (
    <div className="card-flip aspect-[1.586/1] w-full max-w-md select-none" aria-label="Card preview">
      <div className={["card-flip-inner", flipped ? "" : ""].join(" ")} style={{ transform: flipped ? "rotateY(180deg)" : "" }}>
        {/* Front */}
        <div className={[
          "card-face rounded-2xl p-5 sm:p-6 text-white shadow-card overflow-hidden",
          GRADIENTS[cardType],
        ].join(" ")}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="h-9 w-12 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-inner" aria-hidden />
              <span className="text-xs uppercase tracking-widest text-white/70">Debit</span>
            </div>
            <CardLogo type={cardType} />
          </div>

          <div className="mt-8 sm:mt-10 font-mono text-lg sm:text-xl tracking-[0.2em] tabular-nums">
            {padded}
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Cardholder</div>
              <div className="mt-0.5 text-sm font-medium uppercase truncate max-w-[180px] sm:max-w-[220px]">
                {cardholder || "Your name"}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Expires</div>
              <div className="mt-0.5 font-mono text-sm tabular-nums">{expiry || "MM/YY"}</div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className={[
          "card-face card-back rounded-2xl text-white shadow-card overflow-hidden",
          GRADIENTS[cardType],
        ].join(" ")}>
          <div className="mt-6 h-10 w-full bg-black/70" />
          <div className="px-5 sm:px-6 mt-5">
            <div className="flex items-center justify-end gap-3">
              <div className="text-xs text-white/70">CVV</div>
              <div className="rounded-md bg-white/95 px-3 py-1.5 font-mono text-sm tracking-widest text-slate-900">
                {cvv ? cvv.replace(/./g, "•") : (cardType === "amex" ? "••••" : "•••")}
              </div>
            </div>
            <p className="mt-6 text-[10px] leading-relaxed text-white/60">
              This card is issued by Payment Gateway. Use of this card is subject to the cardholder agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Overlay typed value on top of placeholder template, preserving spaces. */
function padTemplate(value: string, template: string): string {
  let out = "";
  for (let i = 0; i < template.length; i++) {
    const t = template[i];
    const v = value[i];
    if (t === " ") out += " ";
    else out += v && v !== " " ? v : "•";
  }
  return out;
}
