
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiExternalLink,
  FiClock,
  FiGlobe,
  FiZap,
} from "react-icons/fi";

export default function ArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [article, setArticle] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const savedArticle = sessionStorage.getItem("selectedArticle");

    if (!savedArticle) return;

    try {
      const parsed = JSON.parse(savedArticle);

      if (String(parsed.id) === String(id)) {
        setArticle(parsed);
      }
    } catch {
      sessionStorage.removeItem("selectedArticle");
    }
  }, [id]);

  if (!article) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="max-w-md text-center">
          <FiZap className="mx-auto text-4xl text-cyan-500" />

          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Article not available
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Please return to the news feed and select an article.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700"
          >
            <FiArrowLeft className="mr-2 inline" />
            Back to news
          </button>
        </div>
      </main>
    );
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-LK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recently published";

  const publisher =
    article.source_name?.toLowerCase() === "lk" || !article.source_name
      ? "Sri Lankan News"
      : article.source_name;

  return (
    <main className="min-h-screen bg-slate-50 pb-10 dark:bg-slate-950">
      {/* Article */}
      <article className="container-custom mt-10">
        {/* Breadcrumb */}
        <nav className=" text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="transition hover:text-cyan-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cyan-600">
            {article.category || "General"}
          </span>
        </nav>

        {/* Headline */}
        <div className="mb-2 max-w-4xl">


          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl">
            {article.title || "Untitled news article"}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <FiGlobe className="text-cyan-600" size={16} />
              {publisher}
            </span>

            <span className="flex items-center gap-2">
              <FiClock className="text-cyan-600" size={16} />
              {publishedDate}
            </span>
          </div>
        </div>

        {/* Responsive content layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          {/* Main article column */}
          <div className="min-w-0 ">
            {/* Cover image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
                
 <span className="absolute left-2 top-2 z-10 max-w-[90%] truncate rounded-md border border-white/20 bg-black/40 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md sm:left-3 sm:top-3 sm:text-[10px]">
          {article.category || "General"}
        </span>

        <span className="absolute bottom-2 left-2  z-10 inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1.5 text-[9px] font-semibold text-white backdrop-blur-md sm:bottom-3 sm:left-3 sm:text-[10px]">
          <FiZap className="text-cyan-300" size={12} />
          LankaPulse AI
        </span>
        

              <Image
                src={
                  !imageError && article.image_url
                    ? article.image_url
                    : "/LP_logo.png"
                }
                alt={article.title || "News article image"}
                fill
                unoptimized
                onError={() => setImageError(true)}
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>

                            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-cyan-100 p-3 dark:bg-cyan-950">
                  <FiZap className="text-xl text-cyan-600 dark:text-cyan-400" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Inside the Story
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
The full story, key developments, and important details behind the headline.
                  </p>
                </div>
              </div>

              <div className="whitespace-pre-line text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg">
                {article.content ||
                  "A summary is not currently available for this article."}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-600">
                <FiZap size={18} />
                About LankaPulse AI
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Your destination for discovering Sri Lankan news across
                business, politics, technology, and public affairs.
              </p>

              <Link
                href="/about-us"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-500"
              >
                About our platform
                <FiArrowLeft className="rotate-180" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Article details
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Category
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {article.category || "General"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Publisher
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {publisher}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Published
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {publishedDate}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <FiArrowLeft />
              Explore more news
            </Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
