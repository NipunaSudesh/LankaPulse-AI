"use client"

import React, { useEffect, useState } from "react";
import HeroCard from "@/components/HomeHero";
import Header from "@/components/ui/Header";
import CategoriesCard from "@/components/ui/CategoriesCard";


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
export default function CategoriesPage() {
const [categories ,setCategories] =useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const fetchCategories =async()=>{
        if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
      }
      
  try {
    const res =await fetch(`${API_BASE_URL}/categories`);
     if(!res.ok){
      throw new Error(`HTTP error: ${res.status}`);
     }
     const result =await res.json();

    //  const catogory =Array.isArray(result.data) ? (result.data):[];
     setCategories(result.data);
     console.log("categories",result.data)

  } catch (error) {
    console.log("Unable to load",error)
    setError("Unable to load news. Please try again later.");
  }finally{
setLoading(false);  }
}

useEffect(()=>{
  fetchCategories();
},[]);
  return (
    <main>
        <div className=" container-custom flex flex-col  gap-4">
            <HeroCard
            label="EXPLORE NEWS CATEGORIES"
            title="Explore Every Topic."
            highlight="Find Your News."
            description="From politics and the economy to technology, sports, and culture, explore news by category and discover the stories that matter to you."
            />
        
        <div className="mt-10 flex flex-col gap-4">
            <Header
            title="Browse Categories"
            description="Explore the latest news by topic. Choose a category to discover stories, updates, and insights that matter to you."
/>
 {loading && (
        <p className="py-12 text-center text-text-muted">
          Loading categories...
        </p>
      )}

      {!loading && error && (
        <p className="py-12 text-center text-red-500">{error}</p>
      )}
      {!loading && !error && categories.length === 0 && (
        <p className="py-12 text-center text-text-muted">
          No categories found.
        </p>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className=" grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category)=>(
            <CategoriesCard
            key={category.name}
            category={category}/>
        ))}
        </div>
      )}
        </div>
</div>
    </main>
  );
}
