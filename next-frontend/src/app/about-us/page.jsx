
"use client";

import React from "react";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiGlobe,
  FiCpu,
  FiTrendingUp,
  FiLayers,
  FiSearch,
  FiFilter,
  FiActivity,
  FiZap,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

import Button from "@/components/ui/Button";

const features = [
  {
    number: "01",
    icon: FiGlobe,
    title: "News from multiple sources",
    description:
      "Explore stories from different publishers in one place and get a broader view of the events shaping Sri Lanka.",
    color: "bg-light-blue/10 text-light-blue",
  },
  {
    number: "02",
    icon: FiCpu,
    title: "AI-powered understanding",
    description:
      "Use AI-assisted categorization and concise summaries to navigate complex stories and discover useful context.",
    color:
      "bg-accent/10 text-text-green-light dark:text-text-green-dark",
  },
  {
    number: "03",
    icon: FiTrendingUp,
    title: "Discover emerging trends",
    description:
      "Explore recurring topics and developing stories to better understand how news and public conversations evolve.",
    color: "bg-primary/10 text-primary",
  },
];

const workflow = [
  {
    number: "01",
    icon: FiGlobe,
    title: "Collect",
    description: "Bring together news from available public sources.",
  },
  {
    number: "02",
    icon: FiFilter,
    title: "Organize",
    description: "Group stories by topic and relevance.",
  },
  {
    number: "03",
    icon: FiCpu,
    title: "Analyze",
    description: "Create summaries and explore useful patterns.",
  },
  {
    number: "04",
    icon: FiSearch,
    title: "Discover",
    description: "Explore stories with more context.",
  },
];

const topics = [
  "Economy",
  "Technology",
  "Public affairs",
  "Environment",
];

function SectionLabel({ children }) {
  return (
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-text-green-light dark:text-text-green-dark">
      {children}
    </p>
  );
}

function ArrowIcon({ className = "" }) {
  return (
    <FiArrowUpRight
      aria-hidden="true"
      className={`transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${className}`}
    />
  );
}

export default function AboutPage() {
  return (
    <main className="container-custom overflow-hidden bg-background text-text-main transition-colors duration-300">
      {/* HERO */}
      <section className="relative isolate">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
        >
          <div className="absolute -right-20 -top-10 size-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-20 size-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          aria-hidden="true"
          className="about-grid-overlay pointer-events-none absolute inset-0 -z-10"
        />

        <div className="container-custom mt-10 grid items-center gap-12 p-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Hero content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-4 py-2.5 backdrop-blur-xl">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/60" />
                <span className="relative size-2.5 rounded-full bg-accent" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-green-light dark:text-text-green-dark sm:text-xs">
                About Lanka News Intelligence
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
              Understand the news.
              <span className="brand-gradient mt-2 block pb-2">
                See the bigger picture.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
              Sri Lanka has stories worth understanding. We bring news from
              multiple sources together and use AI-assisted tools to help you
              explore important topics, discover connections, and understand
              the context behind the headlines.
            </p>

            {/* Hero actions */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/news" className="group inline-flex">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<FiArrowUpRight size={18} />}
                  className="w-full rounded-xl px-6 sm:w-auto"
                >
                  Explore the News
                </Button>
              </Link>

              <Link href="/categories" className="group inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  rightIcon={<FiArrowRight size={17} />}
                  className="w-full rounded-xl border-border px-6 text-text-main sm:w-auto"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Hero highlights */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <FiZap className="text-text-green-light dark:text-text-green-dark" />
                AI-assisted insights
              </span>

              <span className="flex items-center gap-2">
                <FiLayers className="text-text-green-light dark:text-text-green-dark" />
                Multiple news sources
              </span>
            </div>
          </div>

          {/* News Intelligence card */}
          <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-primary/20 via-light-blue/10 to-accent/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface p-5 shadow-2xl shadow-primary/5 backdrop-blur-2xl sm:p-7">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-text-green-light dark:text-text-green-dark">
                    <FiActivity size={21} />
                  </div>

                  <div>
                    <p className="font-bold">News Intelligence</p>
                    <p className="mt-1 text-xs text-text-muted">
                      From headlines to understanding
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-text-green-light dark:text-text-green-dark">
                  AI
                </span>
              </div>

              {/* Card introduction */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                  Explore a story
                </p>

                <h2 className="mt-3 text-xl font-bold leading-snug sm:text-2xl">
                  One headline can lead to a bigger story.
                </h2>

                <p className="mt-3 text-sm leading-7 text-text-muted">
                  Discover related reports, understand key topics, and explore
                  developments from different perspectives.
                </p>
              </div>

              {/* Topics */}
              <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold">
                    Topics to explore
                  </span>
                  <FiLayers className="text-text-muted" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-text-green-light dark:hover:text-text-green-dark"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Context note */}
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-accent/15 bg-accent/5 p-4">
                <div className="mt-0.5 rounded-xl bg-accent/10 p-2 text-text-green-light dark:text-text-green-dark">
                  <FiCpu size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">Context matters</p>
                  <p className="mt-1 text-xs leading-6 text-text-muted">
                    AI can help summarize and organize information. Always
                    refer to the original reporting when verifying facts.
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-5 text-xs text-text-muted">
                <span>Built for curious minds</span>

                <span className="flex items-center gap-1.5">
                  <FiShield className="text-text-green-light dark:text-text-green-dark" />
                  Source-aware
                </span>
              </div>
            </div>

            {/* Floating insight card */}
            <div className="absolute -right-3 top-16 hidden rounded-2xl border border-border bg-surface p-4 shadow-xl sm:block xl:-right-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-light-blue/10 p-3 text-light-blue">
                  <FiTrendingUp size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold">See connections</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Across topics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mt-4 rounded-2xl border-y border-border bg-surface py-10 transition-colors duration-300 sm:py-12">
        <div className="container-custom text-center">
          <SectionLabel>OUR PURPOSE</SectionLabel>

          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            More context.
            <span className="brand-gradient"> Less noise.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-text-muted">
            In a world full of headlines, finding meaningful information can
            take time. Our goal is to make exploring Sri Lankan news simpler by
            bringing stories together and helping readers discover what matters.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-10 sm:py-12">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <SectionLabel>WHAT MAKES US DIFFERENT</SectionLabel>

            <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              News discovery, reimagined.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-text-muted">
            Not just another list of headlines. A more organized way to explore
            stories, perspectives, and emerging topics.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl p-3.5 ${feature.color}`}>
                    <Icon size={23} />
                  </div>

                  <span className="text-sm font-bold text-text-muted/60">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-text-muted">
                  {feature.description}
                </p>

                <Link
                  href="/news"
                  className="group/link mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-light-blue dark:text-text-green-dark"
                >
                  Explore the platform

                  <FiArrowRight className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="pb-8 sm:pb-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-7 transition-colors duration-300 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <SectionLabel>HOW IT WORKS</SectionLabel>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              From information to insight.
            </h2>

            <p className="mt-4 text-sm leading-7 text-text-muted">
              A simple workflow designed to turn a growing stream of news into
              an easier experience for readers.
            </p>
          </div>

          <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  {index !== workflow.length - 1 && (
                    <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-1rem)] bg-gradient-to-r from-accent/60 to-border lg:block" />
                  )}

                  <div className="relative flex size-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-text-green-light dark:text-text-green-dark">
                    <Icon size={21} />
                  </div>

                  <p className="mt-5 text-xs font-bold tracking-widest text-text-green-light dark:text-text-green-dark">
                    STEP {step.number}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-text-muted">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-8 sm:pb-10">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-dark-border bg-dark-background px-7 py-12 text-dark-text-main sm:px-12 sm:py-10 lg:px-16">
          {/* CTA background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-10 -top-10 size-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-primary/20 blur-3xl" />
          </div>

          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full border border-accent/15" />
          <div className="pointer-events-none absolute -right-5 -top-12 -z-10 size-52 rounded-full border border-accent/15" />

          <div className="relative flex flex-col justify-between gap-9 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <SectionLabel>STAY CURIOUS</SectionLabel>

              <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                News moves fast.
                <span className="brand-gradient block">
                  Understanding matters.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-dark-text-muted sm:text-base">
                Discover stories from across Sri Lanka and explore the context
                behind the headlines.
              </p>
            </div>

            <Link
              href="/categories"
              className="group inline-flex self-start lg:self-center"
            >
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowIcon className="text-lg" />}
                className="rounded-xl"
              >
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
