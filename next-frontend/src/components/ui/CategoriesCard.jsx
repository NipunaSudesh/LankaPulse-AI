
import Image from "next/image";
import React from "react";

export default function CategoriesCard({ category }) {
  return (
    <article className="group relative isolate h-64 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#080d17] shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-[#00e6b8]/50 hover:shadow-[0_18px_45px_rgba(0,230,184,0.16)] sm:h-72">

      {/* Background Image */}
      <Image
        src={category.imgURL}
        alt={`${category.name} category`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/90 transition-opacity duration-500 group-hover:opacity-95" />

      {/* Teal Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#00e6b8]/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top Badge */}
      <div className="absolute left-4 top-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00e6b8] shadow-[0_0_10px_#00e6b8]" />
          News Category
        </span>
      </div>

      {/* Corner Arrow */}
      <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:border-[#00e6b8]/70 group-hover:bg-[#00e6b8] group-hover:text-[#07110f] group-hover:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>

      {/* Category Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="mb-3 h-1 w-8 rounded-full bg-[#00e6b8] transition-all duration-500 group-hover:w-14" />

        <h2 className="translate-y-2 text-2xl font-extrabold tracking-tight text-white transition-all duration-500 group-hover:translate-y-0 group-hover:text-[#00e6b8]">
          {category.name}
        </h2>

        <p className="mt-2 line-clamp-2 max-w-sm translate-y-2 text-sm leading-6 text-white/75 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {category.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#00e6b8]">
          <span>Explore Stories</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </div>
      </div>

      {/* Subtle Border Highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-[#00e6b8]/40" />
    </article>
  );
}
