import { useState, useCallback } from 'react';
import {
  generateMockCart,
  generateMockOrders,
  generateMockNotifications,
  generateMockPreferences,
} from '../utils/index';

// Hook for managing shopping cart
export const useBuyerCart = () => {
  const [cart, setCart] = useState(generateMockCart());

  const addToCart = useCallback((item: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((i) => i.offerId === item.offerId);
      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map((i) =>
            i.offerId === item.offerId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...prevCart,
        items: [...prevCart.items, { ...item, addedAt: new Date().toISOString() }],
      };
    });
  }, []);

  const removeFromCart = useCallback((offerId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((i) => i.offerId !== offerId),
    }));
  }, []);

  const updateQuantity = useCallback((offerId: string, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((i) =>
        i.offerId === offerId ? { ...i, quantity: Math.max(1, quantity) } : i
      ),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      lastUpdated: new Date().toISOString(),
    });
  }, []);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
};

// Hook for managing favorites
export const useBuyerFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToFavorites = useCallback((offerId: string) => {
    setFavorites((prev) => (prev.includes(offerId) ? prev : [...prev, offerId]));
  }, []);

  const removeFromFavorites = useCallback((offerId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== offerId));
  }, []);

  const isFavorite = useCallback((offerId: string) => favorites.includes(offerId), [favorites]);

  return { favorites, addToFavorites, removeFromFavorites, isFavorite };
};

// Hook for search functionality
export const useBuyerSearch = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);

  const addToSearchHistory = useCallback((query: string) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q !== query);
      return [query, ...filtered].slice(0, 10);
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const saveSearch = useCallback(
    (query: string, filters: any) => {
      const newSearch = {
        id: `search-${Date.now()}`,
        query,
        filters,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        resultCount: 0,
      };
      setSavedSearches((prev) => [newSearch, ...prev]);
    },
    []
  );

  const removeSavedSearch = useCallback((searchId: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
  }, []);

  return {
    searchHistory,
    savedSearches,
    addToSearchHistory,
    clearSearchHistory,
    saveSearch,
    removeSavedSearch,
  };
};

// Hook for order management
export const useBuyerHistory = () => {
  const [orders, setOrders] = useState(generateMockOrders());

  const getOrderById = useCallback((orderId: string) => {
    return orders.find((o) => o.id === orderId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: string) => {
    return orders.filter((o) => o.status === status);
  }, [orders]);

  const reorderItem = useCallback((orderId: string) => {
    const order = getOrderById(orderId);
    if (order) {
      return {
        offerId: order.offerId,
        title: order.offerTitle,
        price: order.price,
        sellerId: order.sellerId,
        sellerName: order.sellerName,
      };
    }
  }, [getOrderById]);

  return { orders, getOrderById, getOrdersByStatus, reorderItem };
};

// Hook for buyer notifications
export const useBuyerNotifications = () => {
  const [notifications, setNotifications] = useState(generateMockNotifications());

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

// Hook for buyer profile
export const useBuyerProfile = () => {
  const [preferences, setPreferences] = useState(generateMockPreferences());

  const updatePreferences = useCallback((newPrefs: any) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  }, []);

  const addSearchHistory = useCallback((query: string) => {
    setPreferences((prev) => ({
      ...prev,
      searchHistory: [query, ...prev.searchHistory.filter((q) => q !== query)].slice(0, 10),
    }));
  }, []);

  const addRecentlyViewed = useCallback((offerId: string) => {
    setPreferences((prev) => ({
      ...prev,
      recentlyViewed: [offerId, ...prev.recentlyViewed.filter((id) => id !== offerId)].slice(0, 20),
    }));
  }, []);

  return { preferences, updatePreferences, addSearchHistory, addRecentlyViewed };
};
