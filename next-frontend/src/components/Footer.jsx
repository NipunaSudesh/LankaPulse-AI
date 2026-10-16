"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaArrowUp,
  FaArrowRight,
} from "react-icons/fa";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Categories", href: "/categories" },
  { name: "Latest News", href: "/news" },
  { name: "About Us", href: "/about" },
];

const categories = [
  { name: "Politics", href: "/categories/politics" },
  { name: "Economy", href: "/categories/economy" },
  { name: "Technology", href: "/categories/technology" },
  { name: "Sports", href: "/categories/sports" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    Icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    Icon: FaInstagram,
  },
  {
    name: "GitHub",
    href: "https://github.com/",
    Icon: FaGithub,
  },
];

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-sm text-text-muted transition-colors duration-200 hover:text-primary dark:text-dark-text-muted dark:hover:text-light-blue"
      >
        <span className="h-1 w-1 rounded-full bg-border transition-all duration-200 group-hover:w-2 group-hover:bg-accent dark:bg-dark-border" />
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative mt-24 overflow-hidden border-t border-border bg-surface text-text-main transition-colors duration-300 dark:border-dark-border dark:bg-dark-background dark:text-dark-text-main"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/5 blur-[100px] dark:bg-primary/15" />
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-accent/10 blur-[110px]" />
        <div className="footer-grid-overlay absolute inset-0 opacity-30" />
      </div>

      <div className="container-custom relative">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1fr] lg:gap-10 lg:py-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
              aria-label="LankaPulse AI home"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/15  transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-lg group-hover:shadow-accent/10">
                <Image
                  src="/LP_logo.png"
                  alt="LankaPulse AI"
                  width={42}
                  height={42}
                  className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </span>

              <span className="brand-gradient text-xl font-extrabold tracking-tight sm:text-2xl">
                LankaPulse AI
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-text-muted dark:text-dark-text-muted">
              Sri Lankan news, made easier to understand. Explore stories from
              multiple sources, discover emerging trends, and see the bigger
              picture with AI-powered insights.
            </p>

            {/* Platform highlights */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-text-green-light dark:text-text-green-dark">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                AI-powered insights
              </span>

              <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-muted">
                Sri Lanka focused
              </span>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-text-muted transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/10 hover:text-text-green-light dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-muted dark:hover:text-text-green-dark"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main dark:text-dark-text-main">
              Explore
            </h3>

            <div className="mb-5 mt-3 h-0.5 w-9 rounded-full bg-gradient-to-r from-primary to-accent" />

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <FooterLink key={link.name} href={link.href}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main dark:text-dark-text-main">
              News Categories
            </h3>

            <div className="mb-5 mt-3 h-0.5 w-9 rounded-full bg-gradient-to-r from-primary to-accent" />

            <ul className="space-y-4">
              {categories.map((category) => (
                <FooterLink key={category.name} href={category.href}>
                  {category.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* About / CTA */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main dark:text-dark-text-main">
              Our Mission
            </h3>

            <div className="mb-5 mt-3 h-0.5 w-9 rounded-full bg-gradient-to-r from-primary to-accent" />

            <p className="text-sm leading-7 text-text-muted dark:text-dark-text-muted">
              Less noise. More context. We help readers explore the stories
              shaping Sri Lanka through organized news and intelligent
              analysis.
            </p>

            <Link
              href="/about"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-text-green-light dark:text-light-blue dark:hover:text-text-green-dark"
            >
              Discover our mission
              <FaArrowRight
                size={12}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            {/* Explore CTA */}
            <Link
              href="/news"
              className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-4 transition-all duration-300 hover:border-accent/50 hover:bg-accent/10"
            >
              <div>
                <p className="text-sm font-bold text-text-main dark:text-dark-text-main">
                  Ready to explore?
                </p>
                <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                  Discover the latest stories.
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-transform duration-300 group-hover:scale-105">
                <FaArrowRight size={13} />
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-border py-6 dark:border-dark-border sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs leading-6 text-text-muted dark:text-dark-text-muted">
              © {currentYear}{" "}
              <span className="font-semibold text-text-main dark:text-dark-text-main">
                LankaPulse AI
              </span>
              . All rights reserved.
            </p>

            <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
              Built to make news clearer, smarter, and more accessible.
            </p>
          </div>

          <Link
            href="#top"
            className="group inline-flex w-fit items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-text-main transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/5 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main"
          >
            Back to top

            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white dark:text-light-blue">
              <FaArrowUp size={12} />
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-light-blue to-accent" />
    </footer>
  );
}
