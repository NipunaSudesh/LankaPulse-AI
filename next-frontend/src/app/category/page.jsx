"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Button from "@/components/ui/Button";

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

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Replace this with your fetched articles.
  const sortedArticles = [];

  const totalPages = Math.ceil(
    sortedArticles.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedArticles = sortedArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <Header
            sub={categoryContent.sub}
            title={categoryContent.title}
            description={categoryContent.description}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
            <p className="whitespace-nowrap text-xs font-medium tracking-wide text-text-muted">
              Showing{" "}
              <span className="text-lg font-bold text-text-main">
                {startIndex + 1}
              </span>
              {" - "}
              {Math.min(startIndex + ITEMS_PER_PAGE, sortedArticles.length)}
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

      {/* Render paginatedArticles here using your NewsCard component. */}
    </div>
  );
}