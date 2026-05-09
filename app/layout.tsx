import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payment Gateway — Secure Checkout",
  description:
    "Modern fintech-style payment gateway demo with retries, timeout handling, and persistent history.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head> 
        <script 
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');var d=t?t==='light':window.matchMedia('(prefers-color-scheme: light)').matches;if(d)document.documentElement.classList.add('light');}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
