
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/ProductCard";

interface SearchFilters {
  query: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const useAdvancedSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_products', {
          search_query: filters.query,
          categories: filters.categories,
          min_price: filters.minPrice,
          max_price: filters.maxPrice
        });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      return data as Product[];
    },
    enabled: !!filters.query
  });
};
