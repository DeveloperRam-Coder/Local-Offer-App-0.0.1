export type OfferStats = {
  totalOffers: number;
  activeOffers: number;
  totalViews: number;
  totalMessages: number;
  averageRating: number;
};

export type OfferDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUri?: string;
  views: number;
  likes: number;
  messages: number;
  status: 'active' | 'sold' | 'inactive';
  createdAt: string;
  lastModified: string;
};

export type SellerAnalytics = {
  totalEarnings: number;
  totalSales: number;
  conversionRate: number;
  responseTime: number; // in minutes
  rating: number;
  reviewCount: number;
  weeklyViews: number[];
  monthlySales: number[];
};

export type SellerProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  responseTime: number;
  verified: boolean;
  joinDate: string;
  location?: string;
  avatar?: string;
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  offerId?: string;
  offerTitle?: string;
};

export type PaymentMethod = {
  id: string;
  type: 'bank' | 'paypal' | 'stripe';
  lastFour?: string;
  isDefault: boolean;
};

export type Transaction = {
  id: string;
  offerId: string;
  offerTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  buyerName: string;
};
