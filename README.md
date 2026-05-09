# Payment Gateway UI
 
## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- **Live form validation** (on change + blur, field-specific errors, submit disabled until valid)
- **Live animated card preview** with **flip on CVV focus**, dynamic card type detection (Visa / Mastercard / Amex), and brand gradients
- **Auto-formatting** for card number (4-4-4-4 / 4-6-5 for Amex) and expiry (MM/YY)
- **Luhn-checked** card numbers, valid future expiry, CVV length per brand (3/4)
- **Mock payment API** (`POST /api/pay`) — 60% success / 25% failed / 15% timeout (8s server delay)
- **AbortController-based 6s timeout** on the client, cleanly classified as TIMEOUT (separate from network and API failures)
- **Idempotent retries**: `crypto.randomUUID()` per new payment, retries reuse the **same** transaction ID. Max **3 attempts**, then permanent failure UI.
- **Persistent transaction history** via Zustand `persist` middleware (`localStorage`, key `payment-store-v1`) with newest-first list, status chips, and a slide-in **detail drawer** with copy-to-clipboard.
- **Accessibility**: visible labels, `aria-describedby` for errors, `role="status"` + `aria-live="polite"` for results, **focus moves** to result heading, escape-to-close modal, semantic HTML, keyboard-friendly buttons, focus rings.
- **Responsive**: works at 375px (stacked), tablet, and 1280px+ (split layout, history sidebar).
- **Dark mode** with no-flash inline pre-paint script.
- **Reusable UI primitives**: `Button`, `Input`, `Card`, `Badge`, `Modal`, `StatusChip`.

## Project structure

```
app/
  api/pay/route.ts      # Mock gateway
  layout.tsx
  page.tsx              # Composition root
  globals.css
components/
  payment/              # CardPreview, PaymentForm, PaymentResult
  ui/                   # Button, Input, Card, Badge, Modal, StatusChip
  history/              # TransactionList, TransactionDetail
store/payment-store.ts  # Zustand + persist middleware
lib/                    # validation, card-utils, payment-utils
types/payment.ts
```

## Test cards 

- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Amex: `3782 822463 10005`

Use any future expiry, any matching-length CVV, and any positive amount.
