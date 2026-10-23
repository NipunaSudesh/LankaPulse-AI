"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const VARIANTS = {
  primary:
    "group/btn inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#00e6b8] px-6 py-3 text-sm font-bold text-[#020617] shadow-lg shadow-[#00e6b8]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#42f5d0] hover:shadow-xl hover:shadow-[#00e6b8]/25",

  secondary:
    "border border-slate-200 bg-slate-100 text-slate-800 hover:border-accent hover:bg-accent hover:text-dark-background dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main dark:hover:border-accent dark:hover:bg-accent dark:hover:text-dark-background",

  outline:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#00e6b8] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-black backdrop-blur-md transition-all duration-300 hover:border-[#00e6b8]/40 hover:bg-white/[0.08] hover:text-[#00e6b8] dark:border-white/15 dark:text-white",

  success:
    "bg-success text-white shadow-sm hover:bg-success/90 hover:shadow-[0_4px_16px_rgba(0,200,83,0.35)]",

  danger:
    "bg-danger text-white hover:bg-danger/90",

  ghost:
    "bg-transparent text-primary hover:bg-accent/10 hover:text-primary dark:text-primary-light dark:hover:bg-accent/10 dark:hover:text-accent",

  buy:
    "border border-buy bg-buy text-black/70 hover:bg-buy/90 hover:shadow-[0_4px_16px_rgba(0,200,83,0.35)] dark:text-white",

  sell:
    "border border-sell bg-sell text-black hover:bg-sell/90 hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)] dark:text-white",

  pagination:
    "h-11 w-11 shrink-0 rounded-full border border-border p-0 text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0",
};

const PAGINATION_ICONS = {
  previous: FaChevronLeft,
  next: FaChevronRight,
};

export default function Button({
  children,
  variant = "primary",
  direction,
  className = "",
  ...props
}) {
  const isPagination = variant === "pagination";
  const Icon = isPagination ? PAGINATION_ICONS[direction] : null;

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 shadow-2xl ${
        VARIANTS[variant] || VARIANTS.primary
      } ${className}`}
      aria-label={
        isPagination
          ? direction === "previous"
            ? "Previous page"
            : "Next page"
          : props["aria-label"]
      }
      {...props}
    >
      {isPagination ? (
        Icon ? <Icon size={13} /> : null
      ) : (
        children
      )}
    </button>
  );
}
