"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import Link from "next/link";

export default function HomeHero({
  label = "LANKA NEWS INTELLIGENCE",
  title = "Stay Informed.",
  highlight = "Think Smarter.",
  description = "Discover Sri Lankan news from multiple sources in one place. Let AI categorize stories, uncover important trends, and deliver concise insights on the events shaping our country.",
  className = "",
}) {
  const router = useRouter();
  return (
    <section className={`w-full mt-10 ${className}`}>
      <div className="group relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[#020617] shadow-2xl shadow-slate-950/10">
        {/* Background image */}
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center transition-transform duration-1000 group-hover:scale-[1.02]"
          style={{ backgroundImage: "url('/images/bg.png')" }}
          aria-hidden="true"
        />

        {/* Layered overlays */}
        <div className="absolute inset-0 -z-20 bg-[#020617]/75" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#020617] via-[#020617]/90 to-[#020617]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#020617]/80 via-transparent to-[#020617]/20" />

        {/* Decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "linear-gradient(to right, black, transparent 85%)",
          }}
          aria-hidden="true"
        />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-[#0000e6]/30 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full bg-[#00e6b8]/10 blur-[100px]" />

        <div className="container-custom relative grid min-h-[540px] items-center gap-12 py-2 sm:py-4 lg:min-h-[600px] lg:grid-cols-[1.2fr_0.8fr] ">
          {/* Main content */}
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className=" inline-flex items-center gap-3 rounded-full border border-[#00e6b8]/25 bg-[#00e6b8]/[0.07] px-4 py-2.5 shadow-lg shadow-black/10 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e6b8]/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#00e6b8] shadow-[0_0_12px_#00e6b8]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00e6b8] sm:text-xs">
                {label}
              </span>

              <span className="h-4 w-px bg-white/15" />

              <span className="text-[10px] font-medium text-slate-300 sm:text-xs">
                AI-powered insights
              </span>
            </div>

            {/* Headline */}
            <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
              <br />
              <span className="brand-gradient">{highlight}</span>
            </h1>

            {/* Accent line */}
            <div className="mt-7 flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-[#00e6b8]" />
              <span className="h-px w-20 bg-gradient-to-r from-[#00e6b8]/60 to-transparent" />
            </div>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
              {description}
            </p>

          
{/* CTA buttons */}
<div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
  <Button
    variant="primary"
    onClick={() => router.push("/news")}
    className="min-h-12 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300"
  >
    Explore Latest News
    <svg
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </Button>

  <Button
    variant="outline"
    onClick={() =>
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    className="min-h-12 rounded-xl border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-accent "
  >
    Browse Categories
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  </Button>
</div>



            {/* Trust points */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              {["Multiple news sources", "AI-powered categorization", "Clear, concise insights"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 shrink-0 text-[#00e6b8]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                    <span className="text-xs font-medium text-slate-300">
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* AI feature card */}
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            {/* Floating glow */}
            <div className="absolute inset-8 rounded-full bg-[#4169ff]/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0b1224]/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#00e6b8]/20 bg-[#00e6b8]/10">
                    <svg
                      className="h-5 w-5 text-[#00e6b8]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      aria-hidden="true"
                    >
                      <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                      <circle cx="12" cy="12" r="5" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Intelligence Engine
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      News, organized smarter
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-[#00e6b8]/20 bg-[#00e6b8]/10 px-2.5 py-1 text-[10px] font-bold text-[#00e6b8]">
                  AI
                </span>
              </div>

              {/* Feature rows */}
              <div className="space-y-3 py-6">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-colors hover:border-[#00e6b8]/25">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        aria-hidden="true"
                      >
                        <path d="M4 5h16M4 12h10M4 19h7" />
                        <circle cx="18" cy="12" r="2" />
                        <circle cx="15" cy="19" r="2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        Smart categorization
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Stories grouped by topic
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-colors hover:border-[#00e6b8]/25">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00e6b8]/10 text-[#00e6b8]">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        aria-hidden="true"
                      >
                        <path d="M4 19V5m0 14h16M8 15l4-5 3 3 5-7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        Emerging trends
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Discover what matters
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-[#00e6b8]" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-colors hover:border-[#00e6b8]/25">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        aria-hidden="true"
                      >
                        <path d="M7 8h10M7 12h7M7 16h5" />
                        <rect x="3" y="3" width="18" height="18" rx="4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        Concise summaries
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Less noise, more context
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                  </div>
                </div>
              </div>

              {/* Bottom status */}
              <div className="flex items-center justify-between rounded-xl border border-[#00e6b8]/15 bg-[#00e6b8]/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e6b8]" />
                  <span className="text-xs font-medium text-slate-200">
                    Built for better awareness
                  </span>
                </div>
                <svg
                  className="h-4 w-4 text-[#00e6b8]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </div>
            </div>

            {/* Floating decorative label */}
            <div className="absolute -right-5 top-12 hidden -rotate-3 rounded-xl border border-white/15 bg-[#111b30]/90 px-4 py-3 shadow-xl backdrop-blur-xl xl:block">
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Your news advantage
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                Context over noise<span className="text-[#00e6b8]">.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00e6b8]/60 to-transparent" />
      </div>
    </section>
  );
}
