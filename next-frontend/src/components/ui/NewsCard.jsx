
"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  FiArrowUpRight,
  FiClock,
  FiGlobe,
  FiZap,
} from "react-icons/fi";

export default function NewsCard({ article }) {
  const [imageError, setImageError] = useState(false);

  if (!article) return null;

  const {
    title,
    summary,
    image_url,
    category,
    source_name,
    published_at,
    url,
  } = article;

  const categoryName = category || "General";

  const publisher =
    source_name && source_name.toLowerCase() !== "lk"
      ? source_name
      : "Sri Lankan News";

  const formattedDate = published_at
    ? new Date(published_at).toLocaleDateString("en-LK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Latest";

  const description = summary
    ? summary
        .replace(/\s+/g, " ")
        .replace(/\s*\*The post .+? appeared first on .+\.?$/i, "")
        .trim()
    : "Discover the latest developments and updates from Sri Lanka.";

  const imageSrc =
    !imageError && image_url ? image_url : "/LP_logo.png";

  return (
    <article className="group flex min-h-48 overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20">
      {/* Left: Image */}
      <a
        href={url || undefined}
        target={url ? "_blank" : undefined}
        rel={url ? "noopener noreferrer" : undefined}
        aria-label={title ? `Read ${title}` : "Read news article"}
        className="relative min-h-48 w-[38%] shrink-0 overflow-hidden bg-slate-100 sm:w-[32%] lg:w-[28%] dark:bg-slate-800"
      >
        <Image
          src={imageSrc}
          alt={title || "News article image"}
          fill
          sizes="(max-width: 640px) 38vw, 280px"
          onError={() => setImageError(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        <span className="absolute left-2 top-2 max-w-[90%] truncate rounded-md border border-white/20 bg-black/40 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md sm:left-3 sm:top-3 sm:text-[10px]">
          {categoryName}
        </span>

        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1.5 text-[9px] font-semibold text-white backdrop-blur-md sm:bottom-3 sm:left-3 sm:text-[10px]">
          <FiZap className="text-cyan-300" size={12} />
          LankaPulse AI
        </span>
      </a>

      {/* Right: News content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-5 lg:p-6">
        {/* Source and date */}
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 sm:text-xs dark:text-slate-400">
          <span className="flex min-w-0 items-center gap-1.5 font-semibold text-cyan-700 dark:text-cyan-400">
            <FiGlobe size={13} className="shrink-0" />
            <span className="truncate">{publisher}</span>
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

          <span className="flex items-center gap-1 whitespace-nowrap">
            <FiClock size={12} />
            {formattedDate}
          </span>
        </div>

        {/* Headline */}
        <h2 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-cyan-700 sm:text-lg lg:text-xl dark:text-white dark:group-hover:text-cyan-400">
          {title || "Untitled news article"}
        </h2>

        {/* Summary */}
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6 dark:text-slate-400">
          {description}
        </p>

        {/* Read more */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 self-start text-xs font-bold text-cyan-700 transition-all hover:gap-2.5 sm:mt-4 sm:text-sm dark:text-cyan-400"
          >
            Read full story
            <FiArrowUpRight size={16} />
          </a>
        )}
      </div>
    </article>
  );
}
