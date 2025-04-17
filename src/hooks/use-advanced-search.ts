
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/ProductCard";

interface SearchFilters {
  query: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
}

// Helper function for advanced text matching
const calculateTextRelevance = (text: string, query: string): number => {
  if (!text || !query) return 0;
  
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
  
  // Calculate relevance based on term frequency and exact matching
  let relevance = 0;
  
  // Exact match bonus
  if (normalizedText.includes(normalizedQuery)) {
    relevance += 10;
  }
  
  // Term frequency
  queryTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      // Add relevance based on term appearance
      relevance += 3;
      
      // Add bonus for term at start of text (likely more relevant)
      if (normalizedText.startsWith(term)) {
        relevance += 5;
      }
    }
  });
  
  return relevance;
};

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
        description: item.description || '' // Map the description field
      })) as Product[];
      
      // Apply our own advanced ranking algorithm on the client side
      if (filters.query && filters.query.trim() !== '') {
        return products.sort((a, b) => {
          // Calculate text relevance scores
          const queryText = filters.query.trim();
          const aNameScore = calculateTextRelevance(a.name, queryText) * 2; // Name is most important
          const aDescScore = calculateTextRelevance(a.description || '', queryText); // Use optional chaining for description
          const aCategoryScore = calculateTextRelevance(a.category, queryText) * 1.5; // Category is also important
          
          const bNameScore = calculateTextRelevance(b.name, queryText) * 2;
          const bDescScore = calculateTextRelevance(b.description || '', queryText); // Use optional chaining for description
          const bCategoryScore = calculateTextRelevance(b.category, queryText) * 1.5;
          
          // Calculate popularity scores
          const aPopularityScore = (a.rating * 2) + (a.reviews * 0.1);
          const bPopularityScore = (b.rating * 2) + (b.reviews * 0.1);
          
          // Final scores combine relevance and popularity (70% relevance, 30% popularity)
          const aFinalScore = ((aNameScore + aDescScore + aCategoryScore) * 0.7) + (aPopularityScore * 0.3);
          const bFinalScore = ((bNameScore + bDescScore + bCategoryScore) * 0.7) + (bPopularityScore * 0.3);
          
          return bFinalScore - aFinalScore; // Sort by highest score
        });
      }
      
      // If no query or after sorting
      return products;
    },
    enabled: !!filters.query
  });
};
