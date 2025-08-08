import BenefitsSection from "../components/BenefitsSection";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import Hero from "../components/Hero";

export default function HomePage() {
  return (
    <>
      {/* <Header /> */}
      <Hero />
      <main className="p-4">
        {/* Your main content */}
        <CategorySection />
        <FeaturedProducts />
      <BenefitsSection />
      </main>
    </>
  );
}
