import Image from "next/image";

export default function Logo({ size = 52 }) {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-blue-600/40 blur-md" />

      <div className="relative overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-900 p-1 shadow-lg">
        <Image
         src="/LP_Logo.png"
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