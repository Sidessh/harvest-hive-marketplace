
import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  farmer: {
    id: number;
    name: string;
    location: string;
  };
  rating: number;
  reviews: number;
  isOrganic: boolean;
  isLocal: boolean;
  isSeasonal: boolean;
  category: string;
  stock: number;
  description?: string; // Add the description field as optional
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", product.name);
    // Will implement cart functionality in a future update
  };

  return (
    <div className={cn("product-card", className)}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
            onClick={toggleWishlist}
          >
            <Heart
              size={18}
              className={cn(
                "transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </Button>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {product.isOrganic && <BadgeCustom variant="organic">Organic</BadgeCustom>}
            {product.isLocal && <BadgeCustom variant="local">Local</BadgeCustom>}
            {product.isSeasonal && <BadgeCustom variant="seasonal">Seasonal</BadgeCustom>}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">
            {product.farmer.name} • {product.farmer.location}
          </div>
          <h3 className="font-medium text-base line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 mr-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? "fill-current" : ""}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="price-tag">${product.price.toFixed(2)}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-harvest-primary text-harvest-primary hover:bg-harvest-primary hover:text-white"
              onClick={addToCart}
            >
              <ShoppingCart size={14} className="mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
