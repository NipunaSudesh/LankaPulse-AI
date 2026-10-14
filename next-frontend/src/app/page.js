
import Categories from "@/components/CategorySection";
import HomeHero from "../components/HomeHero";
import HeroCard from "../components/HomeHero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-background dark:text-white">
       <div className="container-custom">
        <HeroCard
          label="LANKA NEWS INTELLIGENCE"
          title="Stay Informed."
          highlight="Think Smarter."
          description="Discover Sri Lankan news from multiple sources in one place. Let AI categorize stories, uncover important trends, and deliver concise insights."
        />
       
        <Categories />
      </div>
    </main>
  );
}
