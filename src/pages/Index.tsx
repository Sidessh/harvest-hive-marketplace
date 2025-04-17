
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryBanner from "@/components/CategoryBanner";
import FarmerSpotlight from "@/components/FarmerSpotlight";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        <CategoryBanner />
        <FarmerSpotlight />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
