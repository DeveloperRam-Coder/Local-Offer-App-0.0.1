// Seller-specific utility functions

export const calculateOfferStats = (offers: any[]) => {
  const activeOffers = offers.filter((o) => o.status === 'active').length;
  const totalViews = offers.reduce((sum, o) => sum + (o.views || 0), 0);
  const totalMessages = offers.reduce((sum, o) => sum + (o.messages || 0), 0);

  return {
    totalOffers: offers.length,
    activeOffers,
    totalViews,
    totalMessages,
    averageRating: 4.8, // Mock data
  };
};

export const calculateConversionRate = (views: number, sales: number) => {
  if (views === 0) return 0;
  return ((sales / views) * 100).toFixed(2);
};

export const getOfferStatus = (offer: any) => {
  const isSold = offer.status === 'sold';
  const isActive = offer.status === 'active';
  const isInactive = offer.status === 'inactive';

  return { isSold, isActive, isInactive };
};

export const formatSellerStats = (stats: any) => {
  return {
    ...stats,
    totalViewsFormatted: stats.totalViews.toLocaleString(),
    totalOffersFormatted: stats.totalOffers.toLocaleString(),
    totalMessagesFormatted: stats.totalMessages.toLocaleString(),
  };
};

export const generateMockAnalytics = () => {
  return {
    totalEarnings: 1250.5,
    totalSales: 18,
    conversionRate: 12.5,
    responseTime: 45, // minutes
    rating: 4.8,
    reviewCount: 24,
    weeklyViews: [120, 150, 180, 160, 190, 210, 175],
    monthlySales: [5, 6, 7, 8, 8, 7, 6, 8, 6, 9, 12, 18],
  };
};

export const generateMockProfile = () => {
  return {
    id: 's-1',
    name: 'Local Seller',
    email: 'seller@localoffers.com',
    phone: '+1 (555) 234-5678',
    bio: 'Quality seller with verified reviews. Fast shipping and excellent customer service.',
    rating: 4.8,
    reviewCount: 24,
    totalSales: 18,
    responseTime: 45,
    verified: true,
    joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    location: 'San Francisco, CA',
  };
};

export const generateMockConversations = (): any[] => {
  return [
    {
      id: 'c-1',
      participantName: 'Alice Johnson',
      lastMessage: 'Is this still available?',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 1,
      offerTitle: 'Fresh Avocados',
    },
    {
      id: 'c-2',
      participantName: 'Bob Smith',
      lastMessage: 'Can you deliver?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      unreadCount: 0,
      offerTitle: 'Handmade Wallet',
    },
    {
      id: 'c-3',
      participantName: 'Carol Davis',
      lastMessage: 'Great quality!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      unreadCount: 0,
      offerTitle: 'Cheddar Cheese',
    },
  ];
};

export const generateMockTransactions = (): any[] => {
  return [
    {
      id: 't-1',
      offerId: '1',
      offerTitle: 'Fresh Avocados (1kg)',
      amount: 4.99,
      date: new Date().toISOString(),
      status: 'completed',
      buyerName: 'Alice Johnson',
    },
    {
      id: 't-2',
      offerId: '2',
      offerTitle: 'Handmade Wallet',
      amount: 24.0,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'completed',
      buyerName: 'Bob Smith',
    },
    {
      id: 't-3',
      offerId: '3',
      offerTitle: 'Cheddar Cheese (500g)',
      amount: 8.5,
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      status: 'pending',
      buyerName: 'Carol Davis',
    },
  ];
};
