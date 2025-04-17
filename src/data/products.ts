
import { Product } from "@/components/ProductCard";

// Sample products data
export const products: Product[] = [
  {
    id: 1,
    name: "Organic Heirloom Tomatoes",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 101,
      name: "Green Valley Farm",
      location: "San Francisco, CA"
    },
    rating: 4.8,
    reviews: 124,
    isOrganic: true,
    isLocal: true,
    isSeasonal: true,
    category: "Vegetables",
    stock: 45
  },
  {
    id: 2,
    name: "Fresh Strawberries - 1lb Box",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 102,
      name: "Berry Good Farms",
      location: "Santa Cruz, CA"
    },
    rating: 4.9,
    reviews: 87,
    isOrganic: true,
    isLocal: true,
    isSeasonal: true,
    category: "Fruits",
    stock: 32
  },
  {
    id: 3,
    name: "Grassfed Whole Milk - 1 Gallon",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1563636619-38b8f0501a65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 103,
      name: "Happy Cow Dairy",
      location: "Petaluma, CA"
    },
    rating: 4.7,
    reviews: 56,
    isOrganic: true,
    isLocal: true,
    isSeasonal: false,
    category: "Dairy",
    stock: 18
  },
  {
    id: 4,
    name: "Pasture-Raised Eggs - Dozen",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 104,
      name: "Sunshine Acres",
      location: "Napa, CA"
    },
    rating: 4.9,
    reviews: 42,
    isOrganic: true,
    isLocal: true,
    isSeasonal: false,
    category: "Meat & Eggs",
    stock: 24
  },
  {
    id: 5,
    name: "Raw Wildflower Honey - 16oz Jar",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 105,
      name: "Sweet Bee Apiary",
      location: "Sonoma, CA"
    },
    rating: 5.0,
    reviews: 68,
    isOrganic: true,
    isLocal: true,
    isSeasonal: false,
    category: "Honey & Preserves",
    stock: 15
  },
  {
    id: 6,
    name: "Fresh Basil Bunch",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1527458263294-39c37c60990a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 106,
      name: "Herbal Haven",
      location: "Berkeley, CA"
    },
    rating: 4.6,
    reviews: 29,
    isOrganic: true,
    isLocal: true,
    isSeasonal: true,
    category: "Herbs & Spices",
    stock: 40
  },
  {
    id: 7,
    name: "Artisanal Sourdough Bread",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 107,
      name: "Golden Grain Bakery",
      location: "San Francisco, CA"
    },
    rating: 4.8,
    reviews: 105,
    isOrganic: false,
    isLocal: true,
    isSeasonal: false,
    category: "Specialty Items",
    stock: 12
  },
  {
    id: 8,
    name: "Fresh Avocados - Pack of 4",
    price: 6.49,
    image: "https://images.unsplash.com/photo-1601039641847-7857b994d704?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    farmer: {
      id: 108,
      name: "Coastal Grove Orchard",
      location: "Santa Barbara, CA"
    },
    rating: 4.7,
    reviews: 63,
    isOrganic: true,
    isLocal: true,
    isSeasonal: true,
    category: "Fruits",
    stock: 28
  }
];

// Function to get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter((_, index) => index < 4);
};

// Function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Function to get recommended products based on a product
export const getRecommendedProducts = (productId: number): Product[] => {
  const currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return [];
  
  // Simple recommendation algorithm based on category and tags
  return products
    .filter(p => p.id !== productId)
    .filter(p => p.category === currentProduct.category || 
                (p.isOrganic === currentProduct.isOrganic && 
                 p.isLocal === currentProduct.isLocal))
    .slice(0, 4);
};

// Function to search products
export const searchProducts = (query: string): Product[] => {
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery) ||
    product.farmer.name.toLowerCase().includes(lowerCaseQuery)
  );
};
