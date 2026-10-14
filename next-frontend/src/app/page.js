
import Categories from "@/components/CategorySection";
import HomeHero from "../components/HomeHero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-background dark:text-white">
      <div className="container-custom">
        <HomeHero />
        <Categories />
      </div>
    </main>
  );
}
