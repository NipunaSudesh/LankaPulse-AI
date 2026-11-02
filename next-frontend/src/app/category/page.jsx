"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import NewsCard from "@/components/ui/NewsCard";

const ITEMS_PER_PAGE = 20;

const categoryContent = {
  Technology: {
    sub: "Explore Technology",
    title: "Discover the World of Technology",
    description:
      "Stay updated with the latest technology news, AI innovations, software developments, cybersecurity, and digital trends shaping Sri Lanka and the world.",
  },
  Politics: {
    sub: "Explore Politics",
    title: "Stay Informed on Politics",
    description:
      "Follow the latest political news, government decisions, elections, and policy developments shaping Sri Lanka and the world.",
  },
  Economy: {
    sub: "Explore the Economy",
    title: "Understand the Economy",
    description:
      "Discover the latest economic news, market trends, business developments, inflation updates, and financial insights from Sri Lanka and beyond.",
  },
  Sports: {
    sub: "Explore Sports",
    title: "Stay Ahead in Sports",
    description:
      "Catch up on the latest sports news, match results, tournaments, player performances, and sporting highlights from Sri Lanka and around the world.",
  },
  Crime: {
    sub: "Explore Crime News",
    title: "Stay Updated on Crime and Safety",
    description:
      "Follow the latest crime reports, investigations, law enforcement updates, and public safety developments across Sri Lanka and beyond.",
  },
  Health: {
    sub: "Explore Health",
    title: "Your Guide to Health News",
    description:
      "Discover health updates, medical breakthroughs, public health developments, and wellness news from Sri Lanka and around the world.",
  },
};

function CategoryNews() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name")?.trim() || "Technology";
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortedArticles, setSortedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const content = categoryContent[categoryName] || {
    sub: `Explore ${categoryName}`,
    title: `Latest ${categoryName} News`,
    description: `Discover the latest ${categoryName.toLowerCase()} news and developments from Sri Lanka and around the world.`,
  };

  const fetchCategoryNews = async (signal) => {
    try {
      if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
      }

      const res = await fetch(
        `${API_BASE_URL}/news?category=${encodeURIComponent(categoryName)}`,
        { signal }
      );

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const result = await res.json();
      const articles = Array.isArray(result.data) ? result.data : [];

      setSortedArticles(articles);
      setCurrentPage(1);
      setError("");

      console.log("Category news:", articles);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch category news:", err);
        setError("Unable to load news. Please try again later.");
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchCategoryNews(controller.signal);

    return () => controller.abort();
  }, [API_BASE_URL, categoryName]);

  const totalPages = Math.ceil(
    sortedArticles.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedArticles = sortedArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="container-custom mt-10 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <Header
            sub={content.sub}
            title={content.title}
            description={content.description}
          />
        </div>

        {totalPages > 0 && !loading && !error && (
          <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
            <p className="whitespace-nowrap text-xs font-medium tracking-wide text-text-muted">
              Showing{" "}
              <span className="text-lg font-bold text-text-main">
                {startIndex + 1}
              </span>
              {" - "}
              {Math.min(
                startIndex + ITEMS_PER_PAGE,
                sortedArticles.length
              )}
              {" of "}
              {sortedArticles.length} articles
            </p>

            {totalPages > 1 && (
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
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {loading && (
        <p className="py-12 text-center text-text-muted">
          Loading {categoryName.toLowerCase()} news...
        </p>
      )}

      {!loading && error && (
        <p className="py-12 text-center text-red-500">{error}</p>
      )}

      {!loading && !error && sortedArticles.length === 0 && (
        <p className="py-12 text-center text-text-muted">
          No {categoryName.toLowerCase()} news articles found.
        </p>
      )}

          {!loading && !error && paginatedArticles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paginatedArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-text-muted">
          Loading category news...
        </p>
      }
    >
      <CategoryNews />
    </Suspense>
  );
}
