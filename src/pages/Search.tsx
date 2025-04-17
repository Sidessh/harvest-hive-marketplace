
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import RecommendedProducts from "@/components/RecommendedProducts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAdvancedSearch } from "@/hooks/use-advanced-search";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    query,
    categories: undefined,
    minPrice: undefined,
    maxPrice: undefined
  });

  const { data: results, isLoading, error } = useAdvancedSearch(filters);

  useEffect(() => {
    setFilters(prev => ({ ...prev, query }));
  }, [query]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Search error",
        description: "There was an error performing the search. Please try again.",
        variant: "destructive",
      });
    } else if (results && !isLoading) {
      toast({
        title: `${results.length} results found`,
        description: results.length > 0 
          ? `Showing results for "${query}"` 
          : `No results found for "${query}". Try different keywords.`,
        variant: results.length > 0 ? "default" : "destructive",
      });
    }
  }, [results, error, query, toast, isLoading]);

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
              : results?.length > 0 
                ? `Found ${results.length} products` 
                : "No products found. Try a different search term."}
          </p>

          {/* Advanced search information */}
          {query && !isLoading && results?.length > 0 && (
            <p className="text-sm text-harvest-primary mb-4">
              Results are ranked using advanced relevance scoring based on text matching and product popularity
            </p>
          )}

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
          ) : results?.length > 0 ? (
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
          
          {query && !isLoading && (!results || results.length < 2) && (
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
