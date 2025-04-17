
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { Product } from "@/components/ProductCard";

interface RecommendedProductsProps {
  excludeProductIds?: number[];
  title?: string;
  description?: string;
}

const RecommendedProducts = ({
  excludeProductIds = [],
  title = "Recommended For You",
  description = "Based on your shopping habits"
}: RecommendedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // In a real app, this would call an ML-based recommendation API
    // For now, we're using featured products and filtering out excluded IDs
    const allFeatured = getFeaturedProducts();
    const recommended = allFeatured
      .filter(product => !excludeProductIds.includes(product.id))
      .slice(0, 4);
    
    setProducts(recommended);
  }, [excludeProductIds]);

  if (products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-harvest-dark">{title}</h2>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          <Link to="/shop">
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-harvest-primary text-harvest-primary hover:bg-harvest-primary hover:text-white"
            >
              View All
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;
