
"use client";

import React from "react";

export default function Header({
  sub = "LANKA NEWS INTELLIGENCE",
  title,
  description,
  children,
  className = "",
  align = "left",
}) {
  const isCentered = align === "center";

  return (
    <header className={`relative w-full ${className}`}>
      <div
        className={`flex flex-col gap-2 ${
          children
            ? "lg:flex-row lg:items-end lg:justify-between"
            : ""
        }`}
      >
        <div
          className={`min-w-0 flex-1 ${
            isCentered ? "text-center" : "text-left"
          }`}
        >
          {sub && (
            <div
              className={`mb-4 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-2 ${
                isCentered ? "mx-auto" : ""
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
                <span className="relative h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-green-light dark:text-text-green-dark sm:text-xs">
                {sub}
              </span>
            </div>
          )}

          {title && (
            <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-text-main dark:text-dark-text-main sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}

          {description && (
            <p
              className={`mt-2 max-w-2xl text-sm leading-7 text-text-muted dark:text-dark-text-muted sm:text-base sm:leading-8 ${
                isCentered ? "mx-auto" : ""
              }`}
            >
              {description}
            </p>
          )}

          <div
            aria-hidden="true"
            className={`mt-2 flex items-center gap-1.5 ${
              isCentered ? "justify-center" : ""
            }`}
          >
            <span className="h-1 w-12 rounded-full bg-primary dark:bg-accent" />
            <span className="h-1 w-4 rounded-full bg-accent/50" />
            <span className="h-1 w-1 rounded-full bg-primary-light/70" />
          </div>
        </div>

        {children && (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
