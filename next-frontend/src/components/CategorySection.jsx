"use client";

import React, { useRef, useState, useEffect } from "react";
import Button from "./ui/Button";
import CategoriesCard from "./ui/CategoriesCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "./ui/Header";

const categories = [
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
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="mt-12 flex flex-col ">
        <div className="flex items-center justify-between">
          <Header
            title="Categories"
            description="Explore news by categories"
          />
        </div>
        <div className="w-full h-48 bg-muted/20 animate-pulse rounded-xl" />
      </section>
    );
  }

  return (
    <section className="mt-12 flex flex-col">
      <div className="flex items-center justify-between">
        <Header
          title="Categories"
          description="Explore news by categories"
        />

        <div className="flex gap-2">
          <Button
            ref={prevRef}
            type="button"
            variant="outline"
            aria-label="Previous categories"
            className="!h-10 !w-10 !rounded-full !p-0"
          >
            <FaChevronLeft size={14} />
          </Button>

          <Button
            ref={nextRef}
            type="button"
            variant="outline"
            aria-label="Next categories"
            className="!h-10 !w-10 !rounded-full !p-0"
          >
            <FaChevronRight size={14} />
          </Button>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Navigation, Pagination, A11y]}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        speed={700}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
        className="categories-swiper w-full !pb-12"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.name}>
            <CategoriesCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}