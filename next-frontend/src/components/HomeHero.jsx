
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

export default function HomeHero({
  button=false,
  label = "LANKA NEWS INTELLIGENCE",
  title = "Stay Informed.",
  highlight = "Think Smarter.",
  description = "Discover Sri Lankan news from multiple sources in one place. Let AI categorize stories, uncover important trends, and deliver concise insights on the events shaping our country.",
  className = "",
}) {
  const router = useRouter();

  const trustPoints = [
    "Multiple news sources",
    "AI-powered categorization",
    "Clear, concise insights",
  ];

  const intelligenceFeatures = [
    {
      title: "Smart categorization",
      description: "Stories grouped by topic",
      type: "categorization",
      color: "bg-light-blue/10 text-light-blue",
      dot: "bg-light-blue",
    },
    {
      title: "Emerging trends",
      description: "Discover what matters",
      type: "trends",
      color:
        "bg-accent/10 text-text-green-light dark:text-text-green-dark",
      dot: "bg-text-green-light dark:bg-text-green-dark",
    },
    {
      title: "Concise summaries",
      description: "Less noise, more context",
      type: "summary",
      color: "bg-primary/10 text-primary dark:text-light-blue",
      dot: "bg-primary dark:bg-light-blue",
    },
  ];

  return (
    <section className={`mt-10 w-full ${className}`}>
      <div className="group relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface shadow-2xl shadow-primary/5 transition-colors duration-300 dark:border-dark-border dark:bg-dark-background">
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center transition-transform duration-1000 group-hover:scale-[1.02]"
          style={{ backgroundImage: "url('/images/bg.png')" }}
        />

        {/* Theme-aware image overlays */}
        <div className="absolute inset-0 -z-20 bg-background/80 transition-colors duration-300 dark:bg-dark-background/80" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/70 dark:from-dark-background dark:via-dark-background/90 dark:to-dark-background/50" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background/90 via-transparent to-background/30 dark:from-dark-background/80 dark:via-transparent dark:to-dark-background/20" />

        {/* Decorative grid */}
        <div
          aria-hidden="true"
          className="hero-grid-overlay pointer-events-none absolute inset-0 -z-10"
        />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-[100px] dark:bg-primary/30" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-[100px] dark:bg-accent/10" />

        {/* Main layout */}
        <div className="container-custom relative grid min-h-[540px] items-center gap-12 py-10 sm:py-12 lg:min-h-[600px] lg:grid-cols-[1.2fr_0.8fr]">
          {/* Hero content */}
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-accent/25 bg-accent/5 px-4 py-2.5 shadow-lg shadow-primary/5 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--app-accent)]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-green-light dark:text-text-green-dark sm:text-xs">
                {label}
              </span>

              <span className="h-4 w-px bg-border dark:bg-dark-border" />

              <span className="text-[10px] font-medium text-text-muted dark:text-dark-text-muted sm:text-xs">
                AI-powered insights
              </span>
            </div>

            {/* Headline */}
            <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-[-0.045em] text-text-main dark:text-dark-text-main sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
              <br />
              <span className="brand-gradient">{highlight}</span>
            </h1>

            {/* Accent line */}
            <div className="mt-7 flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-accent" />
              <span className="h-px w-20 bg-gradient-to-r from-accent/60 to-transparent" />
            </div>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-sm leading-7 text-text-muted dark:text-dark-text-muted sm:text-base sm:leading-8 lg:text-lg">
              {description}
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                onClick={() => router.push("/latest-news")}
                className="min-h-12 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300"
              >
                Explore Latest News

                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
              {
                !button && (
                      <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("categories")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="min-h-12 rounded-xl border-border px-6 py-3 text-sm font-semibold text-text-main transition-colors hover:border-accent hover:bg-accent/5 dark:border-dark-border dark:text-dark-text-main"
              >
                Browse Categories

                <svg
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </Button>
                )
              }

            </div>

            {/* Trust points */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 dark:border-dark-border">
              {trustPoints.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 shrink-0 text-text-green-light dark:text-text-green-dark"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>

                  <span className="text-xs font-medium text-text-muted dark:text-dark-text-muted">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Intelligence card */}
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            {/* Floating glow */}
            <div className="absolute inset-8 rounded-full bg-light-blue/10 blur-3xl dark:bg-light-blue/20" />

            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/95 p-6 shadow-2xl shadow-primary/10 backdrop-blur-2xl dark:border-dark-border dark:bg-dark-card/90 dark:shadow-black/30">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-border pb-5 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
                    <svg
                      className="h-5 w-5 text-text-green-light dark:text-text-green-dark"
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
                    <p className="text-sm font-bold text-text-main dark:text-dark-text-main">
                      Intelligence Engine
                    </p>

                    <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                      News, organized smarter
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-text-green-light dark:text-text-green-dark">
                  AI
                </span>
              </div>

              {/* Feature rows */}
              <div className="space-y-3 py-6">
                {intelligenceFeatures.map((feature) => (
                  <div
                    key={feature.type}
                    className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-accent/40 dark:border-dark-border dark:bg-dark-background/60"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.color}`}
                      >
                        {feature.type === "categorization" && (
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
                        )}

                        {feature.type === "trends" && (
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
                        )}

                        {feature.type === "summary" && (
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            aria-hidden="true"
                          >
                            <path d="M7 8h10M7 12h7M7 16h5" />
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="4"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text-main dark:text-dark-text-main">
                          {feature.title}
                        </p>

                        <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                          {feature.description}
                        </p>
                      </div>

                      <span className={`h-2 w-2 rounded-full ${feature.dot}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom status */}
              <div className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                  <span className="text-xs font-medium text-text-main dark:text-dark-text-main">
                    Built for better awareness
                  </span>
                </div>

                <svg
                  className="h-4 w-4 text-text-green-light dark:text-text-green-dark"
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
            <div className="absolute -right-5 top-12 hidden -rotate-3 rounded-xl border border-border bg-surface/95 px-4 py-3 shadow-xl backdrop-blur-xl dark:border-dark-border dark:bg-dark-card/95 xl:block">
              <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
                Your news advantage
              </p>

              <p className="mt-1 text-sm font-bold text-text-main dark:text-dark-text-main">
                Context over noise
                <span className="text-text-green-light dark:text-text-green-dark">
                  .
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      </div>
    </section>
  );
}
