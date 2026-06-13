/**
 * LocalOffer — Complete In-Memory Data Store
 * Full CRUD for: Offers, Orders, Reviews, Conversations, Messages, Users
 * All operations simulate async network delay and return typed results.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type OfferStatus = 'active' | 'sold' | 'inactive' | 'draft';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  category: string;
  subcategory?: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  tags: string[];
  condition: string;
  warranty?: string | null;
  shipping: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  status: OfferStatus;
  views: number;
  distanceMeters?: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  offerId: string;
  offerTitle: string;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
}

export interface Review {
  id: string;
  offerId: string;
  offerTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  offerId?: string;
  offerTitle?: string;
  lastMessage: string;
  lastAt: string;
  unreadCount: number;
  messageCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  fromId: string;
  fromName: string;
  toId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'new-offer' | 'price-drop' | 'order-update' | 'message' | 'review';
  title: string;
  body: string;
  relatedId?: string;
  timestamp: string;
  read: boolean;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_OFFERS: Offer[] = [
  {
    id: 'offer_1', title: 'iPhone 15 Pro Max',
    description: 'Latest Apple flagship with advanced camera and A17 Pro chip. 256GB titanium.',
    price: 1199.99, originalPrice: 1299.99, discount: '8%',
    category: 'Electronics', subcategory: 'Smartphones',
    sellerId: 'seller_1', sellerName: 'Tech Deals Hub',
    rating: 4.9, reviewCount: 234, stock: 45,
    images: ['https://via.placeholder.com/400x400/1E293B/38BDF8?text=iPhone+15'],
    tags: ['smartphone', 'apple', '5g', 'camera'],
    condition: 'New', warranty: '1 year', shipping: 'Free',
    createdAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z',
    featured: true, status: 'active', views: 1250, distanceMeters: 2500,
  },
  {
    id: 'offer_2', title: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-cancelling wireless headphones. 30hr battery. Multi-device pairing.',
    price: 399.99, originalPrice: 449.99, discount: '11%',
    category: 'Electronics', subcategory: 'Audio',
    sellerId: 'seller_1', sellerName: 'Tech Deals Hub',
    rating: 4.8, reviewCount: 156, stock: 78,
    images: ['https://via.placeholder.com/400x400/1E293B/38BDF8?text=Sony+XM5'],
    tags: ['audio', 'headphones', 'wireless', 'noise-cancelling'],
    condition: 'New', warranty: '2 years', shipping: 'Free',
    createdAt: '2024-10-28T09:00:00Z', updatedAt: '2024-10-28T09:00:00Z',
    featured: true, status: 'active', views: 890, distanceMeters: 2500,
  },
  {
    id: 'offer_3', title: 'Nike Air Max 90',
    description: 'Classic Nike running shoes. Lightweight mesh upper. Available sizes 7–13.',
    price: 129.99, originalPrice: 150.00, discount: '13%',
    category: 'Sports', subcategory: 'Footwear',
    sellerId: 'seller_4', sellerName: 'Sports Equipment Store',
    rating: 4.7, reviewCount: 89, stock: 156,
    images: ['https://via.placeholder.com/400x400/1E293B/F97316?text=Nike+AM90'],
    tags: ['shoes', 'nike', 'sports', 'comfortable'],
    condition: 'New', warranty: null, shipping: 'Free',
    createdAt: '2024-11-05T08:00:00Z', updatedAt: '2024-11-05T08:00:00Z',
    featured: false, status: 'active', views: 432, distanceMeters: 5000,
  },
  {
    id: 'offer_4', title: 'Modern Sectional Sofa',
    description: 'L-shaped sectional sofa, stain-resistant fabric. Available in grey and navy.',
    price: 899.99, originalPrice: 1199.99, discount: '25%',
    category: 'Home & Garden', subcategory: 'Furniture',
    sellerId: 'seller_3', sellerName: 'Home & Garden Pro',
    rating: 4.6, reviewCount: 67, stock: 12,
    images: ['https://via.placeholder.com/400x400/1E293B/34D399?text=Sofa'],
    tags: ['furniture', 'sofa', 'home', 'modern'],
    condition: 'New', warranty: '5 years', shipping: 'Delivery',
    createdAt: '2024-10-20T12:00:00Z', updatedAt: '2024-10-20T12:00:00Z',
    featured: true, status: 'active', views: 320, distanceMeters: 8000,
  },
  {
    id: 'offer_5', title: 'Samsung 55" 4K Smart TV',
    description: 'QLED 4K with HDR10+, 120Hz, built-in Alexa. Wall-mount bracket included.',
    price: 649.99, originalPrice: 899.99, discount: '28%',
    category: 'Electronics', subcategory: 'Television',
    sellerId: 'seller_1', sellerName: 'Tech Deals Hub',
    rating: 4.8, reviewCount: 145, stock: 23,
    images: ['https://via.placeholder.com/400x400/1E293B/38BDF8?text=Samsung+TV'],
    tags: ['tv', '4k', 'smart', 'samsung'],
    condition: 'New', warranty: '3 years', shipping: 'Delivery',
    createdAt: '2024-11-02T11:00:00Z', updatedAt: '2024-11-02T11:00:00Z',
    featured: true, status: 'active', views: 670, distanceMeters: 2500,
  },
  {
    id: 'offer_6', title: "Women's Summer Dress",
    description: 'Elegant floral print dress. 95% cotton. Perfect for beach or casual outings.',
    price: 49.99, originalPrice: 79.99, discount: '37%',
    category: 'Fashion', subcategory: 'Clothing',
    sellerId: 'seller_2', sellerName: 'Fashion Forward',
    rating: 4.5, reviewCount: 56, stock: 234,
    images: ['https://via.placeholder.com/400x400/1E293B/F97316?text=Summer+Dress'],
    tags: ['dress', 'women', 'fashion', 'summer'],
    condition: 'New', warranty: null, shipping: 'Free',
    createdAt: '2024-11-05T14:00:00Z', updatedAt: '2024-11-05T14:00:00Z',
    featured: true, status: 'active', views: 780, distanceMeters: 3000,
  },
  {
    id: 'offer_7', title: 'Fresh Organic Avocados (1kg)',
    description: 'Farm-fresh Hass avocados. Delivered within 24 hours. Rich in healthy fats.',
    price: 4.99, originalPrice: 6.99, discount: '29%',
    category: 'Fresh Produce', subcategory: 'Fruits',
    sellerId: 's-1', sellerName: 'Local Farm Market',
    rating: 4.7, reviewCount: 124, stock: 200,
    images: ['https://via.placeholder.com/400x400/1E293B/34D399?text=Avocados'],
    tags: ['fresh', 'organic', 'avocado', 'healthy'],
    condition: 'Fresh', warranty: null, shipping: 'Same Day',
    createdAt: '2024-11-06T07:00:00Z', updatedAt: '2024-11-06T07:00:00Z',
    featured: false, status: 'active', views: 340, distanceMeters: 1200,
  },
  {
    id: 'offer_8', title: 'Handmade Leather Wallet',
    description: 'Hand-stitched genuine leather wallet. 8 card slots, coin pocket. Personalized engraving available.',
    price: 39.99, originalPrice: 55.00, discount: '27%',
    category: 'Handmade', subcategory: 'Accessories',
    sellerId: 's-1', sellerName: 'Local Farm Market',
    rating: 4.9, reviewCount: 88, stock: 50,
    images: ['https://via.placeholder.com/400x400/1E293B/F97316?text=Wallet'],
    tags: ['handmade', 'leather', 'wallet', 'gift'],
    condition: 'Handcrafted', warranty: null, shipping: 'Free',
    createdAt: '2024-11-04T15:00:00Z', updatedAt: '2024-11-04T15:00:00Z',
    featured: false, status: 'active', views: 210, distanceMeters: 1200,
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: 'order_1', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_1', sellerName: 'Tech Deals Hub',
    offerId: 'offer_1', offerTitle: 'iPhone 15 Pro Max',
    quantity: 1, price: 1199.99, total: 1199.99,
    status: 'delivered', createdAt: '2024-10-15T10:00:00Z', updatedAt: '2024-10-22T14:00:00Z',
    deliveredAt: '2024-10-22T14:00:00Z', trackingNumber: 'TRK123456789',
    shippingAddress: '123 Main St, San Francisco, CA 94105', paymentMethod: 'Credit Card',
  },
  {
    id: 'order_2', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_1', sellerName: 'Tech Deals Hub',
    offerId: 'offer_2', offerTitle: 'Sony WH-1000XM5 Headphones',
    quantity: 1, price: 399.99, total: 399.99,
    status: 'shipped', createdAt: '2024-11-01T09:00:00Z', updatedAt: '2024-11-02T11:00:00Z',
    shippedAt: '2024-11-02T11:00:00Z', trackingNumber: 'TRK987654321',
    shippingAddress: '123 Main St, San Francisco, CA 94105', paymentMethod: 'PayPal',
  },
  {
    id: 'order_3', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_4', sellerName: 'Sports Equipment Store',
    offerId: 'offer_3', offerTitle: 'Nike Air Max 90',
    quantity: 1, price: 129.99, total: 129.99,
    status: 'confirmed', createdAt: '2024-11-04T08:00:00Z', updatedAt: '2024-11-04T10:00:00Z',
    shippingAddress: '123 Main St, San Francisco, CA 94105', paymentMethod: 'Apple Pay',
  },
  {
    id: 'order_4', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_3', sellerName: 'Home & Garden Pro',
    offerId: 'offer_4', offerTitle: 'Modern Sectional Sofa',
    quantity: 1, price: 899.99, total: 899.99,
    status: 'pending', createdAt: '2024-11-05T12:00:00Z', updatedAt: '2024-11-05T12:00:00Z',
    shippingAddress: '123 Main St, San Francisco, CA 94105', paymentMethod: 'Credit Card',
  },
  {
    id: 'order_5', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_2', sellerName: 'Fashion Forward',
    offerId: 'offer_6', offerTitle: "Women's Summer Dress",
    quantity: 2, price: 49.99, total: 99.98,
    status: 'cancelled', createdAt: '2024-10-28T16:00:00Z', updatedAt: '2024-10-29T09:00:00Z',
    shippingAddress: '123 Main St, San Francisco, CA 94105', paymentMethod: 'Credit Card',
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'review_1', offerId: 'offer_1', offerTitle: 'iPhone 15 Pro Max',
    buyerId: 'buyer_1', buyerName: 'John Smith', sellerId: 'seller_1',
    rating: 5, title: 'Excellent product! Highly recommend',
    comment: 'Great phone with amazing camera quality. Delivery was fast and packaging was excellent.',
    verified: true, helpful: 24, createdAt: '2024-10-25T10:00:00Z',
  },
  {
    id: 'review_2', offerId: 'offer_2', offerTitle: 'Sony WH-1000XM5 Headphones',
    buyerId: 'buyer_3', buyerName: 'Mike Chen', sellerId: 'seller_1',
    rating: 5, title: 'Best headphones ever',
    comment: 'Sound quality is incredible. Noise cancellation works perfectly. Battery life is amazing.',
    verified: true, helpful: 45, createdAt: '2024-11-05T14:00:00Z',
  },
  {
    id: 'review_3', offerId: 'offer_3', offerTitle: 'Nike Air Max 90',
    buyerId: 'buyer_5', buyerName: 'Alex Rodriguez', sellerId: 'seller_4',
    rating: 4, title: 'Comfortable but pricey',
    comment: 'Great shoes, very comfortable. Quality is good but price is a bit high for the current market.',
    verified: true, helpful: 12, createdAt: '2024-11-04T09:00:00Z',
  },
  {
    id: 'review_4', offerId: 'offer_7', offerTitle: 'Fresh Organic Avocados (1kg)',
    buyerId: 'b-1', buyerName: 'Buyer Demo', sellerId: 's-1',
    rating: 5, title: 'Fresh and delicious!',
    comment: 'Arrived perfectly ripe. Will definitely order again. Excellent quality for the price.',
    verified: true, helpful: 18, createdAt: '2024-11-06T08:00:00Z',
  },
];

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_1', sellerName: 'Tech Deals Hub',
    offerId: 'offer_1', offerTitle: 'iPhone 15 Pro Max',
    lastMessage: 'Yes, we have 45 units in stock! We ship within 24 hours.',
    lastAt: '2024-11-05T10:45:00Z', unreadCount: 2, messageCount: 4,
  },
  {
    id: 'conv_2', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_4', sellerName: 'Sports Equipment Store',
    offerId: 'offer_3', offerTitle: 'Nike Air Max 90',
    lastMessage: 'Size 10 is available. Want me to reserve it?',
    lastAt: '2024-11-04T16:30:00Z', unreadCount: 0, messageCount: 3,
  },
  {
    id: 'conv_3', buyerId: 'b-1', buyerName: 'Buyer Demo',
    sellerId: 'seller_2', sellerName: 'Fashion Forward',
    offerId: 'offer_6', offerTitle: "Women's Summer Dress",
    lastMessage: 'Your order has been shipped!',
    lastAt: '2024-11-02T12:40:00Z', unreadCount: 0, messageCount: 5,
  },
];

const SEED_MESSAGES: Message[] = [
  { id: 'msg_1', conversationId: 'conv_1', fromId: 'b-1', fromName: 'Buyer Demo', toId: 'seller_1', text: 'Hi, is this product still available?', createdAt: '2024-11-05T10:30:00Z', read: true },
  { id: 'msg_2', conversationId: 'conv_1', fromId: 'seller_1', fromName: 'Tech Deals Hub', toId: 'b-1', text: 'Yes, we have 45 units in stock!', createdAt: '2024-11-05T10:35:00Z', read: true },
  { id: 'msg_3', conversationId: 'conv_1', fromId: 'b-1', fromName: 'Buyer Demo', toId: 'seller_1', text: 'Great! What is the delivery time to SF?', createdAt: '2024-11-05T10:40:00Z', read: true },
  { id: 'msg_4', conversationId: 'conv_1', fromId: 'seller_1', fromName: 'Tech Deals Hub', toId: 'b-1', text: 'We ship within 24 hours. Free shipping to SF!', createdAt: '2024-11-05T10:45:00Z', read: false },
  { id: 'msg_5', conversationId: 'conv_2', fromId: 'b-1', fromName: 'Buyer Demo', toId: 'seller_4', text: 'Do you have size 10?', createdAt: '2024-11-04T16:20:00Z', read: true },
  { id: 'msg_6', conversationId: 'conv_2', fromId: 'seller_4', fromName: 'Sports Equipment Store', toId: 'b-1', text: 'Size 10 is available. Want me to reserve it?', createdAt: '2024-11-04T16:30:00Z', read: true },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 'notif_1', userId: 'b-1', type: 'order-update', title: 'Order Shipped!', body: 'Your Sony headphones order #order_2 has shipped. Track: TRK987654321', relatedId: 'order_2', timestamp: '2024-11-02T11:00:00Z', read: false },
  { id: 'notif_2', userId: 'b-1', type: 'message', title: 'New Message', body: 'Tech Deals Hub: "We ship within 24 hours. Free shipping to SF!"', relatedId: 'conv_1', timestamp: '2024-11-05T10:45:00Z', read: false },
  { id: 'notif_3', userId: 'b-1', type: 'new-offer', title: 'New Deal Near You', body: 'Fresh Organic Avocados listed 1.2km away — only $4.99!', relatedId: 'offer_7', timestamp: '2024-11-06T07:00:00Z', read: false },
  { id: 'notif_4', userId: 'b-1', type: 'price-drop', title: 'Price Drop Alert', body: 'Samsung 55" TV dropped from $899 to $649 — save $250!', relatedId: 'offer_5', timestamp: '2024-11-03T09:00:00Z', read: true },
  { id: 'notif_5', userId: 's-1', type: 'order-update', title: 'New Order Received', body: 'Buyer Demo placed an order for Fresh Organic Avocados', relatedId: 'order_4', timestamp: '2024-11-05T12:00:00Z', read: false },
  { id: 'notif_6', userId: 's-1', type: 'review', title: 'New Review', body: 'Buyer Demo left a 5-star review on "Fresh Organic Avocados"', relatedId: 'review_4', timestamp: '2024-11-06T08:00:00Z', read: false },
  { id: 'notif_7', userId: 's-1', type: 'message', title: 'New Message', body: 'Buyer Demo: "Hi, is this product still available?"', relatedId: 'conv_1', timestamp: '2024-11-05T10:30:00Z', read: true },
];

// ─── In-Memory Store ──────────────────────────────────────────────────────────

let _offers: Offer[] = [...SEED_OFFERS];
let _orders: Order[] = [...SEED_ORDERS];
let _reviews: Review[] = [...SEED_REVIEWS];
let _conversations: Conversation[] = [...SEED_CONVERSATIONS];
let _messages: Message[] = [...SEED_MESSAGES];
let _notifications: AppNotification[] = [...SEED_NOTIFICATIONS];

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));
const uid = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString();

// ─── Offer Store ─────────────────────────────────────────────────────────────

export const OfferStore = {
  getAll: async (): Promise<Offer[]> => { await delay(); return [..._offers]; },

  getById: async (id: string): Promise<Offer | undefined> => {
    await delay();
    const o = _offers.find((x) => x.id === id);
    if (o) { o.views = (o.views || 0) + 1; }
    return o ? { ...o } : undefined;
  },

  getBySeller: async (sellerId: string): Promise<Offer[]> => {
    await delay();
    return _offers.filter((o) => o.sellerId === sellerId).map((o) => ({ ...o }));
  },

  search: async (query: string, category?: string): Promise<Offer[]> => {
    await delay();
    const q = query.toLowerCase();
    return _offers.filter((o) => {
      const matchQ = !q || o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q) || o.tags.some((t) => t.toLowerCase().includes(q));
      const matchC = !category || category === 'all' || o.category === category;
      return matchQ && matchC;
    });
  },

  create: async (data: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'views' | 'status' | 'sellerId' | 'sellerName'> & Pick<Offer, 'sellerId' | 'sellerName'>): Promise<Offer> => {
    await delay(500);
    const offer: Offer = { ...data, id: uid('offer'), createdAt: now(), updatedAt: now(), rating: 0, reviewCount: 0, views: 0, status: 'active' };
    _offers.unshift(offer);
    return { ...offer };
  },

  update: async (id: string, data: Partial<Omit<Offer, 'id' | 'createdAt'>>): Promise<Offer> => {
    await delay(400);
    const idx = _offers.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Offer ${id} not found`);
    _offers[idx] = { ..._offers[idx], ...data, updatedAt: now() };
    return { ..._offers[idx] };
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const idx = _offers.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Offer ${id} not found`);
    _offers.splice(idx, 1);
  },

  toggleStatus: async (id: string): Promise<Offer> => {
    await delay(300);
    const idx = _offers.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Offer ${id} not found`);
    const current = _offers[idx].status;
    const next: OfferStatus = current === 'active' ? 'inactive' : 'active';
    _offers[idx] = { ..._offers[idx], status: next, updatedAt: now() };
    return { ..._offers[idx] };
  },
};

// ─── Order Store ─────────────────────────────────────────────────────────────

export const OrderStore = {
  getAll: async (): Promise<Order[]> => { await delay(); return [..._orders]; },

  getById: async (id: string): Promise<Order | undefined> => {
    await delay();
    return _orders.find((o) => o.id === id) ? { ..._orders.find((o) => o.id === id)! } : undefined;
  },

  getByBuyer: async (buyerId: string): Promise<Order[]> => {
    await delay();
    return _orders.filter((o) => o.buyerId === buyerId).map((o) => ({ ...o })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getBySeller: async (sellerId: string): Promise<Order[]> => {
    await delay();
    return _orders.filter((o) => o.sellerId === sellerId).map((o) => ({ ...o })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> => {
    await delay(600);
    const order: Order = { ...data, id: uid('order'), status: 'pending', createdAt: now(), updatedAt: now() };
    _orders.unshift(order);
    // Auto-add notification
    _notifications.unshift({
      id: uid('notif'), userId: data.buyerId, type: 'order-update',
      title: 'Order Placed!', body: `Order for "${data.offerTitle}" confirmed. We'll notify you when it ships.`,
      relatedId: order.id, timestamp: now(), read: false,
    });
    return { ...order };
  },

  update: async (id: string, data: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<Order> => {
    await delay(400);
    const idx = _orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Order ${id} not found`);
    const updates: Partial<Order> = { ...data, updatedAt: now() };
    if (data.status === 'shipped' && !_orders[idx].shippedAt) updates.shippedAt = now();
    if (data.status === 'delivered' && !_orders[idx].deliveredAt) updates.deliveredAt = now();
    _orders[idx] = { ..._orders[idx], ...updates };
    return { ..._orders[idx] };
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await delay(400);
    const idx = _orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Order ${id} not found`);
    const updates: Partial<Order> = { status, updatedAt: now() };
    if (status === 'shipped') updates.shippedAt = now();
    if (status === 'delivered') updates.deliveredAt = now();
    _orders[idx] = { ..._orders[idx], ...updates };
    // Notification
    _notifications.unshift({
      id: uid('notif'), userId: _orders[idx].buyerId, type: 'order-update',
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      body: `Your order "${_orders[idx].offerTitle}" is now ${status}.`,
      relatedId: id, timestamp: now(), read: false,
    });
    return { ..._orders[idx] };
  },

  cancel: async (id: string): Promise<Order> => {
    return OrderStore.updateStatus(id, 'cancelled');
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const idx = _orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Order ${id} not found`);
    _orders.splice(idx, 1);
  },
};

// ─── Review Store ────────────────────────────────────────────────────────────

export const ReviewStore = {
  getAll: async (): Promise<Review[]> => { await delay(); return [..._reviews]; },

  getByOffer: async (offerId: string): Promise<Review[]> => {
    await delay();
    return _reviews.filter((r) => r.offerId === offerId).map((r) => ({ ...r }));
  },

  getByBuyer: async (buyerId: string): Promise<Review[]> => {
    await delay();
    return _reviews.filter((r) => r.buyerId === buyerId).map((r) => ({ ...r }));
  },

  getBySeller: async (sellerId: string): Promise<Review[]> => {
    await delay();
    return _reviews.filter((r) => r.sellerId === sellerId).map((r) => ({ ...r }));
  },

  create: async (data: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'verified'>): Promise<Review> => {
    await delay(500);
    // Prevent duplicate reviews on same offer by same buyer
    const existing = _reviews.find((r) => r.offerId === data.offerId && r.buyerId === data.buyerId);
    if (existing) throw new Error('You have already reviewed this offer');
    const review: Review = { ...data, id: uid('review'), createdAt: now(), helpful: 0, verified: true };
    _reviews.unshift(review);
    // Update offer rating
    const offerReviews = _reviews.filter((r) => r.offerId === data.offerId);
    const avg = offerReviews.reduce((s, r) => s + r.rating, 0) / offerReviews.length;
    const oidx = _offers.findIndex((o) => o.id === data.offerId);
    if (oidx !== -1) { _offers[oidx].rating = Math.round(avg * 10) / 10; _offers[oidx].reviewCount = offerReviews.length; }
    return { ...review };
  },

  update: async (id: string, data: Pick<Review, 'rating' | 'title' | 'comment'>): Promise<Review> => {
    await delay(400);
    const idx = _reviews.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Review ${id} not found`);
    _reviews[idx] = { ..._reviews[idx], ...data };
    return { ..._reviews[idx] };
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const idx = _reviews.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Review ${id} not found`);
    _reviews.splice(idx, 1);
  },

  markHelpful: async (id: string): Promise<Review> => {
    await delay(200);
    const idx = _reviews.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Review ${id} not found`);
    _reviews[idx].helpful += 1;
    return { ..._reviews[idx] };
  },

  getAverageRating: async (offerId: string): Promise<number> => {
    await delay(100);
    const reviews = _reviews.filter((r) => r.offerId === offerId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  },
};

// ─── Conversation & Message Store ────────────────────────────────────────────

export const ConversationStore = {
  getAll: async (): Promise<Conversation[]> => { await delay(); return [..._conversations].sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()); },

  getByUser: async (userId: string): Promise<Conversation[]> => {
    await delay();
    return _conversations.filter((c) => c.buyerId === userId || c.sellerId === userId).map((c) => ({ ...c })).sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  },

  getOrCreate: async (buyerId: string, buyerName: string, sellerId: string, sellerName: string, offerId?: string, offerTitle?: string): Promise<Conversation> => {
    await delay(300);
    const existing = _conversations.find((c) => c.buyerId === buyerId && c.sellerId === sellerId && c.offerId === offerId);
    if (existing) return { ...existing };
    const conv: Conversation = { id: uid('conv'), buyerId, buyerName, sellerId, sellerName, offerId, offerTitle, lastMessage: '', lastAt: now(), unreadCount: 0, messageCount: 0 };
    _conversations.unshift(conv);
    return { ...conv };
  },

  markAsRead: async (id: string, userId: string): Promise<void> => {
    await delay(200);
    const idx = _conversations.findIndex((c) => c.id === id);
    if (idx !== -1) { _conversations[idx].unreadCount = 0; }
    // Mark all messages in this conversation as read for this user
    _messages.forEach((m) => { if (m.conversationId === id && m.toId === userId) m.read = true; });
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    _conversations = _conversations.filter((c) => c.id !== id);
    _messages = _messages.filter((m) => m.conversationId !== id);
  },
};

export const MessageStore = {
  getByConversation: async (conversationId: string): Promise<Message[]> => {
    await delay();
    return _messages.filter((m) => m.conversationId === conversationId).map((m) => ({ ...m })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  send: async (conversationId: string, fromId: string, fromName: string, toId: string, text: string): Promise<Message> => {
    await delay(250);
    const msg: Message = { id: uid('msg'), conversationId, fromId, fromName, toId, text, createdAt: now(), read: false };
    _messages.push(msg);
    // Update conversation
    const cidx = _conversations.findIndex((c) => c.id === conversationId);
    if (cidx !== -1) {
      _conversations[cidx].lastMessage = text;
      _conversations[cidx].lastAt = now();
      _conversations[cidx].messageCount += 1;
      if (fromId !== toId) _conversations[cidx].unreadCount += 1;
    }
    return { ...msg };
  },

  delete: async (id: string): Promise<void> => {
    await delay(200);
    _messages = _messages.filter((m) => m.id !== id);
  },
};

// ─── Notification Store ──────────────────────────────────────────────────────

export const NotificationStore = {
  getByUser: async (userId: string): Promise<AppNotification[]> => {
    await delay();
    return _notifications.filter((n) => n.userId === userId).map((n) => ({ ...n })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  markRead: async (id: string): Promise<void> => {
    await delay(100);
    const n = _notifications.find((x) => x.id === id);
    if (n) n.read = true;
  },

  markAllRead: async (userId: string): Promise<void> => {
    await delay(200);
    _notifications.forEach((n) => { if (n.userId === userId) n.read = true; });
  },

  delete: async (id: string): Promise<void> => {
    await delay(200);
    _notifications = _notifications.filter((n) => n.id !== id);
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    await delay(100);
    return _notifications.filter((n) => n.userId === userId && !n.read).length;
  },
};

// ─── Reset (for testing) ─────────────────────────────────────────────────────

export const resetStore = () => {
  _offers = [...SEED_OFFERS];
  _orders = [...SEED_ORDERS];
  _reviews = [...SEED_REVIEWS];
  _conversations = [...SEED_CONVERSATIONS];
  _messages = [...SEED_MESSAGES];
  _notifications = [...SEED_NOTIFICATIONS];
};
