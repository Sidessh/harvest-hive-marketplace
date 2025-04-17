
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import RecommendedProducts from "@/components/RecommendedProducts";
import { searchProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate network delay for realistic search experience
      const timer = setTimeout(() => {
        const searchResults = searchProducts(query);
        setResults(searchResults);
        setIsLoading(false);
        
        // Show toast notification for search results
        toast({
          title: `${searchResults.length} results found`,
          description: searchResults.length > 0 
            ? `Showing results for "${query}"` 
            : `No results found for "${query}". Try different keywords.`,
          variant: searchResults.length > 0 ? "default" : "destructive",
        });
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-harvest-dark">
            {query ? `Search results for "${query}"` : "Search"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isLoading 
              ? "Searching for products..." 
              : results.length > 0 
                ? `Found ${results.length} products` 
                : "No products found. Try a different search term."}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white shadow rounded-md p-4 h-80 animate-pulse"
                >
                  <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-2"></div>
                  <div className="bg-gray-200 h-4 w-2/3 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-8 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}".
              </p>
              <Button
                variant="outline"
                className="border-harvest-primary text-harvest-primary hover:bg-harvest-primary hover:text-white"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          ) : null}
          
          {/* Add recommendations when there are no or few results */}
          {query && !isLoading && results.length < 2 && (
            <RecommendedProducts 
              title="You Might Also Like" 
              description="Popular products from our farmers"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
