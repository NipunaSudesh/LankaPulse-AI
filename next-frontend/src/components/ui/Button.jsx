'use client';

const VARIANTS = {
  primary:
    'group/btn inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#00e6b8] px-6 py-3 text-sm font-bold text-[#020617] shadow-lg shadow-[#00e6b8]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#42f5d0] hover:shadow-xl hover:shadow-[#00e6b8]/25',

  secondary:
    'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-accent hover:text-dark-background hover:border-accent dark:bg-dark-surface dark:text-dark-text-main dark:border-dark-border dark:hover:bg-accent dark:hover:text-dark-background dark:hover:border-accent',

  outline:
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border dark:border-white/15 border-[#00e6b8] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-black dark:text-white backdrop-blur-md transition-all duration-300 hover:border-[#00e6b8]/40 hover:bg-white/[0.08] hover:text-[#00e6b8] ',

  success:
    'bg-success text-white hover:bg-success/90 shadow-sm hover:shadow-[0_4px_16px_rgba(0,200,83,0.35)] dark:bg-success dark:text-white',

  danger:
    'bg-danger text-white hover:bg-danger/90 dark:bg-danger dark:text-white',

  ghost:
    'bg-transparent text-primary hover:bg-accent/10 hover:text-primary dark:text-primary-light dark:hover:bg-accent/10 dark:hover:text-accent ',

  buy:
    'bg-buy text-black/70 dark:text-white hover:bg-buy/90 hover:shadow-[0_4px_16px_rgba(0,200,83,0.35)] dark:bg-buy dark:text-white border border-buy dark:border-buy',

  sell:
    'bg-sell text-black dark:text-white hover:bg-sell/90 hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)] dark:bg-sell dark:text-white border border-sell dark:border-sell',
};

/* =========================================================
   BUTTON COMPONENT
   ========================================================= */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 disabled:cursor-not-allowed shadow-2xl disabled:opacity-50 disabled:hover:translate-y-0 ${
        VARIANTS[variant] || VARIANTS.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}