
import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaArrowUp,
} from "react-icons/fa";
import Image from "next/image";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Categories", href: "/categories" },
  { name: "Latest News", href: "/news" },
];

const categories = [
  { name: "Politics", href: "/categories/politics" },
  { name: "Economy", href: "/categories/economy" },
  { name: "Technology", href: "/categories/technology" },
  { name: "Sports", href: "/categories/sports" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto container-custom">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
        <Link href="/" className="group shrink-0 flex justify-start items-center ">
                <Image
          src="/LP_logo.png"
          alt="LankaPulse AI logo"
          width={60}
          height={40}
          priority
        />
          <span className=" brand-gradient text-xl font-extrabold tracking-tight transition-all duration-300 group-hover:drop-shadow-[0_0_16px_rgba(0,255,255,0.5)]">
            LankaPulse AI
          </span>
        </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">
              Stay informed with Sri Lankan news from multiple sources.
              Discover important stories, explore trends, and understand
              the events shaping our world.
            </p>

            <div className="mt-5 flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300"
              >
                <FaFacebookF size={14} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300"
              >
                <FaInstagram size={15} />
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300"
              >
                <FaGithub size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Categories
            </h3>

            <ul className="mt-4 space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              About Us
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Making news easier to explore with organized stories and
              AI-powered insights.
            </p>

            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-text-green-light transition hover:opacity-80 dark:text-text-green-dark"
            >
              Learn More
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Lanka News Intelligence.
            All rights reserved.
          </p>

          <Link
            href="#top"
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-400"
          >
            Back to top
            <FaArrowUp size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
