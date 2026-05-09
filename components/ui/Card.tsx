import { HTMLAttributes } from "react";

export function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-soft",
        "dark:border-slate-800 dark:bg-slate-900",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
