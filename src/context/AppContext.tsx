import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  OfferStore, OrderStore, ReviewStore,
  ConversationStore, MessageStore, NotificationStore,
  type Offer, type Order, type Review,
  type Conversation, type Message, type AppNotification, type OrderStatus,
} from '../services/api/store';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface CartItem {
  offerId: string;
  title: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  addedAt: string;
}

interface AppContextValue {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;

  // Offers
  offers: Offer[];
  myOffers: Offer[];
  offersLoading: boolean;
  refreshOffers: () => Promise<void>;
  createOffer: (data: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'views' | 'status' | 'sellerId' | 'sellerName'>) => Promise<Offer | null>;
  updateOffer: (id: string, data: Partial<Offer>) => Promise<Offer | null>;
  deleteOffer: (id: string) => Promise<boolean>;
  toggleOfferStatus: (id: string) => Promise<Offer | null>;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'addedAt'>) => void;
  removeFromCart: (offerId: string) => void;
  updateCartQuantity: (offerId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Orders
  orders: Order[];
  sellerOrders: Order[];
  ordersLoading: boolean;
  refreshOrders: () => Promise<void>;
  createOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Order | null>;
  updateOrder: (id: string, data: Partial<Omit<Order, 'id' | 'createdAt'>>) => Promise<Order | null>;
  deleteOrder: (id: string) => Promise<boolean>;
  placeOrder: (items: CartItem[], shippingAddress: string, paymentMethod: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order | null>;
  cancelOrder: (id: string) => Promise<Order | null>;

  // Reviews
  reviews: Review[];
  reviewsLoading: boolean;
  refreshReviews: () => Promise<void>;
  submitReview: (data: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'verified'>) => Promise<Review | null>;
  updateReview: (id: string, data: Pick<Review, 'rating' | 'title' | 'comment'>) => Promise<Review | null>;
  deleteReview: (id: string) => Promise<boolean>;
  markReviewHelpful: (id: string) => Promise<void>;

  // Conversations & Messages
  conversations: Conversation[];
  conversationsLoading: boolean;
  refreshConversations: () => Promise<void>;
  openConversation: (sellerId: string, sellerName: string, offerId?: string, offerTitle?: string) => Promise<Conversation | null>;
  sendMessage: (conversationId: string, toId: string, text: string) => Promise<Message | null>;
  getMessages: (conversationId: string) => Promise<Message[]>;
  markConversationRead: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadNotifCount: number;
  notifLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markNotifRead: (id: string) => Promise<void>;
  markAllNotifsRead: () => Promise<void>;
  deleteNotif: (id: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // ── Load offers on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setOffersLoading(true);
      try { setOffers(await OfferStore.getAll()); } finally { setOffersLoading(false); }
    };
    load();
  }, []);

  // ── Load user-specific data when authenticated ────────────────────────────
  useEffect(() => {
    if (!user) { setOrders([]); setConversations([]); setNotifications([]); return; }
    const loadUserData = async () => {
      setOrdersLoading(true);
      setConversationsLoading(true);
      setNotifLoading(true);
      try {
        const [ords, convs, notifs, revs] = await Promise.all([
          user.role === 'buyer' ? OrderStore.getByBuyer(user.id) : OrderStore.getBySeller(user.id),
          ConversationStore.getByUser(user.id),
          NotificationStore.getByUser(user.id),
          ReviewStore.getBySeller(user.id),
        ]);
        setOrders(ords);
        setConversations(convs);
        setNotifications(notifs);
        setReviews(revs);
      } finally {
        setOrdersLoading(false);
        setConversationsLoading(false);
        setNotifLoading(false);
        setReviewsLoading(false);
      }
    };
    loadUserData();
  }, [user?.id]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const myOffers = useMemo(() => user ? offers.filter((o) => o.sellerId === user.id) : [], [offers, user]);
  const sellerOrders = useMemo(() => user?.role === 'seller' ? orders.filter((o) => o.sellerId === user.id) : [], [orders, user]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const unreadNotifCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email.trim() || !password.trim()) return false;
    const e = email.toLowerCase().trim();
    const role: UserRole = e.startsWith('sell') ? 'seller' : 'buyer';
    const id = role === 'seller' ? 's-1' : 'b-1';
    const name = role === 'seller' ? 'Seller Demo' : 'Buyer Demo';
    setUser({ id, name, role, email: e });
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!name.trim() || !email.trim() || !password.trim()) return false;
    const id = role === 'seller' ? 's-2' : 'b-2';
    setUser({ id, name: name.trim(), role, email: email.toLowerCase().trim() });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    setOrders([]);
    setConversations([]);
    setNotifications([]);
  }, []);

  // ── Offers CRUD ───────────────────────────────────────────────────────────
  const refreshOffers = useCallback(async () => {
    setOffersLoading(true);
    try { setOffers(await OfferStore.getAll()); } finally { setOffersLoading(false); }
  }, []);

  const createOffer = useCallback(async (data: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'views' | 'status' | 'sellerId' | 'sellerName'>): Promise<Offer | null> => {
    if (!user || user.role !== 'seller') return null;
    try {
      const offer = await OfferStore.create({ ...data, sellerId: user.id, sellerName: user.name });
      setOffers((prev) => [offer, ...prev]);
      return offer;
    } catch { return null; }
  }, [user]);

  const updateOffer = useCallback(async (id: string, data: Partial<Offer>): Promise<Offer | null> => {
    if (!user || user.role !== 'seller') return null;
    try {
      const offer = await OfferStore.update(id, data);
      setOffers((prev) => prev.map((o) => o.id === id ? offer : o));
      return offer;
    } catch { return null; }
  }, [user]);

  const deleteOffer = useCallback(async (id: string): Promise<boolean> => {
    if (!user || user.role !== 'seller') return false;
    try {
      await OfferStore.delete(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
      return true;
    } catch { return false; }
  }, [user]);

  const toggleOfferStatus = useCallback(async (id: string): Promise<Offer | null> => {
    if (!user || user.role !== 'seller') return null;
    try {
      const offer = await OfferStore.toggleStatus(id);
      setOffers((prev) => prev.map((o) => o.id === id ? offer : o));
      return offer;
    } catch { return null; }
  }, [user]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = useCallback((item: Omit<CartItem, 'addedAt'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.offerId === item.offerId);
      if (existing) return prev.map((i) => i.offerId === item.offerId ? { ...i, quantity: i.quantity + item.quantity } : i);
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromCart = useCallback((offerId: string) => {
    setCart((prev) => prev.filter((i) => i.offerId !== offerId));
  }, []);

  const updateCartQuantity = useCallback((offerId: string, quantity: number) => {
    if (quantity <= 0) { setCart((prev) => prev.filter((i) => i.offerId !== offerId)); return; }
    setCart((prev) => prev.map((i) => i.offerId === offerId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Favorites ─────────────────────────────────────────────────────────────
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  // ── Orders CRUD ───────────────────────────────────────────────────────────
  const refreshOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const ords = user.role === 'buyer' ? await OrderStore.getByBuyer(user.id) : await OrderStore.getBySeller(user.id);
      setOrders(ords);
    } finally { setOrdersLoading(false); }
  }, [user]);

  const createOrder = useCallback(async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order | null> => {
    if (!user) return null;
    const canCreate = user.role === 'buyer' ? data.buyerId === user.id : data.sellerId === user.id;
    if (!canCreate) return null;
    try {
      const order = await OrderStore.create(data);
      setOrders((prev) => [order, ...prev]);
      if (user) setNotifications(await NotificationStore.getByUser(user.id));
      return order;
    } catch { return null; }
  }, [user]);

  const updateOrder = useCallback(async (id: string, data: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<Order | null> => {
    if (!user) return null;
    try {
      const order = await OrderStore.update(id, data);
      if (order.buyerId !== user.id && order.sellerId !== user.id) return null;
      setOrders((prev) => prev.map((o) => o.id === id ? order : o));
      return order;
    } catch { return null; }
  }, [user]);

  const deleteOrder = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    const target = orders.find((o) => o.id === id);
    if (!target || (target.buyerId !== user.id && target.sellerId !== user.id)) return false;
    try {
      await OrderStore.delete(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      return true;
    } catch { return false; }
  }, [orders, user]);

  const placeOrder = useCallback(async (items: CartItem[], shippingAddress: string, paymentMethod: string): Promise<Order | null> => {
    if (!user || user.role !== 'buyer' || items.length === 0) return null;
    try {
      const first = items[0];
      const order = await OrderStore.create({
        buyerId: user.id, buyerName: user.name,
        sellerId: first.sellerId, sellerName: first.sellerName,
        offerId: first.offerId, offerTitle: first.title,
        quantity: items.reduce((s, i) => s + i.quantity, 0),
        price: first.price,
        total: items.reduce((s, i) => s + i.price * i.quantity, 0),
        shippingAddress, paymentMethod,
      });
      setOrders((prev) => [order, ...prev]);
      clearCart();
      const newNotifs = await NotificationStore.getByUser(user.id);
      setNotifications(newNotifs);
      return order;
    } catch { return null; }
  }, [user, clearCart]);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus): Promise<Order | null> => {
    try {
      const order = await OrderStore.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? order : o));
      if (user) {
        const newNotifs = await NotificationStore.getByUser(user.id);
        setNotifications(newNotifs);
      }
      return order;
    } catch { return null; }
  }, [user]);

  const cancelOrder = useCallback(async (id: string): Promise<Order | null> => {
    return updateOrderStatus(id, 'cancelled');
  }, [updateOrderStatus]);

  // ── Reviews CRUD ──────────────────────────────────────────────────────────
  const refreshReviews = useCallback(async () => {
    if (!user) return;
    setReviewsLoading(true);
    try { setReviews(await ReviewStore.getBySeller(user.id)); } finally { setReviewsLoading(false); }
  }, [user]);

  const submitReview = useCallback(async (data: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'verified'>): Promise<Review | null> => {
    if (!user) return null;
    try {
      const review = await ReviewStore.create(data);
      setReviews((prev) => [review, ...prev]);
      // Update offer rating in local state
      const offerReviews = await ReviewStore.getByOffer(data.offerId);
      const avg = offerReviews.reduce((s, r) => s + r.rating, 0) / offerReviews.length;
      setOffers((prev) => prev.map((o) => o.id === data.offerId ? { ...o, rating: Math.round(avg * 10) / 10, reviewCount: offerReviews.length } : o));
      return review;
    } catch { return null; }
  }, [user]);

  const updateReview = useCallback(async (id: string, data: Pick<Review, 'rating' | 'title' | 'comment'>): Promise<Review | null> => {
    try {
      const review = await ReviewStore.update(id, data);
      setReviews((prev) => prev.map((r) => r.id === id ? review : r));
      return review;
    } catch { return null; }
  }, []);

  const deleteReview = useCallback(async (id: string): Promise<boolean> => {
    try {
      await ReviewStore.delete(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch { return false; }
  }, []);

  const markReviewHelpful = useCallback(async (id: string): Promise<void> => {
    try {
      const review = await ReviewStore.markHelpful(id);
      setReviews((prev) => prev.map((r) => r.id === id ? review : r));
    } catch {}
  }, []);

  // ── Conversations & Messages ──────────────────────────────────────────────
  const refreshConversations = useCallback(async () => {
    if (!user) return;
    setConversationsLoading(true);
    try { setConversations(await ConversationStore.getByUser(user.id)); } finally { setConversationsLoading(false); }
  }, [user]);

  const openConversation = useCallback(async (sellerId: string, sellerName: string, offerId?: string, offerTitle?: string): Promise<Conversation | null> => {
    if (!user || user.role !== 'buyer') return null;
    try {
      const conv = await ConversationStore.getOrCreate(user.id, user.name, sellerId, sellerName, offerId, offerTitle);
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === conv.id);
        return exists ? prev.map((c) => c.id === conv.id ? conv : c) : [conv, ...prev];
      });
      return conv;
    } catch { return null; }
  }, [user]);

  const sendMessage = useCallback(async (conversationId: string, toId: string, text: string): Promise<Message | null> => {
    if (!user || !text.trim()) return null;
    try {
      const msg = await MessageStore.send(conversationId, user.id, user.name, toId, text.trim());
      await refreshConversations();
      return msg;
    } catch { return null; }
  }, [user, refreshConversations]);

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    return MessageStore.getByConversation(conversationId);
  }, []);

  const markConversationRead = useCallback(async (conversationId: string): Promise<void> => {
    if (!user) return;
    await ConversationStore.markAsRead(conversationId, user.id);
    setConversations((prev) => prev.map((c) => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
  }, [user]);

  const deleteConversation = useCallback(async (conversationId: string): Promise<void> => {
    await ConversationStore.delete(conversationId);
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
  }, []);

  // ── Notifications ─────────────────────────────────────────────────────────
  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    setNotifLoading(true);
    try { setNotifications(await NotificationStore.getByUser(user.id)); } finally { setNotifLoading(false); }
  }, [user]);

  const markNotifRead = useCallback(async (id: string) => {
    await NotificationStore.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotifsRead = useCallback(async () => {
    if (!user) return;
    await NotificationStore.markAllRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [user]);

  const deleteNotif = useCallback(async (id: string) => {
    await NotificationStore.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ─── Value ────────────────────────────────────────────────────────────────
  const value: AppContextValue = {
    isAuthenticated: !!user, user,
    login, register, logout,
    offers, myOffers, offersLoading, refreshOffers,
    createOffer, updateOffer, deleteOffer, toggleOfferStatus,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
    favorites, toggleFavorite, isFavorite,
    orders, sellerOrders, ordersLoading, refreshOrders,
    createOrder, updateOrder, deleteOrder, placeOrder, updateOrderStatus, cancelOrder,
    reviews, reviewsLoading, refreshReviews,
    submitReview, updateReview, deleteReview, markReviewHelpful,
    conversations, conversationsLoading, refreshConversations,
    openConversation, sendMessage, getMessages, markConversationRead, deleteConversation,
    notifications, unreadNotifCount, notifLoading, refreshNotifications,
    markNotifRead, markAllNotifsRead, deleteNotif,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
