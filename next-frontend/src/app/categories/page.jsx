"use client"

import React, { useEffect, useState } from "react";
import HeroCard from "@/components/HomeHero";
import Header from "@/components/ui/Header";
import CategoriesCard from "@/components/ui/CategoriesCard";
import { fetchCategories } from "@/lib/api";

export default function CategoriesPage() {
const [categories ,setCategories] =useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const fetchCategories =async()=>{
//   try {
//     const res =await fetch(`${API_BASE_URL}/categories`);
//      const result =await res.json();
//      setCategories(result.data);
//      console.log("categories",result.data)
//   } catch (error) {
//     console.log("Unable to load",error)
//     setError("Unable to load news. Please try again later.");
//   }finally{
// setLoading(false);  }
// }

useEffect(() => {
  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Unable to load categories:", error);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }

  loadCategories();
}, []);

  return (
    <main>
        <div className=" container-custom flex flex-col  gap-4">
            <HeroCard
            button="true"
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
