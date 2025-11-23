export type BuyerPreferences = {
  favoriteCategories: string[];
  priceRange: { min: number; max: number };
  distanceRadius: number; // in meters
  searchHistory: string[];
  recentlyViewed: string[]; // offer IDs
};

export type CartItem = {
  offerId: string;
  title: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  addedAt: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  lastUpdated: string;
};

export type Order = {
  id: string;
  offerId: string;
  offerTitle: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryDate?: string;
  trackingNumber?: string;
};

export type Review = {
  id: string;
  offerId: string;
  offerTitle: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  sellerResponse?: string;
  helpful: number;
  verified: boolean;
};

export type ProductReview = {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
  sellerResponse?: string;
};

export type ProductDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUri?: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  distanceMeters: number;
  views: number;
  likes: number;
  inStock: boolean;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  averageRating: number;
  reviewCount: number;
  createdAt: string;
};

export type SearchFilter = {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  maxDistance?: number;
  minRating?: number;
  sortBy?: 'recent' | 'price-low' | 'price-high' | 'rating' | 'distance';
};

export type BuyerNotification = {
  id: string;
  type: 'new-offer' | 'price-drop' | 'seller-response' | 'order-update' | 'review-request';
  title: string;
  body: string;
  offerId?: string;
  orderId?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
};

export type SavedSearch = {
  id: string;
  query: string;
  filters: SearchFilter;
  createdAt: string;
  lastUsed: string;
  resultCount: number;
};
