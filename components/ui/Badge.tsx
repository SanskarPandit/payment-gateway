import { HTMLAttributes } from "react";

export function Badge({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
