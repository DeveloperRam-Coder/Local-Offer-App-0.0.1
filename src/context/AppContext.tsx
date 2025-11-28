import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { OfferService, ConversationService } from '../services/api';

type User = {
  id: string;
  name: string;
  role: 'buyer' | 'seller';
  email: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUri?: string;
  distanceMeters?: number;
  createdAt: string;
  sellerId: string;
};

// ✨ NEW TYPES FOR BUYER-SELLER FLOW
export type CartItem = {
  offerId: string;
  title: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  addedAt: string;
};

export type Order = {
  id: string;
  buyerId: string;
  sellerId: string;
  offerId: string;
  offerTitle: string;
  total: number;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryDate?: string;
};

export type Message = {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  offerId?: string;
  text: string;
  createdAt: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  offerId?: string;
  offerTitle?: string;
  messages?: Message[];
  lastMessage?: string;
  lastAt?: string;
  unreadCount: number;
  messageCount?: number;
};

type AppContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  offers: Offer[];
  myOffers: Offer[];
  notifications?: Array<{ id: string; title: string; body?: string; createdAt?: string }>;
  favorites?: string[];
  messages?: Array<{ id: string; withName?: string; preview?: string; lastAt?: string }>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  createOffer: (data: Omit<Offer, 'id' | 'createdAt' | 'sellerId'>) => Offer | null;
  // ✨ NEW CART MANAGEMENT
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (offerId: string) => void;
  updateQuantity: (offerId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  // ✨ NEW FAVORITES
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  // ✨ NEW ORDER MANAGEMENT
  orders: Order[];
  sellerOrders: Order[];
  createOrder: (cartItems: CartItem[]) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  // ✨ NEW MESSAGING
  conversations: Conversation[];
  startConversation: (sellerId: string, offerId?: string) => Conversation | null;
  sendMessage: (conversationId: string, text: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [notifications] = useState<Array<{ id: string; title: string; body?: string; createdAt?: string }>>([]);
  const [messages] = useState<Array<{ id: string; withName?: string; preview?: string; lastAt?: string }>>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  // ✨ NEW STATE
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load offers from OfferService
  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await OfferService.getAll();
        setOffers(data as Offer[]);
      } catch (error) {
        console.error('Failed to load offers:', error);
      }
    };
    loadOffers();
  }, []);

  // Load conversations from ConversationService
  useEffect(() => {
    if (!user) return;
    const loadConversations = async () => {
      try {
        const data = await ConversationService.getByUserId(user.id);
        setConversations(data as any[]);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };
    loadConversations();
  }, [user]);

  const myOffers = useMemo(() => {
    if (!user) return [];
    return offers.filter((o) => o.sellerId === user.id);
  }, [offers, user]);

  const sellerOrders = useMemo(() => {
    if (!user || user.role !== 'seller') return [];
    return orders.filter((o) => o.sellerId === user.id);
  }, [orders, user]);

  const login = async (email: string, password: string) => {
    // Demo auth: accept anything non-empty; choose role by email prefix
    if (!email || !password) return false;
    const normalizedEmail = email.toLowerCase();
    const role: User['role'] = normalizedEmail.startsWith('sell') ? 'seller' : 'buyer';
    setUser({
      id: role === 'seller' ? 's-1' : 'b-1',
      name: role === 'seller' ? 'Seller Demo' : 'Buyer Demo',
      role,
      email,
    });
    return true;
  };

  const register = async (name: string, email: string, password: string, role: User['role']) => {
    if (!name || !email || !password) return false;
    setUser({ id: role === 'seller' ? 's-3' : 'b-3', name, role, email });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
  };

  const createOffer: AppContextValue['createOffer'] = (data) => {
    if (!user || user.role !== 'seller') return null;
    const newOffer: Offer = {
      id: String(Date.now()),
      title: data.title,
      description: data.description,
      price: data.price,
      imageUri: data.imageUri,
      distanceMeters: data.distanceMeters,
      createdAt: new Date().toISOString(),
      sellerId: user.id,
    };
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [id, ...prev]));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // ✨ CART MANAGEMENT
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.offerId === item.offerId);
      if (existing) {
        return prev.map((i) =>
          i.offerId === item.offerId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (offerId: string) => {
    setCart((prev) => prev.filter((i) => i.offerId !== offerId));
  };

  const updateQuantity = (offerId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(offerId);
    } else {
      setCart((prev) =>
        prev.map((i) => (i.offerId === offerId ? { ...i, quantity } : i))
      );
    }
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // ✨ ORDER MANAGEMENT
  const createOrder = (cartItems: CartItem[]): Order | null => {
    if (!user || user.role !== 'buyer' || cartItems.length === 0) return null;
    
    const firstItem = cartItems[0];
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      buyerId: user.id,
      sellerId: firstItem.sellerId,
      offerId: firstItem.offerId,
      offerTitle: firstItem.title,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // ✨ MESSAGING
  const startConversation = (sellerId: string, offerId?: string): Conversation | null => {
    if (!user || user.role !== 'buyer') return null;

    const seller = offers.find((o) => o.sellerId === sellerId);
    const offer = offerId ? offers.find((o) => o.id === offerId) : undefined;

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      buyerId: user.id,
      buyerName: user.name,
      sellerId,
      sellerName: seller?.sellerId === 's-1' ? 'Local Farm Market' : seller?.sellerId === 's-2' ? 'Craft Store' : 'Seller',
      offerId,
      offerTitle: offer?.title,
      messages: [],
      unreadCount: 0,
    };

    setConversations((prev) => {
      const existing = prev.find((c) => c.buyerId === user.id && c.sellerId === sellerId && c.offerId === offerId);
      return existing ? prev : [...prev, newConversation];
    });

    return newConversation;
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      fromId: user.id,
      fromName: user.name,
      toId: '', // Will be set by receiver
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...(c.messages || []), newMessage], lastMessage: text, lastAt: new Date().toISOString() }
          : c
      )
    );
  };

  const getConversation = (conversationId: string) => {
    return conversations.find((c) => c.id === conversationId);
  };

  const value: AppContextValue = {
    isAuthenticated: !!user,
    user,
    offers,
    myOffers,
    notifications,
    favorites,
    messages,
    login,
    register,
    logout,
    createOffer,
    // ✨ NEW
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    toggleFavorite,
    isFavorite,
    orders,
    sellerOrders,
    createOrder,
    updateOrderStatus,
    conversations,
    startConversation,
    sendMessage,
    getConversation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


