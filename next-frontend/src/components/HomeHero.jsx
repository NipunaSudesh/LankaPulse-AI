
import React from "react";

export default function HomeHero({
  label = "LANKA NEWS INTELLIGENCE",
  title = "Stay Informed.",
  highlight = "Think Smarter.",
  description = "Discover Sri Lankan news from multiple sources in one place. Let AI categorize stories, uncover important trends, and deliver concise insights on the events shaping our country.",
}) {
  return (
    <section>
      <div className="mt-10 ">
        <p className="font-medium text-text-green-light dark:text-text-green-dark">
          {label}
        </p>

        <h1 className="mt-1 text-4xl font-bold md:text-5xl">
          {title}
          <span className="brand-gradient">
            {" "}{highlight}
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </section>
  );
}
