"use client";
import { InputHTMLAttributes, forwardRef, useId } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  rightAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, rightAdornment, className = "", id, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={[
            "w-full h-11 rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400",
            "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
            "transition focus-ring",
            error
              ? "border-rose-400 dark:border-rose-500"
              : "border-slate-200 dark:border-slate-700 focus:border-brand-500",
            rightAdornment ? "pr-14" : "",
            className,
          ].join(" ")}
          {...rest}
        />
        {rightAdornment && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {rightAdornment}
          </div>
        )}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 animate-fade-in">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
