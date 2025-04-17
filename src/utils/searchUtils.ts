
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

// Training dataset type definition
export interface TrainingExample {
  query: string;
  productId: number;
  isRelevant: boolean;
  clickPosition?: number;
}

// Model weights type definition
export interface ModelWeights {
  exactMatchWeight: number;
  bm25Weight: number;
  semanticWeight: number;
  popularityWeight: number;
  recencyWeight: number;
}

// Default model weights
const DEFAULT_WEIGHTS: ModelWeights = {
  exactMatchWeight: 3.0,
  bm25Weight: 2.0, 
  semanticWeight: 2.5,
  popularityWeight: 1.0,
  recencyWeight: 0.5
};

// Variable to store the trained model weights
let trainedWeights: ModelWeights = { ...DEFAULT_WEIGHTS };

/**
 * Save trained model to localStorage
 */
export const saveTrainedModel = (weights: ModelWeights): void => {
  try {
    localStorage.setItem('searchModelWeights', JSON.stringify(weights));
    console.log('Model weights saved successfully');
  } catch (err) {
    console.error('Failed to save model weights:', err);
  }
};

/**
 * Load trained model from localStorage
 */
export const loadTrainedModel = (): ModelWeights | null => {
  try {
    const savedWeights = localStorage.getItem('searchModelWeights');
    if (savedWeights) {
      return JSON.parse(savedWeights) as ModelWeights;
    }
    return null;
  } catch (err) {
    console.error('Failed to load model weights:', err);
    return null;
  }
};

/**
 * Feature extraction for the learning-to-rank model
 * Extracts features for a query-product pair
 */
export const extractFeatures = async (
  query: string,
  product: Product
): Promise<number[]> => {
  // Calculate BM25 scores
  const titleLength = (product.name || '').split(/\s+/).length;
  const descLength = (product.description || '').split(/\s+/).length;
  const categoryLength = (product.category || '').split(/\s+/).length;
  
  const titleBM25 = calculateBM25Score(
    query,
    product.name,
    titleLength,
    BM25_PARAMS.avgDocLength,
    BM25_PARAMS.k1,
    BM25_PARAMS.b
  );
  
  const descriptionBM25 = calculateBM25Score(
    query,
    product.description || '',
    descLength,
    BM25_PARAMS.avgDocLength,
    BM25_PARAMS.k1,
    BM25_PARAMS.b
  );
  
  const categoryBM25 = calculateBM25Score(
    query,
    product.category || '',
    categoryLength,
    BM25_PARAMS.avgDocLength,
    BM25_PARAMS.k1,
    BM25_PARAMS.b
  );
  
  // Calculate exact match signals
  const hasExactTitleMatch = product.name.toLowerCase().includes(query.toLowerCase());
  const hasExactCategoryMatch = (product.category || '').toLowerCase().includes(query.toLowerCase());
  
  // Calculate semantic similarity if embeddings are available
  let semanticSimilarity = 0;
  try {
    const queryEmbedding = await getEmbedding(query);
    if (queryEmbedding) {
      const productText = `${product.name} ${product.category || ''} ${product.description || ''}`;
      const productEmbedding = await getEmbedding(productText);
      if (productEmbedding) {
        semanticSimilarity = cosineSimilarity(queryEmbedding, productEmbedding);
      }
    }
  } catch (err) {
    console.error('Error calculating semantic similarity:', err);
  }
  
  // Return features as an array
  return [
    hasExactTitleMatch ? 1 : 0,
    hasExactCategoryMatch ? 1 : 0,
    titleBM25,
    descriptionBM25,
    categoryBM25,
    semanticSimilarity,
    product.rating || 0,
    product.reviews || 0,
    product.isOrganic ? 1 : 0,
    product.isLocal ? 1 : 0,
    product.isSeasonal ? 1 : 0
  ];
};

/**
 * Train the model using gradient descent
 * This is a simplified learning-to-rank model
 */
export const trainModel = async (
  trainingData: TrainingExample[],
  products: Product[],
  learningRate: number = 0.01,
  epochs: number = 50
): Promise<ModelWeights> => {
  console.log(`Starting model training with ${trainingData.length} examples`);
  
  // Initialize weights or load existing
  let weights = loadTrainedModel() || { ...DEFAULT_WEIGHTS };
  const productsMap = new Map<number, Product>();
  products.forEach(p => productsMap.set(p.id, p));
  
  // Training loop
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalLoss = 0;
    
    // Process each training example
    for (const example of trainingData) {
      const product = productsMap.get(example.productId);
      if (!product) continue;
      
      // Extract features
      const features = await extractFeatures(example.query, product);
      
      // Calculate predicted score
      const predictedScore = 
        features[0] * weights.exactMatchWeight + 
        features[2] * weights.bm25Weight +
        features[5] * weights.semanticWeight +
        features[6] * weights.popularityWeight +
        (features[8] + features[9] + features[10]) * weights.recencyWeight;
      
      // Calculate loss (using binary cross-entropy for relevance)
      const targetScore = example.isRelevant ? 1 : 0;
      const loss = Math.pow(predictedScore - targetScore, 2);
      totalLoss += loss;
      
      // Calculate gradients and update weights
      const gradientExactMatch = 2 * (predictedScore - targetScore) * features[0];
      const gradientBM25 = 2 * (predictedScore - targetScore) * features[2];
      const gradientSemantic = 2 * (predictedScore - targetScore) * features[5];
      const gradientPopularity = 2 * (predictedScore - targetScore) * features[6];
      const gradientRecency = 2 * (predictedScore - targetScore) * (features[8] + features[9] + features[10]);
      
      // Update weights
      weights.exactMatchWeight -= learningRate * gradientExactMatch;
      weights.bm25Weight -= learningRate * gradientBM25;
      weights.semanticWeight -= learningRate * gradientSemantic;
      weights.popularityWeight -= learningRate * gradientPopularity;
      weights.recencyWeight -= learningRate * gradientRecency;
      
      // Prevent negative weights
      weights.exactMatchWeight = Math.max(0.1, weights.exactMatchWeight);
      weights.bm25Weight = Math.max(0.1, weights.bm25Weight);
      weights.semanticWeight = Math.max(0.1, weights.semanticWeight);
      weights.popularityWeight = Math.max(0.1, weights.popularityWeight);
      weights.recencyWeight = Math.max(0.1, weights.recencyWeight);
    }
    
    // Log progress
    if (epoch % 10 === 0 || epoch === epochs - 1) {
      console.log(`Epoch ${epoch}, Loss: ${totalLoss / trainingData.length}`);
      console.log('Current weights:', weights);
    }
  }
  
  // Save the trained model
  saveTrainedModel(weights);
  trainedWeights = weights;
  
  return weights;
};

/**
 * Export training data to a file for local use
 */
export const exportTrainingData = (trainingData: TrainingExample[]): void => {
  const dataStr = JSON.stringify(trainingData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', dataUri);
  downloadLink.setAttribute('download', 'search-training-data.json');
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

/**
 * Import training data from a file
 */
export const importTrainingData = async (): Promise<TrainingExample[] | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        try {
          const content = readerEvent.target?.result as string;
          const data = JSON.parse(content) as TrainingExample[];
          resolve(data);
        } catch (err) {
          console.error('Error parsing training data:', err);
          resolve(null);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  });
};

/**
 * Comprehensive product ranking function that combines:
 * 1. BM25 text relevance
 * 2. Semantic similarity via embeddings
 * 3. Product popularity signals
 * 4. Business rules (featured products, etc)
 * 5. Trained model weights if available
 */
export const rankProducts = async (
  products: Product[], 
  query: string
): Promise<Product[]> => {
  if (!query || query.trim() === '' || products.length === 0) {
    return products;
  }
  
  const normalizedQuery = query.trim().toLowerCase();
  
  // Load trained weights if available
  const weights = loadTrainedModel() || trainedWeights || DEFAULT_WEIGHTS;
  console.log('Using model weights:', weights);
  
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
        exactMatchScore * weights.exactMatchWeight +
        bm25Score * weights.bm25Weight +
        semanticScore * weights.semanticWeight +
        popularityScore * weights.popularityWeight +
        businessRulesScore * weights.recencyWeight;
      
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
