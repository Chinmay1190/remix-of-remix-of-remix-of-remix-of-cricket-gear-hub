export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  badge?: 'new' | 'sale' | 'hot';
  description: string;
  specifications: {
    [key: string]: string;
  };
  playerLevel: 'beginner' | 'intermediate' | 'professional';
  willowType?: 'english' | 'kashmir';
  inStock: boolean;
  stockCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  playerLevel: string[];
  willowType: string[];
  category: string;
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
