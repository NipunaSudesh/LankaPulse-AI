"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  FiSun,
  FiMoon,
  FiSearch,
  FiMenu,
  FiX,
  FiShield,
  FiArrowUpRight,
  FiActivity,
} from "react-icons/fi";

const LINKS = [
  { href: "/", label: "Home", number: "01" },
  { href: "/categories", label: "Categories", number: "02" },
  { href: "/latest-news", label: "Latest News", number: "03" },
  { href: "/about-us", label: "About Us", number: "04" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, searchOpen]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    setMenuOpen(false);
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const toggleTheme = () => {
    if (!mounted) return;

    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const openMobileSearch = () => {
    setMenuOpen(false);
    setSearchOpen((open) => !open);
  };

  const openMobileMenu = () => {
    setSearchOpen(false);
    setMenuOpen((open) => !open);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Ambient top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

      <div className="border-b border-border/70 bg-background/85 shadow-lg shadow-black/[0.025] backdrop-blur-2xl dark:border-dark-border/70 dark:bg-dark-background/85">
        <div className="container-custom">
          <div className="flex min-h-[76px] items-center justify-between gap-2 sm:gap-4">

            {/* Brand */}
            <Link
              href="/"
              aria-label="LankaPulse AI home"
              className="group flex shrink-0 items-center gap-2 sm:gap-2.5"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-blue-600/40 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />

                <div className="relative overflow-hidden rounded-xl border border-primary/15 bg-surface p-1 shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:border-cyan-400/60 dark:border-light-cyan dark:bg-dark-surface">
                  <Image
                    src="/LP_logo.png"
                    alt="LankaPulse AI"
                    width={44}
                    height={44}
                    priority
                    className="h-9 w-9 rounded-lg object-contain min-[401px]:h-10 min-[401px]:w-10 sm:h-11 sm:w-11"
                  />
                </div>
              </div>

              <div className="hidden min-[401px]:block">
                <span className="brand-gradient whitespace-nowrap text-base font-extrabold tracking-tight transition-all duration-300 group-hover:drop-shadow-[0_0_16px_rgba(0,255,255,0.5)] sm:text-xl">
                  LankaPulse AI
                </span>
              </div>
            </Link>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="hidden min-w-0 max-w-[360px] flex-1 md:block lg:mx-5"
            >
              <div className="group relative">
                <FiSearch
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-cyan-500 dark:text-dark-text-muted"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search stories, topics, people..."
                  aria-label="Search news"
                  className="h-11 w-full rounded-2xl border border-border/80 bg-surface/70 pl-10 pr-16 text-sm text-text-main outline-none transition-all duration-300 placeholder:text-text-muted/80 hover:border-primary/30 focus:border-cyan-500/70 focus:bg-background focus:ring-4 focus:ring-cyan-500/10 dark:border-dark-border dark:bg-dark-surface/70 dark:text-dark-text-main dark:placeholder:text-dark-text-muted dark:focus:bg-dark-background"
                />

                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border px-1.5 py-1 text-[10px] text-text-muted dark:border-dark-border dark:text-dark-text-muted">
                  Enter
                </kbd>
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-1 xl:flex"
            >
              {LINKS.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                      active
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                        : "text-text-muted hover:bg-surface hover:text-text-main dark:text-dark-text-muted dark:hover:bg-dark-surface dark:hover:text-dark-text-main"
                    }`}
                  >
                    {link.label}

                    {active && (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex shrink-0 items-center gap-1.5 min-[401px]:gap-2">

              {/* Mobile Search Icon - separate from menu */}
              <button
                type="button"
                onClick={openMobileSearch}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-main transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-500 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main min-[401px]:h-10 min-[401px]:w-10 md:hidden"
              >
                {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                disabled={!mounted}
                aria-label={
                  mounted && resolvedTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-main transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-600 disabled:cursor-default dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main dark:hover:text-cyan-300 min-[401px]:h-10 min-[401px]:w-10"
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <FiSun
                      size={18}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  ) : (
                    <FiMoon
                      size={18}
                      className="transition-transform duration-300 group-hover:-rotate-12"
                    />
                  )
                ) : (
                  <span className="h-[18px] w-[18px]" />
                )}
              </button>

              {/* Admin Shortcut */}
              <Link
                href="/admin"
                aria-label="Admin dashboard"
                title="Admin dashboard"
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-600 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-muted dark:hover:text-cyan-300 sm:flex"
              >
                <FiShield size={18} />
              </Link>

              {/* Mobile Menu Icon - separate from search */}
              <button
                type="button"
                onClick={openMobileMenu}
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-main transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-500 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main min-[401px]:h-10 min-[401px]:w-10 lg:hidden"
              >
                {menuOpen ? <FiX size={19} /> : <FiMenu size={19} />}
              </button>
            </div>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden items-center gap-2 pb-3 lg:flex xl:hidden">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  isActive(link.href)
                    ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                    : "text-text-muted hover:bg-surface dark:text-dark-text-muted dark:hover:bg-dark-surface"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Search Panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background/95 shadow-xl backdrop-blur-2xl dark:border-dark-border dark:bg-dark-background/95 md:hidden">
          <div className="container-custom px-4 py-4">
            <form
              onSubmit={handleSearch}
              role="search"
              className="relative"
            >
              <FiSearch
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search news, topics, people..."
                aria-label="Search news"
                autoFocus
                className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-12 text-sm text-text-main outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main"
              />

              <button
                type="submit"
                disabled={!search.trim()}
                aria-label="Submit search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-cyan-500 text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiArrowUpRight size={17} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile / Tablet Navigation Panel */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background/95 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-dark-border dark:bg-dark-background/95 lg:hidden">
          <div className="container-custom px-4 py-5 sm:px-6">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-text-main dark:text-dark-text-main">
                  Explore LankaPulse
                </p>

                <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                  Your smarter view of the news.
                </p>
              </div>

              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <FiActivity size={12} />
                AI INSIGHTS
              </span>
            </div>

            {/* Navigation Links */}
            <nav
              aria-label="Mobile navigation"
              className="grid gap-2 sm:grid-cols-2"
            >
              {LINKS.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                      active
                        ? "border-cyan-500/30 bg-cyan-500/5"
                        : "border-border/70 hover:border-cyan-500/30 hover:bg-surface dark:border-dark-border/70 dark:hover:bg-dark-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-[10px] ${
                          active
                            ? "text-cyan-600 dark:text-cyan-300"
                            : "text-text-muted dark:text-dark-text-muted"
                        }`}
                      >
                        {link.number}
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          active
                            ? "text-cyan-600 dark:text-cyan-300"
                            : "text-text-main dark:text-dark-text-main"
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>

                    <FiArrowUpRight
                      size={16}
                      className={`transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                        active
                          ? "text-cyan-500"
                          : "text-text-muted dark:text-dark-text-muted"
                      }`}
                    />
                  </Link>
                );
              })}

              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3.5 transition hover:border-cyan-500/30 hover:bg-surface dark:border-dark-border/70 dark:hover:bg-dark-surface sm:col-span-2"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-text-main dark:text-dark-text-main">
                  <FiShield size={16} className="text-cyan-500" />
                  Admin Dashboard
                </span>

                <FiArrowUpRight
                  size={16}
                  className="text-text-muted dark:text-dark-text-muted"
                />
              </Link>
            </nav>

            {/* Footer Actions */}
            <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/70 pt-4 dark:border-dark-border/70">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted dark:text-dark-text-muted">
                LankaPulse AI · Sri Lanka
              </span>

              <button
                type="button"
                onClick={toggleTheme}
                disabled={!mounted}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-text-muted transition hover:bg-surface hover:text-cyan-600 dark:text-dark-text-muted dark:hover:bg-dark-surface dark:hover:text-cyan-300"
              >
                {mounted && resolvedTheme === "dark" ? (
                  <>
                    <FiSun size={15} />
                    Light mode
                  </>
                ) : (
                  <>
                    <FiMoon size={15} />
                    Dark mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
      )}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-light-blue to-accent" />
    </header>
    
  );
}