
import React from "react";
import HeroCard from "@/components/HomeHero";
import Header from "@/components/ui/Header";
import CategoriesCard from "@/components/ui/CategoriesCard";


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
export default function CategoriesPage() {

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
        <div className=" grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category)=>(
            <CategoriesCard
            key={category.name}
            category={category}/>
        ))}
        </div>
        </div>
</div>
    </main>
  );
}
