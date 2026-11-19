
"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";

import AlertGraphic from "./AlertGraphic";
import WideGraphic from "./WideGraphic";

import {
  Field,
  Slider,
  Toggle,
  fieldClass,
} from "./DashboardUI";

import {
  TEMPLATES,
  THEMES,
  DEFAULT_IMG,
  FONT_SIZE,
  getSinhalaHeadlineSize,
  clamp,
} from "./graphicStyles";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const CROP = {
  right: 0,
  bottom: 0,
};

/* -------------------------------------------------------
   Responsive graphic preview
------------------------------------------------------- */

function useFitScale(baseWidth) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const element = boxRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / baseWidth);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [baseWidth]);

  return [boxRef, scale];
}

/* -------------------------------------------------------
   Crop and proxy news image
------------------------------------------------------- */

function useCroppedImage(src) {
  const [cropped, setCropped] = useState(null);

  useEffect(() => {
    setCropped(null);

    if (!src) return;

    let cancelled = false;

    const proxied = `/api/image-proxy?url=${encodeURIComponent(src)}`;

    const image = new window.Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      if (cancelled) return;

      try {
        const width = Math.round(
          image.naturalWidth * (1 - CROP.right)
        );

        const height = Math.round(
          image.naturalHeight * (1 - CROP.bottom)
        );

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          setCropped(proxied);
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          width,
          height,
          0,
          0,
          width,
          height
        );

        setCropped(canvas.toDataURL("image/jpeg", 0.95));
      } catch {
        setCropped(proxied);
      }
    };

    image.onerror = () => {
      if (!cancelled) setCropped(proxied);
    };

    image.src = proxied;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return cropped;
}

/* -------------------------------------------------------
   Facebook Dashboard
------------------------------------------------------- */

export default function FacebookDashboard() {
  const graphicRef = useRef(null);
  const dragRef = useRef(null);

  /* ---------------- Article state ---------------- */

  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);

  const [selectedId, setSelectedId] = useState("");
  const [currentDate, setCurrentDate] = useState(null);

  /* ---------------- Editor state ---------------- */

  const [titleSi, setTitleSi] = useState("");
  const [titleEn, setTitleEn] = useState("");

  const [summarySi, setSummarySi] = useState("");
  const [summaryEn, setSummaryEn] = useState("");

  const [caption, setCaption] = useState("");

  /* ---------------- UI state ---------------- */

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------------- Design state ---------------- */

  const [templateKey, setTemplateKey] = useState("alert");
  const [themeKey, setThemeKey] = useState("alert");

  const [img, setImg] = useState(DEFAULT_IMG);

  const [opts, setOpts] = useState({
    sinhalaSize: FONT_SIZE.short,
    showEn: true,
    showDate: true,
    showLogo: true,
  });

  /* ---------------- Derived values ---------------- */

  const tpl = TEMPLATES[templateKey];
  const theme = THEMES[themeKey];

  const [boxRef, scale] = useFitScale(tpl.w);

  const selectedArticle = articles.find(
    (article) => String(article.id) === selectedId
  );

  const croppedPhoto = useCroppedImage(
    selectedArticle?.image_url
  );

  const Graphic =
    templateKey === "alert" ? AlertGraphic : WideGraphic;

  const publicationDate = selectedArticle?.published_at
    ? new Date(selectedArticle.published_at)
    : currentDate;

  const formattedDate = publicationDate
    ? publicationDate.toLocaleDateString("en-CA")
    : "";

  const setOpt = (key) => (value) => {
    setOpts((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* -------------------------------------------------------
     Initial loading
  ------------------------------------------------------- */

  useEffect(() => {
    setCurrentDate(new Date());

    loadArticles();
    loadHistory();
  }, []);

  /* -------------------------------------------------------
     Load selected article into editor
  ------------------------------------------------------- */

  useEffect(() => {
    if (!selectedArticle) {
      setTitleSi("");
      setTitleEn("");
      setSummarySi("");
      setSummaryEn("");
      setCaption("");

      return;
    }

    const headlineSi =
      selectedArticle.title_si ||
      selectedArticle.title ||
      "";

    const headlineEn =
      selectedArticle.title ||
      selectedArticle.title_si ||
      "";

    setTitleSi(headlineSi);
    setTitleEn(headlineEn);

    setSummarySi(
      selectedArticle.summary_si ||
        selectedArticle.content_si ||
        selectedArticle.summary ||
        ""
    );

    setSummaryEn(
      selectedArticle.summary ||
        selectedArticle.content ||
        selectedArticle.summary_si ||
        ""
    );

    // Automatically choose the Sinhala headline size
    // when a new article is selected.
    setOpts((previous) => ({
      ...previous,
      sinhalaSize: getSinhalaHeadlineSize(headlineSi),
    }));

    // Reset photo position for the new article.
    setImg(DEFAULT_IMG);
  }, [selectedId, articles]);

  /* -------------------------------------------------------
     Automatically generate bilingual Facebook caption
  ------------------------------------------------------- */

  useEffect(() => {
    if (!selectedArticle) return;

    setCaption(
      `📰 ${titleSi}

${summarySi}

━━━━━━━━━━━━━━━━━━

📰  ${titleEn}

${summaryEn}

#LankaPulseAI #SriLankaNews #SriLanka #BreakingNews #LatestNews #NewsUpdate #LocalNews #WorldNews #SriLankanNews #NewsToday #CurrentAffairs #StayInformed #NewsIntelligence #DailyNews #SriLankaUpdates #TrustedNews #TrendingNews #SinhalaNews #EnglishNews #LankaNews`
    );
  }, [
    titleSi,
    titleEn,
    summarySi,
    summaryEn,
    selectedArticle,
  ]);

  /* -------------------------------------------------------
     Load news articles
  ------------------------------------------------------- */

  async function loadArticles() {
    try {
      const response = await fetch(
        `${API_URL}/news?per_page=100`
      );

      if (!response.ok) {
        throw new Error("Unable to load news articles.");
      }

      const result = await response.json();

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
            ? result.data.data
            : [];

      setArticles(data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Article loading failed."
      );
    }
  }

  /* -------------------------------------------------------
     Load published Facebook posts
  ------------------------------------------------------- */

  async function loadHistory() {
    try {
      const response = await fetch(
        `${API_URL}/facebook-posts?status=published`
      );

      if (!response.ok) return;

      const result = await response.json();

      const data = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.data)
          ? result.data.data
          : [];

      setPosts(data);
    } catch (error) {
      console.error(
        "Facebook history loading failed:",
        error
      );
    }
  }

  /* -------------------------------------------------------
     Export graphic as PNG
  ------------------------------------------------------- */

  async function exportGraphic() {
    if (!graphicRef.current) {
      throw new Error("Graphic preview is not ready.");
    }

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const images = Array.from(
      graphicRef.current.querySelectorAll("img")
    );

    await Promise.all(
      images.map((image) => {
        if (image.complete && image.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          image.onload = resolve;
          image.onerror = resolve;
        });
      })
    );

    const blob = await toBlob(graphicRef.current, {
      width: tpl.w,
      height: tpl.h,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: "#081326",
    });

    if (!blob) {
      throw new Error("Unable to generate PNG.");
    }

    return blob;
  }

  /* -------------------------------------------------------
     Download PNG
  ------------------------------------------------------- */

  async function downloadGraphic() {
    try {
      setLoading(true);
      setMessage("Generating graphic...");

      const blob = await exportGraphic();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        `lankapulse-${templateKey}-${selectedId}.png`;

      document.body.appendChild(link);

      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setMessage("Graphic downloaded successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Graphic generation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------------------------------
     Copy caption
  ------------------------------------------------------- */

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);

      setMessage("Caption copied.");
    } catch {
      setMessage("Could not copy caption.");
    }
  }

  /* -------------------------------------------------------
     Publish to Facebook
  ------------------------------------------------------- */

  async function publishPost() {
    if (!selectedArticle) {
      setMessage("Please select a news article.");
      return;
    }

    if (selectedArticle.facebook_post_id) {
      setMessage("This article has already been published.");
      return;
    }

    if (!caption.trim()) {
      setMessage("Please enter a Facebook caption.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Generating graphic...");

      const blob = await exportGraphic();

      const formData = new FormData();

      formData.append(
        "article_id",
        String(selectedArticle.id)
      );

      formData.append("message", caption);

      formData.append(
        "image",
        blob,
        "lankapulse-post.png"
      );

      setMessage("Publishing to Facebook...");

      const response = await fetch(
        "/api/facebook/publish",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Facebook publishing failed."
        );
      }

      setMessage(
        `Successfully published! Facebook ID: ${
          result.facebook_post_id || "Published"
        }`
      );

      await Promise.all([
        loadArticles(),
        loadHistory(),
      ]);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Publishing failed."
      );
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------------------------------
     Drag photo positioning
  ------------------------------------------------------- */

  function onPointerDown(event) {
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  }

  function onPointerMove(event) {
    if (!dragRef.current) return;

    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;

    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setImg((previous) => ({
      ...previous,

      x: clamp(
        previous.x -
          (dx / (tpl.w * scale)) * 120,
        0,
        100
      ),

      y: clamp(
        previous.y -
          (dy / (tpl.h * scale)) * 120,
        0,
        100
      ),
    }));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  /* -------------------------------------------------------
     Render dashboard
  ------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <span className="brand-gradient whitespace-nowrap text-xl font-extrabold tracking-tight">
              LankaPulse AI
            </span>

            <h1 className="mt-2 text-3xl font-bold">
              Facebook Publishing Dashboard
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Design bilingual branded news graphics,
              tweak them live, and publish to Facebook.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* =================================================
              EDITOR
          ================================================= */}

          <div className="space-y-5">

            {/* Select article */}
            <Field label="Select News Article">
              <select
                value={selectedId}
                onChange={(event) =>
                  setSelectedId(event.target.value)
                }
                className={fieldClass}
              >
                <option value="">
                  Choose an article
                </option>

                {articles.map((article, index) => (
                  <option
                    key={article.id}
                    value={article.id}
                    disabled={
                      Boolean(article.facebook_post_id) ||
                      article.facebook_publish_status ===
                        "publishing"
                    }
                  >
                    {`Article ${index + 1} | #${article.id} - ${
                      article.title
                    } | ${
                      article.published_at
                        ? article.published_at
                            .replace("T", " ")
                            .replace(/Z$/, "")
                            .slice(0, 16)
                        : "Date unavailable"
                    }${
                      article.facebook_post_id
                        ? " (Published)"
                        : ""
                    }`}
                  </option>
                ))}
              </select>
            </Field>

            {/* Sinhala headline */}
            <Field
              label="Sinhala Headline"
              right={
                <span className="text-xs text-slate-500">
                  {titleSi.length} chars
                </span>
              }
            >
              <textarea
                value={titleSi}
                onChange={(event) =>
                  setTitleSi(event.target.value)
                }
                rows={3}
                className={fieldClass}
              />
            </Field>

            {/* English headline */}
            <Field
              label="English Headline"
              right={
                <span className="text-xs text-slate-500">
                  {titleEn.length} chars
                </span>
              }
            >
              <textarea
                value={titleEn}
                onChange={(event) =>
                  setTitleEn(event.target.value)
                }
                rows={2}
                className={fieldClass}
              />
            </Field>

            {/* Sinhala summary */}
            <Field label="Sinhala Summary">
              <textarea
                value={summarySi}
                onChange={(event) =>
                  setSummarySi(event.target.value)
                }
                rows={4}
                className={fieldClass}
              />
            </Field>

            {/* English summary */}
            <Field label="English Summary">
              <textarea
                value={summaryEn}
                onChange={(event) =>
                  setSummaryEn(event.target.value)
                }
                rows={4}
                className={fieldClass}
              />
            </Field>

            {/* Facebook caption */}
            <Field
              label="Facebook Caption"
              right={
                <button
                  type="button"
                  onClick={copyCaption}
                  className="text-xs text-cyan-700 hover:underline dark:text-light-cyan"
                >
                  Copy
                </button>
              }
            >
              <textarea
                value={caption}
                onChange={(event) =>
                  setCaption(event.target.value)
                }
                rows={9}
                className={fieldClass}
              />
            </Field>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadGraphic}
                disabled={loading || !selectedArticle}
                className="rounded-lg bg-slate-200 px-5 py-3 text-slate-800 transition hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Download PNG
              </button>

              <button
                type="button"
                onClick={publishPost}
                disabled={
                  loading ||
                  !selectedArticle ||
                  Boolean(selectedArticle?.facebook_post_id)
                }
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : "Publish to Facebook"}
              </button>
            </div>

            {/* Status message */}
            {message && (
              <p className="break-words text-sm text-sky-700 dark:text-sky-300">
                {message}
              </p>
            )}
          </div>

          {/* =================================================
              GRAPHIC STUDIO
          ================================================= */}

          <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">
                Graphic Studio
              </h2>

              <span className="text-xs text-slate-500">
                {tpl.w} × {tpl.h}px · {tpl.hint}
              </span>
            </div>

            {/* Template selection */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-dark-border dark:bg-dark-surface">
              {Object.entries(TEMPLATES).map(
                ([key, template]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setTemplateKey(key)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      templateKey === key
                        ? "bg-gradient-to-r from-primary to-light-blue text-white shadow"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {template.label}
                  </button>
                )
              )}
            </div>

            {/* Live preview */}
            <div
              className={`mx-auto w-full ${
                templateKey === "alert"
                  ? "max-w-[460px]"
                  : ""
              }`}
            >
              <div
                ref={boxRef}
                className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-2xl shadow-black/20 dark:border-dark-border dark:shadow-black/50"
                style={{
                  height: tpl.h * scale,
                }}
              >
                <div
                  style={{
                    width: tpl.w,
                    height: tpl.h,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <Graphic
                    graphicRef={graphicRef}
                    photo={croppedPhoto}
                    img={img}
                    theme={theme}
                    titleSi={titleSi}
                    titleEn={titleEn}
                    date={formattedDate}
                    opts={opts}
                  />
                </div>

                {/* Drag layer */}
                <div
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
                  title="Drag to reposition the photo"
                />
              </div>

              <p className="mt-2 text-center text-xs text-slate-500">
                Drag the preview to reposition the photo
              </p>
            </div>

            {/* =================================================
                DESIGN CONTROLS
            ================================================= */}

            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card/60">

              {/* Theme selection */}
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Theme
                </p>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(THEMES).map(
                    ([key, item]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setThemeKey(key)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                          themeKey === key
                            ? "border-slate-900 text-slate-900 dark:border-white/70 dark:text-white"
                            : "border-slate-300 text-slate-500 hover:text-slate-900 dark:border-dark-border dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${item.from}, ${item.chip})`,
                          }}
                        />

                        {item.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Slider
                  label="Photo zoom"
                  value={img.zoom}
                  min={1}
                  max={2.5}
                  step={0.05}
                  suffix="×"
                  onChange={(zoom) =>
                    setImg((previous) => ({
                      ...previous,
                      zoom,
                    }))
                  }
                />

                <Slider
                  label="Sinhala headline size"
                  value={opts.sinhalaSize}
                  min={FONT_SIZE.min}
                  max={FONT_SIZE.max}
                  suffix="px"
                  onChange={setOpt("sinhalaSize")}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <Toggle
                  label="English headline"
                  checked={opts.showEn}
                  onChange={setOpt("showEn")}
                />

                <Toggle
                  label="Date badge"
                  checked={opts.showDate}
                  onChange={setOpt("showDate")}
                />

                <button
                  type="button"
                  onClick={() => setImg(DEFAULT_IMG)}
                  className="ml-auto text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Reset photo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            PUBLISHED FACEBOOK POSTS
        ================================================= */}

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Published Facebook Posts
          </h2>

          {posts.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">
              No published Facebook posts found.
            </p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-cyan-600/50 dark:border-dark-border dark:bg-dark-surface dark:hover:border-light-cyan/40"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {post.news_article?.title ||
                          "News article"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {post.published_at
                          ? new Date(
                              post.published_at
                            ).toLocaleString()
                          : "Publication date unavailable"}
                      </p>
                    </div>

                    <span className="text-sm text-green-600 dark:text-green-400">
                      {post.status}
                    </span>
                  </div>

                  {post.post_url && (
                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                    >
                      View Facebook post
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
