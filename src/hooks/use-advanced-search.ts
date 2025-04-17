
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
      let query = supabase
        .from('products')
        .select('*');
      
      // Apply text search filter
      if (filters.query && filters.query.trim() !== '') {
        const searchTerms = filters.query.trim();
        query = query.or(`name.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%,category.ilike.%${searchTerms}%`);
      }
      
      // Apply category filter
      if (filters.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }
      
      // Apply price range filters
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      
      // Execute the query
      const { data, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      // Map the database fields to match the Product type format
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        farmer: {
          id: item.farmer_id || 0,
          name: 'Farmer', // Default value as we don't have actual farmer data
          location: 'Unknown Location'
        },
        rating: item.rating || 0,
        reviews: item.reviews_count || 0,
        isOrganic: item.organic || false,
        isLocal: item.local || false, 
        isSeasonal: item.seasonal || false,
        category: item.category || '',
        stock: item.stock || 0
      })) as Product[];
    },
    enabled: !!filters.query
  });
};
