
"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./ui/Header";
import NewsCard from "./ui/NewsCard";
import {  FaChevronLeft,  FaChevronRight,} from "react-icons/fa";
import Button from "./ui/Button";
const ITEMS_PER_PAGE = 20;

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/news`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        setArticles(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Unable to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [API_BASE_URL]);

  // Sort newest articles first
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = a.published_at
        ? new Date(a.published_at).getTime()
        : 0;
      const dateB = b.published_at
        ? new Date(b.published_at).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [articles]);

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);

  const currentArticles = sortedArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section
      id="News"
      aria-labelledby="News-heading"
      className="relative isolate mt-10 overflow-hidden rounded-3xl border border-border bg-surface px-4 py-4 text-text-main transition-colors duration-300 sm:px-7 sm:py-6 lg:px-10 lg:py-8"
    >
<div className="mt-4 flex flex-col gap-6">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    {/* Section heading */}
    <div className="min-w-0 flex-1">
      <Header
        sub="Stay Informed"
        title="Explore the Latest News"
        description="Discover the latest stories across Sri Lanka and around the world, from politics and business to technology, sports, and more."
      />
    </div>

    {/* Pagination controls */}
    {totalPages > 1 && (
      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <p className="whitespace-nowrap text-xs font-medium tracking-wide text-text-muted">
          Showing{" "}
          <span className="text-lg font-bold text-text-main">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>
          {" - "}
          {Math.min(currentPage * ITEMS_PER_PAGE, sortedArticles.length)}
          {" of "}
          {sortedArticles.length} articles
        </p>

        <div className="flex shrink-0 gap-2">
            <Button
              variant="pagination"
              direction="previous"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
            />

            <Button
              variant="pagination"
              direction="next"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            />
        </div>
      </div>
    )}
  </div>


        {loading && (
          <p className="py-8 text-center text-text-secondary">
            Loading latest news...
          </p>
        )}

        {error && (
          <p className="py-8 text-center text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentArticles.length > 0 ? (
                currentArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))
              ) : (
                <p className="py-8 text-center text-text-secondary">
                  No news articles available.
                </p>
              )}
            </div>

          
          </>
        )}
      </div>
    </section>
  );
}
