
import { pipeline } from "@huggingface/transformers";
import { Product } from "@/components/ProductCard";

// Cache for embeddings to avoid recalculating
const embeddingCache = new Map<string, number[]>();

/**
 * BM25 parameters
 * k1: Term frequency saturation parameter (between 1.2-2.0 is common)
 * b: Length normalization parameter (0.75 is common)
 */
const BM25_PARAMS = {
  k1: 1.5,
  b: 0.75,
  avgDocLength: 20, // Average document length (will be calculated dynamically)
};

/**
 * Weighting for hybrid search
 */
const SEARCH_WEIGHTS = {
  exactMatch: 3.0,     // Exact match weight
  bm25Score: 2.0,      // BM25 text relevance weight
  semanticScore: 2.5,  // Semantic embedding similarity weight
  popularityScore: 1.0, // Popularity features weight
  recencyBoost: 0.5,   // Recency boost weight
};

/**
 * Initialize the transformer model for embeddings
 * We're using a small, efficient model designed for embedding
 */
let embeddingModel: any = null;

export const initEmbeddingModel = async (): Promise<void> => {
  try {
    console.log("Initializing embedding model...");
    embeddingModel = await pipeline(
      "feature-extraction",
      "mixedbread-ai/mxbai-embed-xsmall-v1",
      { device: "cpu" } // Removed the quantized property which is not in the type definition
    );
    console.log("Embedding model initialized successfully");
  } catch (error) {
    console.error("Error initializing embedding model:", error);
    // Fallback to basic search if model fails to load
    embeddingModel = null;
  }
};

/**
 * Calculate semantic embedding for a text string
 */
export const getEmbedding = async (text: string): Promise<number[] | null> => {
  if (!text) return null;
  
  // Check cache first
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  
  if (!embeddingModel) {
    try {
      await initEmbeddingModel();
    } catch (err) {
      console.error("Failed to initialize embedding model:", err);
      return null;
    }
  }
  
  try {
    const result = await embeddingModel(text, { 
      pooling: "mean", 
      normalize: true 
    });
    
    // Convert to simple array and cache with explicit type assertion
    const embedding = Array.from(result.data) as number[];
    embeddingCache.set(text, embedding);
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

/**
 * Calculate cosine similarity between two embedding vectors
 */
export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (!a || !b || a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }
  
  aMagnitude = Math.sqrt(aMagnitude);
  bMagnitude = Math.sqrt(bMagnitude);
  
  if (aMagnitude === 0 || bMagnitude === 0) return 0;
  
  return dotProduct / (aMagnitude * bMagnitude);
};

/**
 * Calculate BM25 score for text relevance
 * BM25 is an improvement over TF-IDF and is used by search engines
 */
export const calculateBM25Score = (
  query: string, 
  fieldText: string, 
  docLength: number,
  avgDocLength: number = BM25_PARAMS.avgDocLength,
  k1: number = BM25_PARAMS.k1,
  b: number = BM25_PARAMS.b
): number => {
  if (!query || !fieldText) return 0;
  
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const docTerms = fieldText.toLowerCase().split(/\s+/);
  
  // Skip empty queries or documents
  if (queryTerms.length === 0 || docTerms.length === 0) return 0;
  
  let score = 0;
  
  for (const term of queryTerms) {
    // Count term frequency in document
    const tf = docTerms.filter(t => t === term).length;
    if (tf === 0) continue;
    
    // Calculate normalized term frequency with BM25 formula
    const normalizedTf = (tf * (k1 + 1)) / 
      (tf + k1 * (1 - b + b * (docLength / avgDocLength)));
    
    // We don't have IDF from the corpus, so we use a simplified approach
    // In a real system, we would calculate IDF across all documents
    const idf = 1.0;
    
    score += normalizedTf * idf;
  }
  
  return score;
};

/**
 * Comprehensive product ranking function that combines:
 * 1. BM25 text relevance
 * 2. Semantic similarity via embeddings
 * 3. Product popularity signals
 * 4. Business rules (featured products, etc)
 */
export const rankProducts = async (
  products: Product[], 
  query: string
): Promise<Product[]> => {
  if (!query || query.trim() === '' || products.length === 0) {
    return products;
  }
  
  const normalizedQuery = query.trim().toLowerCase();
  
  // Calculate average document length for BM25
  const totalLength = products.reduce((sum, product) => {
    const docLength = (product.name || '').split(/\s+/).length + 
      (product.description || '').split(/\s+/).length +
      (product.category || '').split(/\s+/).length;
    return sum + docLength;
  }, 0);
  
  BM25_PARAMS.avgDocLength = totalLength / products.length;
  
  // Generate embedding for query (async)
  let queryEmbedding: number[] | null = null;
  try {
    queryEmbedding = await getEmbedding(normalizedQuery);
  } catch (err) {
    console.log("Could not generate embedding for query, falling back to text search");
  }
  
  // Pre-calculate product embeddings
  const productScores = await Promise.all(
    products.map(async (product) => {
      // 1. Exact match signals
      const hasExactTitleMatch = product.name.toLowerCase().includes(normalizedQuery);
      const hasExactCategoryMatch = (product.category || '').toLowerCase().includes(normalizedQuery);
      const exactMatchScore = 
        (hasExactTitleMatch ? 10 : 0) + 
        (hasExactCategoryMatch ? 5 : 0);
      
      // 2. Calculate BM25 scores for different fields
      const titleLength = (product.name || '').split(/\s+/).length;
      const descLength = (product.description || '').split(/\s+/).length;
      const categoryLength = (product.category || '').split(/\s+/).length;
      
      const titleBM25 = calculateBM25Score(
        normalizedQuery, 
        product.name, 
        titleLength,
        BM25_PARAMS.avgDocLength,
        BM25_PARAMS.k1,
        BM25_PARAMS.b
      ) * 2.5; // Title has higher weight
      
      const descriptionBM25 = calculateBM25Score(
        normalizedQuery, 
        product.description || '', 
        descLength,
        BM25_PARAMS.avgDocLength,
        BM25_PARAMS.k1,
        BM25_PARAMS.b
      );
      
      const categoryBM25 = calculateBM25Score(
        normalizedQuery, 
        product.category || '', 
        categoryLength,
        BM25_PARAMS.avgDocLength,
        BM25_PARAMS.k1,
        BM25_PARAMS.b
      ) * 1.5; // Category has medium weight
      
      const bm25Score = titleBM25 + descriptionBM25 + categoryBM25;
      
      // 3. Semantic similarity via embeddings
      let semanticScore = 0;
      if (queryEmbedding) {
        try {
          // Combine all product text for embedding
          const productText = `${product.name} ${product.category || ''} ${product.description || ''}`;
          const productEmbedding = await getEmbedding(productText);
          
          if (productEmbedding) {
            semanticScore = cosineSimilarity(queryEmbedding, productEmbedding) * 100;
          }
        } catch (err) {
          // If embedding fails, continue with other signals
          console.log("Embedding calculation failed for product:", product.id);
        }
      }
      
      // 4. Popularity signals
      const popularityScore = (product.rating || 0) * 20 + (product.reviews || 0) * 0.1;
      
      // 5. Business rules - organic/local/seasonal products get a small boost
      const businessRulesScore = 
        (product.isOrganic ? 5 : 0) + 
        (product.isLocal ? 3 : 0) + 
        (product.isSeasonal ? 2 : 0);
      
      // Calculate final score
      const finalScore = 
        exactMatchScore * SEARCH_WEIGHTS.exactMatch +
        bm25Score * SEARCH_WEIGHTS.bm25Score +
        semanticScore * SEARCH_WEIGHTS.semanticScore +
        popularityScore * SEARCH_WEIGHTS.popularityScore +
        businessRulesScore;
      
      return {
        product,
        score: finalScore,
        debug: {
          exactMatchScore,
          bm25Score,
          semanticScore,
          popularityScore,
          businessRulesScore,
          finalScore
        }
      };
    })
  );
  
  // Sort by final score (descending)
  productScores.sort((a, b) => b.score - a.score);
  
  // Return sorted products
  return productScores.map(item => item.product);
};
