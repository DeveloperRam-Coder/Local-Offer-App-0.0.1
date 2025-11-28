import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { OrderService, ConversationService } from '../../../services/api';

export const useSellerOffers = () => {
  const { myOffers } = useApp();
  const [filteredOffers, setFilteredOffers] = useState(myOffers);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'price'>('recent');

  useEffect(() => {
    let sorted = [...myOffers];
    
    if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.distanceMeters || 0) - (a.distanceMeters || 0));
    } else if (sortBy === 'price') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    setFilteredOffers(sorted);
  }, [myOffers, sortBy]);

  return {
    offers: filteredOffers,
    sortBy,
    setSortBy,
    totalOffers: myOffers.length,
  };
};

export const useSellerAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalEarnings: 1250.5,
    totalSales: 18,
    conversionRate: 12.5,
    responseTime: 45,
    rating: 4.8,
    reviewCount: 24,
    weeklyViews: [120, 150, 180, 160, 190, 210, 175],
    monthlySales: [5, 6, 7, 8, 8, 7, 6, 8, 6, 9, 12, 18],
  });
  const [loading, setLoading] = useState(false);

  const refreshAnalytics = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnalytics({
      totalEarnings: 1250.5,
      totalSales: 18,
      conversionRate: 12.5,
      responseTime: 45,
      rating: 4.8,
      reviewCount: 24,
      weeklyViews: [120, 150, 180, 160, 190, 210, 175],
      monthlySales: [5, 6, 7, 8, 8, 7, 6, 8, 6, 9, 12, 18],
    });
    setLoading(false);
  }, []);

  return {
    analytics,
    loading,
    refreshAnalytics,
  };
};

export const useSellerProfile = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState({
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
  });
  const [loading, setLoading] = useState(false);

  const updateProfile = useCallback(async (updates: any) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProfile((prev) => ({ ...prev, ...updates }));
    setLoading(false);
    return true;
  }, []);

  return {
    profile,
    loading,
    updateProfile,
  };
};

export const useSellerMessages = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const data = await ConversationService.getAll();
        setConversations(data as any[]);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, []);

  const unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    );
  }, []);

  return {
    conversations,
    loading,
    unreadCount,
    markAsRead,
  };
};

export const useSellerTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const data = await OrderService.getAll();
        setTransactions(data as any[]);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.status === filter);

  const totalEarnings = filteredTransactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + (t.total || 0), 0);

  return {
    transactions: filteredTransactions,
    filter,
    setFilter,
    loading,
    totalEarnings,
    totalCount: transactions.length,
  };
};

export const useSellerNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      type: 'message',
      title: 'New message from Alice',
      body: 'Is this still available?',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 'n-2',
      type: 'view',
      title: 'New view on Avocados',
      body: 'Your offer got a new view',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
    },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
  };
};
