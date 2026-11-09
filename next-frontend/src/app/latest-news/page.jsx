
"use client";

import React, { useEffect, useState } from "react";
import { fetchNews as getNews } from "@/lib/api";
import Header from "@/components/ui/Header";
import NewsCard from "@/components/ui/NewsCard";
import Button from "@/components/ui/Button";

const ITEMS_PER_PAGE = 12;
const HOURS_LIMIT = 24;

export default function LatestNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Fetch news from API
  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const data = await getNews();

        const newsArray = Array.isArray(data)
          ? data
          : data?.data || [];

        setArticles(newsArray);

        console.log("Fetched articles:", newsArray);
      } catch (error) {
        console.error("Unable to load news:", error);
        setError("Unable to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  // Filter articles published within the last 36 hours
  useEffect(() => {
    const now = Date.now();

    const filtered = articles.filter((article) => {
      if (!article.published_at) return false;

      const publishedTime = new Date(
        article.published_at
      ).getTime();

      if (Number.isNaN(publishedTime)) return false;

      const difference = now - publishedTime;
      const hoursDifference =
        difference / (1000 * 60 * 60);

      return (
        hoursDifference >= 0 &&
        hoursDifference <= HOURS_LIMIT
      );
    });

    // Sort latest articles first
    filtered.sort(
      (a, b) =>
        new Date(b.published_at).getTime() -
        new Date(a.published_at).getTime()
    );

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredArticles.length / ITEMS_PER_PAGE
  );

  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container-custom mt-10 flex flex-col">

      {/* Page Header */}
      <Header
        sub="LANKA NEWS INTELLIGENCE"
        title="Latest News"
        description="Stay up to date with the latest stories, breaking news, and important developments from Sri Lanka and around the world. Get timely updates and discover the stories that matter most."
      />

      {/* Loading */}
      {loading && (
        <p className="py-8 text-center text-text-secondary">
          Loading latest news...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="py-8 text-center text-red-500">
          {error}
        </p>
      )}

      {/* News Articles */}
      {!loading && !error && (
        <>
          {filteredArticles.length > 0 ? (
            <>
              {/* Pagination Information */}
              <div className="mb-6 flex items-center justify-end gap-4">

                <p className="text-xs font-medium tracking-wide text-text-muted">
                  Showing{" "}
                  <span className="text-lg font-bold text-text-main">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>
                  {" - "}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredArticles.length
                  )}
                  {" of "}
                  {filteredArticles.length} articles

                  <span className="ml-2 text-text-secondary">
                    (Last 24 hours)
                  </span>
                </p>

                {totalPages > 1 && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="pagination"
                      direction="previous"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.max(1, page - 1)
                        )
                      }
                      disabled={currentPage === 1}
                    />

                    <Button
                      variant="pagination"
                      direction="next"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                    />
                  </div>
                )}
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-text-secondary">
              No news articles available within the last 36 hours.
            </p>
          )}
        </>
      )}
    </div>
  );
}
