
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import {
  FiSun,  FiMoon,  FiSearch, FiMenu, FiX,  FiShield,} from 'react-icons/fi';

const LINKS = [
  { href: '/', label: 'Latest News' },
  { href: '/categories', label: 'Categories' },
  { href: '/trending', label: 'Trending' },
  { href: '/sources', label: 'Sources' },
];

export default function Navbar() {
const pathname = usePathname();
const { resolvedTheme, setTheme } = useTheme();

const [mounted, setMounted] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
const [search, setSearch] = useState('');

useEffect(() => {
  setMounted(true);
}, []);

const toggleTheme = () => {
  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
};


  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
      setMenuOpen(false);
    }
  };

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className=" sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-xl dark:border-dark-border dark:bg-dark-background/95">
      <div className="container-custom flex h-16 items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/" className="group shrink-0">
          <span className="brand-gradient text-xl font-extrabold tracking-tight transition-all duration-300 group-hover:drop-shadow-[0_0_16px_rgba(0,255,255,0.5)]">
            LankaPulse AI
          </span>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 justify-center px-4 md:flex"
        >
          <div className="relative w-full max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news, topics, people..."
              aria-label="Search news"
              className="h-9 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-text-main outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main dark:placeholder:text-dark-text-muted dark:focus:border-primary-light"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 lg:flex"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-primary dark:text-primary-light'
                  : 'text-text-muted hover:text-primary dark:text-dark-text-muted dark:hover:text-accent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-all duration-200 hover:border-accent hover:bg-accent hover:text-dark-background dark:border-dark-border dark:bg-dark-surface dark:text-primary-light"
          >
            {mounted ? (
              resolvedTheme === 'dark' ? (
                <FiSun size={18} />
              ) : (
                <FiMoon size={18} />
              )
            ) : (
              <span className="h-[18px] w-[18px]" />
            )}
          </button>

          {/* Admin Dashboard */}
          <Link
            href="/admin"
            aria-label="Admin dashboard"
            title="Admin dashboard"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-all duration-200 hover:border-accent hover:bg-accent hover:text-dark-background dark:border-dark-border dark:bg-dark-surface dark:text-primary-light sm:flex"
          >
            <FiShield size={18} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-all duration-200 hover:border-accent hover:bg-accent hover:text-dark-background dark:border-dark-border dark:bg-dark-surface dark:text-primary-light lg:hidden"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-surface px-4 pb-4 pt-3 dark:border-dark-border dark:bg-dark-background lg:hidden">

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-3">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news, topics, people..."
              aria-label="Search news"
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-text-main outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-main"
            />
          </form>

          {/* Mobile Navigation */}
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light'
                    : 'text-text-muted hover:bg-accent/10 hover:text-primary dark:text-dark-text-muted dark:hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-text-muted hover:bg-accent/10 hover:text-primary dark:text-dark-text-muted dark:hover:text-accent"
            >
              <FiShield size={16} />
              Admin Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
