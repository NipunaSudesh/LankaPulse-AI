"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toBlob } from "html-to-image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const SITE_URL = "www.lankapulse.ai"; 
/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const TEMPLATES = {
  alert: { label: "Alert Poster", hint: "4:5 · Feed post", w: 1080, h: 1350 },
  wide: { label: "Wide Card", hint: "1.91:1 · Link card", w: 1200, h: 630 },
};

const THEMES = {
  alert: { label: "Alert Red", from: "#e11d2e", to: "#6b0812", chip: "#facc15" },
  pulse: { label: "Pulse Blue", from: "#0000e6", to: "#020a5c", chip: "#00ffff" },
  emerald: { label: "Emerald", from: "#00b894", to: "#013d33", chip: "#00ff9d" },
};

const DEFAULT_IMG = { zoom: 1, x: 50, y: 50 };

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

// Scales a fixed-size graphic to fit its container width.
function useFitScale(baseWidth) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / baseWidth)
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  return [boxRef, scale];
}

// Fetches the image via the proxy, crops 20% off the right and bottom,
// and returns the cropped image as a data URL.
const CROP = { right: 0.1, bottom: 0.2 };

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
        const cw = Math.round(image.naturalWidth * (1 - CROP.right));
        const ch = Math.round(image.naturalHeight * (1 - CROP.bottom));

        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        canvas.getContext("2d").drawImage(image, 0, 0, cw, ch, 0, 0, cw, ch);

        setCropped(canvas.toDataURL("image/jpeg", 0.95));
      } catch {
        setCropped(proxied); // fallback: uncropped
      }
    };
    image.onerror = () => !cancelled && setCropped(proxied);
    image.src = proxied;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return cropped;
}

/* ------------------------------------------------------------------ */
/* Graphics (rendered at full size, then scaled for preview)           */
/* ------------------------------------------------------------------ */

function NewsPhoto({ src, img, style }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      draggable={false}
className="absolute inset-0 h-full w-full select-none object-contain"
      style={{
        objectPosition: `${img.x}% ${img.y}%`,
        transform: `scale(${img.zoom})`,
        transformOrigin: `${img.x}% ${img.y}%`,
        ...style,
      }}
    />
  );
}

function Logo({ size }) {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-blue-600/40 blur-md" />
      <div className="relative overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-900 p-1 shadow-lg">
        <Image
          src="/LP_logo.png"
          alt="LankaPulse AI"
          width={size}
          height={size}
          priority
          unoptimized
          className="rounded-lg object-contain"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  );
}

const sinhalaFont = {
  fontFamily: "var(--font-sinhala), 'Noto Sans Sinhala', sans-serif",
};

function AlertGraphic({ graphicRef, photo, img, theme, titleSi, titleEn, date, opts }) {
  return (
    <div
      ref={graphicRef}
      className="relative overflow-hidden bg-[#081326] font-sans text-white"
      style={{ width: 1080, height: 1350 }}
    >
      {/* Photo area */}
      <div className="absolute left-0 right-0 overflow-hidden" style={{ top: 170, height: 840 }}>
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, #0b1d3a, ${theme.to})` }}
        />
        <NewsPhoto src={photo} img={img} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
      </div>

      {/* Header */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-center gap-6"
        style={{
          height: 170,
          background: `linear-gradient(90deg, ${theme.to}, ${theme.from} 50%, ${theme.to})`,
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        }}
      >
        {opts.showLogo && <Logo size={84} />}
        <div className="flex items-baseline gap-5 italic">
          <span className="text-[78px] font-black tracking-tight">LANKAPULSE</span>
          <span
            className="text-[78px] font-black tracking-tight"
            style={{ color: theme.chip, textShadow: "0 0 30px rgba(255,255,255,0.25)" }}
          >
            ALERT
          </span>
        </div>
      </div>

      {/* Date badge */}
      {opts.showDate && date && (
        <div
          className="absolute left-10 rounded-lg bg-black/75 px-6 py-2 text-[34px] font-semibold tracking-wide"
          style={{ top: 200 }}
        >
          {date}
        </div>
      )}

      {/* Headline panel */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col"
        style={{
          height: 440,
          background: `linear-gradient(to bottom, transparent 0, ${theme.from} 95px, ${theme.to} 100%)`,
        }}
      >
        <div className="flex flex-1 flex-col justify-center px-[56px] pt-[20px] text-center">
          <div
            className="overflow-hidden font-extrabold"
            style={{
              ...sinhalaFont,
              fontSize: opts.sinhalaSize,
              lineHeight: 1.35,
              maxHeight: opts.showEn ? 230 : 290,
              textShadow: "0 3px 14px rgba(0,0,0,0.35)",
            }}
          >
            {titleSi || "සිංහල පුවත් සිරස්තලය"}
          </div>

          {opts.showEn && (
            <div
              className="mx-auto mt-4 overflow-hidden text-[30px] leading-[1.35] text-white/85"
              style={{ maxHeight: 82, maxWidth: 900 }}
            >
              {titleEn || "English news headline"}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/25 px-[56px] py-[18px] text-[24px]">
          <span className="text-white/80">{SITE_URL}</span>
          <span
            className="rounded-md px-4 py-1 font-bold tracking-[3px]"
            style={{ background: "rgba(0,0,0,0.35)", color: theme.chip }}
          >
            LANKAPULSE AI
          </span>
        </div>
      </div>
    </div>
  );
}

function WideGraphic({ graphicRef, photo, img, theme, titleSi, titleEn, date, opts }) {
  return (
    <div
      ref={graphicRef}
      className="relative overflow-hidden bg-[#081326] font-sans"
      style={{ width: 1200, height: 630 }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0 0 20% 0)" }}>
        <NewsPhoto src={photo} img={img} style={{ opacity: 0.45 }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#040d1d]/[0.98] via-[#040d1d]/[0.82] to-[#040d1d]/30" />

      <div className="relative z-10 flex h-full flex-col px-[65px] py-[45px] text-white">
        <div className="flex items-center justify-between gap-4">
          {opts.showLogo ? (
            <div className="flex items-center gap-4">
              <Logo size={58} />
              <div>
                <span className="brand-gradient whitespace-nowrap text-xl font-extrabold tracking-tight">
                  LankaPulse AI
                </span>
                <p className="text-[13px] tracking-[3px] text-slate-300">
                  SRI LANKA NEWS INTELLIGENCE
                </p>
              </div>
            </div>
          ) : (
            <span />
          )}

          <div
            className="rounded-md px-[17px] py-[9px] text-[15px] font-bold"
            style={{ background: theme.from }}
          >
            BREAKING NEWS
          </div>
        </div>

        <div
          className="mt-10 overflow-hidden font-extrabold leading-[1.4]"
          style={{ ...sinhalaFont, fontSize: Math.round(opts.sinhalaSize * 0.62), maxHeight: 155 }}
        >
          {titleSi || "සිංහල පුවත් සිරස්තලය"}
        </div>

        {opts.showEn && (
          <div className="mt-2.5 max-h-[75px] overflow-hidden text-[23px] leading-[1.4] text-slate-300">
            {titleEn || "English news headline"}
          </div>
        )}

        {opts.showDate && (
          <div className="mt-3 text-base font-semibold" style={{ color: theme.chip }}>
            {date}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-white/30 pt-[15px] text-base">
          <span className="text-slate-300">Stay Informed. Think Smarter.</span>
          <span className="font-bold tracking-wider" style={{ color: theme.chip }}>
            LANKAPULSE AI
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

const fieldClass =
  "w-full rounded-lg border border-dark-border bg-dark-surface p-3 text-sm outline-none transition focus:border-light-cyan/60 focus:ring-2 focus:ring-light-cyan/20";

function Field({ label, children, right }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm text-slate-300">{label}</label>
        {right}
      </div>
      {children}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, suffix = "" }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#00ffff]"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
        checked
          ? "border-light-cyan/60 bg-light-cyan/10 text-light-cyan"
          : "border-dark-border text-slate-400 hover:text-slate-200"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${checked ? "bg-light-cyan" : "bg-slate-600"}`} />
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function FacebookDashboard() {
  const graphicRef = useRef(null);
  const dragRef = useRef(null);

  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [currentDate, setCurrentDate] = useState(null);

  const [titleSi, setTitleSi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [summarySi, setSummarySi] = useState("");
  const [summaryEn, setSummaryEn] = useState("");
  const [caption, setCaption] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Design controls
  const [templateKey, setTemplateKey] = useState("alert");
  const [themeKey, setThemeKey] = useState("alert");
  const [img, setImg] = useState(DEFAULT_IMG);
  const [opts, setOpts] = useState({
    sinhalaSize: 57,
    showEn: true,
    showDate: true,
    showLogo: false,
  });

  const tpl = TEMPLATES[templateKey];
  const theme = THEMES[themeKey];
  const [boxRef, scale] = useFitScale(tpl.w);

  const selectedArticle = articles.find((a) => String(a.id) === selectedId);
  const croppedPhoto = useCroppedImage(selectedArticle?.image_url);

  useEffect(() => {
    setCurrentDate(new Date());
    loadArticles();
    loadHistory();
  }, []);

  // Populate editor when an article is selected.
  useEffect(() => {
    if (!selectedArticle) {
      setTitleSi("");
      setTitleEn("");
      setSummarySi("");
      setSummaryEn("");
      setCaption("");
      return;
    }
    setTitleSi(selectedArticle.title_si || selectedArticle.title || "");
    setTitleEn(selectedArticle.title || selectedArticle.title_si || "");
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
    setImg(DEFAULT_IMG);
  }, [selectedId, articles]);

  // Auto caption (no source / article URL).
  useEffect(() => {
    if (!selectedArticle) return;
    setCaption(
      `📰 ${titleSi}\n\n${summarySi}\n\n━━━━━━━━━━━━━━━━━━\n\n📰  ${titleEn}\n\n${summaryEn}\n\n#LankaPulseAI #SriLankaNews #SriLanka #BreakingNews #LatestNews #NewsUpdate #LocalNews #WorldNews #SriLankanNews #NewsToday #CurrentAffairs #StayInformed #NewsIntelligence #DailyNews #SriLankaUpdates #TrustedNews #TrendingNews #SinhalaNews #EnglishNews #LankaNews`
    );
  }, [titleSi, titleEn, summarySi, summaryEn, selectedArticle]);

  async function loadArticles() {
    try {
      const response = await fetch(`${API_URL}/news?per_page=100`);
      if (!response.ok) throw new Error("Unable to load news articles.");
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
      setMessage(error instanceof Error ? error.message : "Article loading failed.");
    }
  }

  async function loadHistory() {
    try {
      const response = await fetch(`${API_URL}/facebook-posts?status=published`);
      if (!response.ok) return;
      const result = await response.json();
      const data = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.data)
          ? result.data.data
          : [];
      setPosts(data);
    } catch (error) {
      console.error("Facebook history loading failed:", error);
    }
  }

  // Generate PNG at the active template's size.
  async function exportGraphic() {
    if (!graphicRef.current) throw new Error("Graphic preview is not ready.");

    if (document.fonts?.ready) await document.fonts.ready;

    const images = Array.from(graphicRef.current.querySelectorAll("img"));
    await Promise.all(
      images.map((image) =>
        image.complete && image.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.onload = resolve;
              image.onerror = resolve;
            })
      )
    );

    const blob = await toBlob(graphicRef.current, {
      width: tpl.w,
      height: tpl.h,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: "#081326",
    });

    if (!blob) throw new Error("Unable to generate PNG.");
    return blob;
  }

  async function downloadGraphic() {
    try {
      setLoading(true);
      setMessage("Generating graphic...");
      const blob = await exportGraphic();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lankapulse-${templateKey}-${selectedId}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Graphic downloaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Graphic generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setMessage("Caption copied.");
    } catch {
      setMessage("Could not copy caption.");
    }
  }

  async function publishPost() {
    if (!selectedArticle) return setMessage("Please select a news article.");
    if (selectedArticle.facebook_post_id)
      return setMessage("This article has already been published.");
    if (!caption.trim()) return setMessage("Please enter a Facebook caption.");

    try {
      setLoading(true);
      setMessage("Generating graphic...");
      const blob = await exportGraphic();

      const formData = new FormData();
      formData.append("article_id", String(selectedArticle.id));
      formData.append("message", caption);
      formData.append("image", blob, "lankapulse-post.png");

      setMessage("Publishing to Facebook...");

      const response = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || result.error || "Facebook publishing failed.");
      }

      setMessage(`Successfully published! Facebook ID: ${result.facebook_post_id || "Published"}`);
      await Promise.all([loadArticles(), loadHistory()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Publishing failed.");
    } finally {
      setLoading(false);
    }
  }

  // Drag the preview to reposition the photo.
  function onPointerDown(e) {
    dragRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setImg((p) => ({
      ...p,
      x: clamp(p.x - (dx / (tpl.w * scale)) * 120, 0, 100),
      y: clamp(p.y - (dy / (tpl.h * scale)) * 120, 0, 100),
    }));
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  const publicationDate = selectedArticle?.published_at
    ? new Date(selectedArticle.published_at)
    : currentDate;
  const formattedDate = publicationDate ? publicationDate.toLocaleDateString("en-CA") : "";

  const setOpt = (key) => (value) => setOpts((p) => ({ ...p, [key]: value }));

  const Graphic = templateKey === "alert" ? AlertGraphic : WideGraphic;

  return (
    <main className="min-h-screen bg-dark-background px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header>
          <span className="brand-gradient whitespace-nowrap text-xl font-extrabold tracking-tight">
            LankaPulse AI
          </span>
          <h1 className="mt-2 text-3xl font-bold">Facebook Publishing Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Design bilingual branded news graphics, tweak them live, and publish to Facebook.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* ---------------- Editor ---------------- */}
          <div className="space-y-5">
            <Field label="Select News Article">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className={fieldClass}
              >
                <option value="">Choose an article</option>
                {articles.map((article) => (
                  <option
                    key={article.id}
                    value={article.id}
                    disabled={
                      Boolean(article.facebook_post_id) ||
                      article.facebook_publish_status === "publishing"
                    }
                  >
                    #{article.id} - {article.title}
                    {article.facebook_post_id ? " (Published)" : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sinhala Headline" right={<span className="text-xs text-slate-500">{titleSi.length} chars</span>}>
              <textarea value={titleSi} onChange={(e) => setTitleSi(e.target.value)} rows={3} className={fieldClass} />
            </Field>

            <Field label="English Headline" right={<span className="text-xs text-slate-500">{titleEn.length} chars</span>}>
              <textarea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} rows={2} className={fieldClass} />
            </Field>

            <Field label="Sinhala Summary">
              <textarea value={summarySi} onChange={(e) => setSummarySi(e.target.value)} rows={4} className={fieldClass} />
            </Field>

            <Field label="English Summary">
              <textarea value={summaryEn} onChange={(e) => setSummaryEn(e.target.value)} rows={4} className={fieldClass} />
            </Field>

            <Field
              label="Facebook Caption"
              right={
                <button
                  type="button"
                  onClick={copyCaption}
                  className="text-xs text-light-cyan hover:underline"
                >
                  Copy
                </button>
              }
            >
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={9} className={fieldClass} />
            </Field>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadGraphic}
                disabled={loading || !selectedArticle}
                className="rounded-lg bg-slate-700 px-5 py-3 transition hover:bg-slate-600 disabled:opacity-50"
              >
                Download PNG
              </button>

              <button
                onClick={publishPost}
                disabled={loading || !selectedArticle || Boolean(selectedArticle?.facebook_post_id)}
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Publish to Facebook"}
              </button>
            </div>

            {message && <p className="break-words text-sm text-sky-300">{message}</p>}
          </div>

          {/* ---------------- Studio ---------------- */}
          <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Graphic Studio</h2>
              <span className="text-xs text-slate-500">
                {tpl.w} × {tpl.h}px · {tpl.hint}
              </span>
            </div>

            {/* Template tabs */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-dark-border bg-dark-surface p-1">
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setTemplateKey(key)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    templateKey === key
                      ? "bg-gradient-to-r from-primary to-light-blue text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Live preview */}
            <div className={`mx-auto w-full ${templateKey === "alert" ? "max-w-[460px]" : ""}`}>
              <div
                ref={boxRef}
                className="relative w-full overflow-hidden rounded-2xl border border-dark-border shadow-2xl shadow-black/50"
                style={{ height: tpl.h * scale }}
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

                {/* Drag layer (not part of the export) */}
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

            {/* Controls */}
            <div className="space-y-4 rounded-xl border border-dark-border bg-dark-card/60 p-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-slate-400">Theme</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(THEMES).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => setThemeKey(key)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                        themeKey === key
                          ? "border-white/70 text-white"
                          : "border-dark-border text-slate-400 hover:text-white"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${t.from}, ${t.chip})` }}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Slider
                  label="Photo zoom"
                  value={img.zoom}
                  min={1}
                  max={2.5}
                  step={0.05}
                  suffix="×"
                  onChange={(zoom) => setImg((p) => ({ ...p, zoom }))}
                />
                <Slider
                  label="Sinhala headline size"
                  value={opts.sinhalaSize}
                  min={40}
                  max={90}
                  suffix="px"
                  onChange={setOpt("sinhalaSize")}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Toggle label="English headline" checked={opts.showEn} onChange={setOpt("showEn")} />
                <Toggle label="Date badge" checked={opts.showDate} onChange={setOpt("showDate")} />
                <Toggle label="Logo" checked={opts.showLogo} onChange={setOpt("showLogo")} />
                <button
                  type="button"
                  onClick={() => setImg(DEFAULT_IMG)}
                  className="ml-auto text-xs text-slate-400 hover:text-white"
                >
                  Reset photo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Published posts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Published Facebook Posts</h2>

          {posts.length === 0 ? (
            <p className="text-slate-400">No published Facebook posts found.</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-dark-border bg-dark-surface p-4 transition hover:border-light-cyan/40"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-semibold">{post.news_article?.title || "News article"}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleString()
                          : "Publication date unavailable"}
                      </p>
                    </div>
                    <span className="text-sm text-green-400">{post.status}</span>
                  </div>

                  {post.post_url && (
                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-sky-400 hover:text-sky-300"
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
