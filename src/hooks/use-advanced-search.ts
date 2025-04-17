
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/ProductCard";
import { rankProducts, initEmbeddingModel } from "@/utils/searchUtils";
import { useEffect } from "react";

interface SearchFilters {
  query: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
}

// Initialize embedding model when module loads
initEmbeddingModel().catch(err => {
  console.warn("Failed to initialize embedding model:", err);
});

export const useAdvancedSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');
      
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
      
      // If there's a text query, we'll load more products and rank them client-side
      // For no query, we apply database-side filtering only
      if (filters.query && filters.query.trim() !== '') {
        // Add a basic filter to reduce initial result set
        const searchTerms = filters.query.trim();
        query = query.or(`name.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%,category.ilike.%${searchTerms}%`);
      }
      
      // Execute the query
      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      // Map the database fields to match the Product type format
      const products = (data || []).map(item => ({
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
        stock: item.stock || 0,
        description: item.description || ''
      })) as Product[];
      
      // Apply our advanced ranking algorithm with ML features
      if (filters.query && filters.query.trim() !== '') {
        try {
          console.log("Using advanced ranking with ML features");
          return await rankProducts(products, filters.query);
        } catch (err) {
          console.error("Error in advanced ranking:", err);
          // Fallback to basic sorting if ML ranking fails
          return products;
        }
      }
      
      // If no query or after sorting
      return products;
    },
    enabled: true // Always enabled so we can show results
  });
};
