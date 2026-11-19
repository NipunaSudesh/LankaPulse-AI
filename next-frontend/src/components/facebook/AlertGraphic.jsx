import Logo from "../ui/Logo";
import { sinhalaFont } from "./graphicStyles";

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

export default function AlertGraphic({
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
      className="relative overflow-hidden bg-[#081326] font-sans text-white"
      style={{ width: 1080, height: 1350 }}
    >
      {/* Photo area */}
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{ top: 170, height: 840 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, #0b1d3a, ${theme.to})`,
          }}
        />

        <NewsPhoto src={photo} img={img} />

        {opts.showLogo && (
          <div className="absolute bottom-[150px] right-4 z-30 flex items-center gap-3 rounded-xl border border-white/25 bg-black px-6 py-4 shadow-2xl">
            <Logo size={52} />

            <span className="whitespace-nowrap text-[25px] font-black tracking-tight text-white">
              LankaPulse <span className="text-cyan-300">AI</span>
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
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
        <div className="flex items-baseline gap-5 italic">
          <span className="text-[78px] font-black tracking-tight">
            LANKAPULSE
          </span>

          <span
            className="text-[78px] font-black tracking-tight"
            style={{
              color: theme.chip,
              textShadow: "0 0 30px rgba(255,255,255,0.25)",
            }}
          >
            ALERT
          </span>
        </div>
      </div>

      {/* Date */}
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
          height: 460,
          background: `linear-gradient(to bottom, transparent 0, ${theme.from} 95px, ${theme.to} 100%)`,
        }}
      >
        <div className="mt-[50px] flex flex-1 flex-col px-4 text-center">
          <div
            className="overflow-hidden font-extrabold"
            style={{
              ...sinhalaFont,
              fontSize: opts.sinhalaSize,
              lineHeight: 1.35,
              maxHeight: opts.showEn ? 310 : 320,
              textShadow: "0 3px 14px rgba(0,0,0,0.35)",
            }}
          >
            {titleSi || "සිංහල පුවත් සිරස්තලය"}
          </div>

          {opts.showEn && (
            <div
              className="mx-auto mt-4 overflow-hidden text-[30px] leading-[1.35] text-white/85"
              style={{
                maxHeight: 82,
                maxWidth: 900,
              }}
            >
              {titleEn || "English news headline"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}