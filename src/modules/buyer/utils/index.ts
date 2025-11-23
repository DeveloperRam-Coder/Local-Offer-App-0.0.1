// Buyer utility functions

export const calculateAverageRating = (reviews: any[]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export const filterOffersByPrice = (offers: any[], minPrice: number, maxPrice: number) => {
  return offers.filter((o) => o.price >= minPrice && o.price <= maxPrice);
};

export const filterOffersByDistance = (offers: any[], maxDistance: number) => {
  return offers.filter((o) => (o.distanceMeters || 0) <= maxDistance);
};

export const sortOffers = (offers: any[], sortBy: string) => {
  const sorted = [...offers];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'distance':
      return sorted.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'recent':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export const calculateCartTotal = (items: any[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  return { subtotal, tax, total: subtotal + tax };
};

export const calculateDiscount = (originalPrice: number, discountPercent: number) => {
  return (originalPrice * (1 - discountPercent / 100)).toFixed(2);
};

export const generateMockReviews = (): any[] => [
  {
    id: 'r-1',
    buyerName: 'John Doe',
    rating: 5,
    comment: 'Excellent product! Exactly as described.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    helpful: 23,
    verified: true,
  },
  {
    id: 'r-2',
    buyerName: 'Jane Smith',
    rating: 4,
    comment: 'Good quality, but took longer to receive.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    helpful: 15,
    verified: true,
  },
  {
    id: 'r-3',
    buyerName: 'Bob Johnson',
    rating: 5,
    comment: 'Fast delivery and great communication!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    helpful: 31,
    verified: true,
  },
];

export const generateMockOrders = (): any[] => [
  {
    id: 'o-1',
    offerId: '1',
    offerTitle: 'Fresh Avocados (1kg)',
    price: 4.99,
    quantity: 2,
    sellerId: 's-1',
    sellerName: 'Local Seller',
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    deliveryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    trackingNumber: 'TRACK-123456',
  },
  {
    id: 'o-2',
    offerId: '2',
    offerTitle: 'Handmade Wallet',
    price: 24.0,
    quantity: 1,
    sellerId: 's-2',
    sellerName: 'Crafts Store',
    status: 'shipped',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    trackingNumber: 'TRACK-789012',
  },
  {
    id: 'o-3',
    offerId: '3',
    offerTitle: 'Cheddar Cheese (500g)',
    price: 8.5,
    quantity: 3,
    sellerId: 's-1',
    sellerName: 'Local Seller',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

export const generateMockCart = (): any => ({
  items: [
    {
      offerId: '1',
      title: 'Fresh Avocados (1kg)',
      price: 4.99,
      quantity: 2,
      sellerId: 's-1',
      sellerName: 'Local Seller',
      addedAt: new Date().toISOString(),
    },
    {
      offerId: '2',
      title: 'Handmade Wallet',
      price: 24.0,
      quantity: 1,
      sellerId: 's-2',
      sellerName: 'Crafts Store',
      addedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
  subtotal: 33.98,
  tax: 2.72,
  total: 36.70,
  lastUpdated: new Date().toISOString(),
});

export const generateMockNotifications = (): any[] => [
  {
    id: 'n-1',
    type: 'new-offer',
    title: 'New offer matching your interests!',
    body: 'Fresh organic vegetables just listed nearby',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n-2',
    type: 'price-drop',
    title: 'Price dropped on a saved item',
    body: 'Handmade Wallet reduced from $30 to $24',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: 'n-3',
    type: 'order-update',
    title: 'Your order has shipped!',
    body: 'Order #o-2 is on its way',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
  },
];

export const generateMockPreferences = (): any => ({
  favoriteCategories: ['Fresh Produce', 'Handmade', 'Electronics'],
  priceRange: { min: 0, max: 100 },
  distanceRadius: 5000,
  searchHistory: ['avocados', 'wallet', 'cheese', 'organic'],
  recentlyViewed: ['1', '2', '3'],
});

export const categories = [
  'All',
  'Fresh Produce',
  'Handmade',
  'Electronics',
  'Books',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Toys',
];

export const conditions = ['New', 'Like-New', 'Good', 'Fair'];

export const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
