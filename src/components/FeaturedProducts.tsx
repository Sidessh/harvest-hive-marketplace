
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-harvest-dark">
              Featured Products
            </h2>
            <p className="text-gray-600 mt-2">
              Handpicked selections from our local farmers
            </p>
          </div>
          <Link to="/shop">
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-harvest-primary text-harvest-primary hover:bg-harvest-primary hover:text-white"
            >
              View All Products
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
