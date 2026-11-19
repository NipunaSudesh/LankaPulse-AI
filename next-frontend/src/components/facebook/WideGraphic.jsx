import Logo from "../ui/Logo";
import { sinhalaFont, FONT_SIZE } from "./graphicStyles";

function NewsPhoto({ src, img }) {
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
      }}
    />
  );
}

export default function WideGraphic({
  graphicRef,
  photo,
  img,
  theme,
  titleSi,
  titleEn,
  date,
  opts,
}) {
  return (
    <div
      ref={graphicRef}
      className="relative overflow-hidden bg-[#081326] font-sans"
      style={{ width: 1200, height: 630 }}
    >
      {/* Background photo */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: "inset(0 0 20% 0)" }}
      >
        <NewsPhoto src={photo} img={img} />

        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Brand logo */}
      {opts.showLogo && (
        <div className="absolute bottom-[145px] right-8 z-20 flex items-center gap-3 rounded-xl border border-white/25 bg-black/70 px-4 py-3 shadow-2xl">
          <Logo size={46} />

          <span className="whitespace-nowrap text-[23px] font-black tracking-tight text-white">
            LankaPulse <span className="text-cyan-300">AI</span>
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#040d1d]/[0.98] via-[#040d1d]/[0.82] to-[#040d1d]/30" />

      <div className="relative z-10 flex h-full flex-col px-[65px] py-[45px] text-white">
        {/* Header */}
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

        {/* Sinhala headline */}
        <div
          className="mt-10 overflow-hidden font-extrabold"
          style={{
            ...sinhalaFont,
            fontSize: Math.round(
              opts.sinhalaSize * FONT_SIZE.wideScale
            ),
            lineHeight: 1.4,
            maxHeight: 155,
          }}
        >
          {titleSi || "සිංහල පුවත් සිරස්තලය"}
        </div>

        {/* English headline */}
        {opts.showEn && (
          <div className="mt-2.5 max-h-[75px] overflow-hidden text-[23px] leading-[1.4] text-slate-300">
            {titleEn || "English news headline"}
          </div>
        )}

        {/* Date */}
        {opts.showDate && date && (
          <div
            className="mt-3 text-base font-semibold"
            style={{ color: theme.chip }}
          >
            {date}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-white/30 pt-[15px] text-base">
          <span className="text-slate-300">
            Stay Informed. Think Smarter.
          </span>

          <span
            className="font-bold tracking-wider"
            style={{ color: theme.chip }}
          >
            LANKAPULSE AI
          </span>
        </div>
      </div>
    </div>
  );
}