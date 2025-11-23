import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { generateMockAnalytics, generateMockProfile, generateMockConversations, generateMockTransactions } from '../utils';

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
  const [analytics, setAnalytics] = useState(generateMockAnalytics());
  const [loading, setLoading] = useState(false);

  const refreshAnalytics = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnalytics(generateMockAnalytics());
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
  const [profile, setProfile] = useState(generateMockProfile());
  const [loading, setLoading] = useState(false);

  const updateProfile = useCallback(async (updates: any) => {
    setLoading(true);
    // Simulate API call
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
  const [conversations, setConversations] = useState(generateMockConversations());
  const [loading, setLoading] = useState(false);
  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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
  const [transactions, setTransactions] = useState(generateMockTransactions());
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [loading, setLoading] = useState(false);

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.status === filter);

  const totalEarnings = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

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
