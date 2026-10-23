
"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoriesCard from "./ui/CategoriesCard";
import Header from "./ui/Header";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Button from "./ui/Button";

const categories1 = [
  {
    name: "Politics",
    description: "Government, elections and public policy.",
    imgURL: "/images/Politics.png",
  },
  {
    name: "Economy",
    description: "Inflation, cost of living and financial news.",
    imgURL: "/images/Economy.png",
  },
  {
    name: "Technology",
    description: "AI, software and digital innovation.",
    imgURL: "/images/Technology.png",
  },
  {
    name: "Crime",
    description: "Police reports and public safety updates.",
    imgURL: "/images/Crime.png",
  },
  {
    name: "Sports",
    description: "Cricket and local and global sports.",
    imgURL: "/images/Sports.png",
  },
  {
    name: "Culture",
    description: "Arts, entertainment and cultural events.",
    imgURL: "/images/Culture.png",
  },
  {
    name: "Health",
    description: "Healthcare and public health updates.",
    imgURL: "/images/Health.png",
  },
  {
    name: "Education",
    description: "Schools, universities and education news.",
    imgURL: "/images/Education.png",
  },
  {
    name: "Environment",
    description: "Climate change, wildlife and environmental news.",
    imgURL: "/images/Environment.png",
  },
  {
    name: "International",
    description: "Global affairs and international developments.",
    imgURL: "/images/International.png",
  },
  {
    name: "Public",
    description: "Public services, transport and community news.",
    imgURL: "/images/Public.png",
  },
  {
    name: "Weather",
    description: "Weather forecasts and severe weather alerts.",
    imgURL: "/images/Weather.png",
  },
];

export default function Categories() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
   const fetchCategories = async () => {
  try {
    setError("");

    const res = await fetch(`${API_BASE_URL}/categories`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const result = await res.json();

    setCategories(Array.isArray(result.data) ? result.data : []);
  } catch (err) {
    console.error("Failed to fetch Categories:", err);
    setError("Unable to load categories. Please try again later.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchCategories();
}, []);

useEffect(() => {
  setMounted(true);
}, []);

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="relative isolate mt-10 overflow-hidden rounded-3xl border border-border bg-surface px-4 py-4 text-text-main transition-colors duration-300 sm:mt-10 sm:px-7 sm:py-6 lg:px-10 lg:py-8 "
    >
      {/* Decorative background */}
      <div className="categories-glow pointer-events-none absolute -left-32 top-0 -z-10 h-72 w-72 rounded-full blur-[100px]" />

      <div className="categories-glow-secondary pointer-events-none absolute -right-32 bottom-0 -z-10 h-72 w-72 rounded-full blur-[100px]" />

      <div
        aria-hidden="true"
        className="categories-grid-overlay pointer-events-none absolute inset-0 -z-10"
      />

      {/* Section heading and carousel controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Header
            sub="Discover the headlines"
            title="Explore Categories"
            description="From local headlines to global developments, discover the stories that matter to you."
          />
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-xs font-medium tracking-wide text-text-muted">
            <span className="text-lg font-bold text-text-main">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>

            <span className="mx-2">/</span>

            {String(categories.length).padStart(2, "0")}

            <span className="ml-2">categories</span>
          </div>

          <div className="flex gap-2">
          <div className="flex gap-2">
            <Button
              variant="pagination"
              direction="previous"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={activeIndex === 0}
            />

            <Button
              variant="pagination"
              direction="next"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={activeIndex >= categories.length - 1}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Categories carousel */}
     
     {mounted ? ( <Swiper
        modules={[Autoplay, Pagination, A11y]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
onSlideChange={(swiper) => {
  const index = Number(swiper.realIndex);

  setActiveIndex(Number.isFinite(index) && index >= 0 ? index : 0);
}}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        speed={650}
        spaceBetween={16}
        slidesPerView={1.15}
        breakpoints={{
          480: {
            slidesPerView: 1.8,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2.3,
            spaceBetween: 18,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3.5,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 22,
          },
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        a11y={{
          prevSlideMessage: "Previous category",
          nextSlideMessage: "Next category",
        }}
        className="categories-swiper !overflow-visible !pb-14"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={category.name} className="!h-auto">
            <div
              className="category-card-enter"
              style={{
                animationDelay: `${Math.min(index, 5) * 70}ms`,
              }}
            >
              <CategoriesCard category={category} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
) : null}
      {/* Bottom information */}
      <div className=" flex flex-col gap-3 border-t border-border  sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-text-muted">
          Your world, organized into stories that matter.
        </p>

        <a
          href="/categories"
          className="group inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-text-green-light transition-colors hover:text-primary"
        >
          View all news

          <FaArrowRight
            size={11}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </section>
  );
}