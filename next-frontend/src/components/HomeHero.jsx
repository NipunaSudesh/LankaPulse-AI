import React from "react";

export default function HomeHero({
  label = "LANKA NEWS INTELLIGENCE",
  title = "Stay Informed.",
  highlight = "Think Smarter.",
  description = "Discover Sri Lankan news from multiple sources in one place. Let AI categorize stories, uncover important trends, and deliver concise insights on the events shaping our country.",
  className = "",
}) {
  return (
    <section className={`mt-10 w-full  ${className}`}>
      <div
        className="relative w-full rounded-3xl overflow-hidden border-y border-slate-200 bg-cover bg-center bg-no-repeat dark:border-slate-800"
        style={{
          backgroundImage: "url('/images/bg.png')",
        }}
      >
        {/* Light overlay */}
        <div className="absolute inset-0 bg-slate-950/45 " />

        {/* Hero content */}
        <div className="container-custom relative z-10 py-14 sm:py-20 lg:py-24">
          <p className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-widest bg-slate-900/60 text-emerald-300 sm:text-sm">
            {label}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}{" "}
            <span className="brand-gradient">{highlight}</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}