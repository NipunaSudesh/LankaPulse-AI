
"use client";

import React from "react";
import Link from "next/link";
import {
  FiArrowUpRight,  FiGlobe,  FiCpu,  FiTrendingUp,  FiSearch,  FiFilter,  FiArrowRight,} from "react-icons/fi";
import Button from "@/components/ui/Button";
import HeroCard from "@/components/HomeHero";
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
         <HeroCard
           label="About Lanka News Intelligence"
           title="Understand the news."
           highlight="See the bigger picture."
           description="      Sri Lanka has stories worth understanding. We bring news from
              multiple sources together and use AI-assisted tools to help you
              explore important topics, discover connections, and understand
              the context behind the headlines."
        />
    

      {/* MISSION */}
      <section className="mt-10 rounded-2xl border-y border-border bg-surface py-10 transition-colors duration-300 sm:py-12">
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
