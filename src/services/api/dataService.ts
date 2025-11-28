import buyersData from '../../data/json/buyers.json';
import sellersData from '../../data/json/sellers.json';
import offersData from '../../data/json/offers.json';
import messagesData from '../../data/json/messages.json';
import conversationsData from '../../data/json/conversations.json';
import ordersData from '../../data/json/orders.json';
import reviewsData from '../../data/json/reviews.json';

// Simulate API delay
const DELAY = 300; // ms

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value?: string) => (value ?? '').toLowerCase();

export class BuyerService {
  static async getAll() {
    await delay(DELAY);
    return buyersData.buyers;
  }

  static async getById(id: string) {
    await delay(DELAY);
    return buyersData.buyers.find(b => b.id === id);
  }

  static async search(query: string) {
    await delay(DELAY);
    const lower = normalize(query);
    return buyersData.buyers.filter(b =>
      normalize(b.name).includes(lower) ||
      normalize(b.email).includes(lower) ||
      normalize(b.location).includes(lower)
    );
  }
}

export class SellerService {
  static async getAll() {
    await delay(DELAY);
    return sellersData.sellers;
  }

  static async getById(id: string) {
    await delay(DELAY);
    return sellersData.sellers.find(s => s.id === id);
  }

  static async search(query: string) {
    await delay(DELAY);
    const lower = normalize(query);
    return sellersData.sellers.filter(s =>
      normalize(s.name).includes(lower) ||
      normalize(s.email).includes(lower) ||
      normalize(s.location).includes(lower)
    );
  }

  static async getTopSellers(limit: number = 5) {
    await delay(DELAY);
    return sellersData.sellers
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  static async getByCategory(category: string) {
    await delay(DELAY);
    // This would filter sellers by their primary category
    return sellersData.sellers;
  }
}

export class OfferService {
  static async getAll() {
    await delay(DELAY);
    return offersData.offers;
  }

  static async getById(id: string) {
    await delay(DELAY);
    return offersData.offers.find(o => o.id === id);
  }

  static async getByCategory(category: string) {
    await delay(DELAY);
    return offersData.offers.filter(o => o.category === category);
  }

  static async getBySellerId(sellerId: string) {
    await delay(DELAY);
    return offersData.offers.filter(o => o.sellerId === sellerId);
  }

  static async search(query: string) {
    await delay(DELAY);
    const lower = normalize(query);
    return offersData.offers.filter((o) => {
      const title = normalize(o.title);
      const description = normalize(o.description);
      const tags = Array.isArray(o.tags) ? o.tags : [];
      return (
        title.includes(lower) ||
        description.includes(lower) ||
        tags.some((tag) => normalize(tag).includes(lower))
      );
    });
  }

  static async getFeatured() {
    await delay(DELAY);
    return offersData.offers.filter(o => o.featured);
  }

  static async getDiscounted(minDiscount: number = 10) {
    await delay(DELAY);
    return offersData.offers.filter(o => {
      const discountPercent = parseInt(o.discount);
      return discountPercent >= minDiscount;
    });
  }

  static async getByPriceRange(minPrice: number, maxPrice: number) {
    await delay(DELAY);
    return offersData.offers.filter(o =>
      o.price >= minPrice && o.price <= maxPrice
    );
  }

  static async getTopRated(limit: number = 10) {
    await delay(DELAY);
    return offersData.offers
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
}

export class MessageService {
  static async getAll() {
    await delay(DELAY);
    return messagesData.messages;
  }

  static async getById(id: string) {
    await delay(DELAY);
    return messagesData.messages.find(m => m.id === id);
  }

  static async getByConversationId(conversationId: string) {
    await delay(DELAY);
    // In real API, conversation ID would match specific messages
    return messagesData.messages;
  }

  static async getByUsers(userId1: string, userId2: string) {
    await delay(DELAY);
    return messagesData.messages.filter(m =>
      (m.fromId === userId1 && m.toId === userId2) ||
      (m.fromId === userId2 && m.toId === userId1)
    );
  }

  static async send(message: any) {
    await delay(DELAY);
    return {
      id: `msg_${Date.now()}`,
      ...message,
      createdAt: new Date().toISOString(),
      read: false,
    };
  }
}

export class ConversationService {
  static async getAll() {
    await delay(DELAY);
    return conversationsData.conversations;
  }

  static async getById(id: string) {
    await delay(DELAY);
    return conversationsData.conversations.find(c => c.id === id);
  }

  static async getByUserId(userId: string) {
    await delay(DELAY);
    return conversationsData.conversations.filter(c =>
      c.buyerId === userId || c.sellerId === userId
    );
  }

  static async create(conversation: any) {
    await delay(DELAY);
    return {
      id: `conv_${Date.now()}`,
      ...conversation,
      messageCount: 0,
      unreadCount: 0,
    };
  }

  static async markAsRead(id: string) {
    await delay(DELAY);
    const conv = conversationsData.conversations.find(c => c.id === id);
    if (conv) {
      conv.unreadCount = 0;
    }
    return conv;
  }
}

export class OrderService {
  static async getAll() {
    await delay(DELAY);
    return ordersData.orders;
  }

  static async getById(id: string) {
    await delay(DELAY);
    return ordersData.orders.find(o => o.id === id);
  }

  static async getByBuyerId(buyerId: string) {
    await delay(DELAY);
    return ordersData.orders.filter(o => o.buyerId === buyerId);
  }

  static async getBySellerId(sellerId: string) {
    await delay(DELAY);
    return ordersData.orders.filter(o => o.sellerId === sellerId);
  }

  static async getByStatus(status: string) {
    await delay(DELAY);
    return ordersData.orders.filter(o => o.status === status);
  }

  static async create(order: any) {
    await delay(DELAY);
    return {
      id: `order_${Date.now()}`,
      ...order,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
  }

  static async updateStatus(id: string, status: string) {
    await delay(DELAY);
    const order = ordersData.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
    }
    return order;
  }
}

export class ReviewService {
  static async getAll() {
    await delay(DELAY);
    return reviewsData.reviews;
  }

  static async getById(id: string) {
    await delay(DELAY);
    return reviewsData.reviews.find(r => r.id === id);
  }

  static async getByOfferId(offerId: string) {
    await delay(DELAY);
    return reviewsData.reviews.filter(r => r.offerId === offerId);
  }

  static async getByBuyerId(buyerId: string) {
    await delay(DELAY);
    return reviewsData.reviews.filter(r => r.buyerId === buyerId);
  }

  static async create(review: any) {
    await delay(DELAY);
    return {
      id: `review_${Date.now()}`,
      ...review,
      createdAt: new Date().toISOString(),
      verified: true,
      helpful: 0,
    };
  }

  static async getAverageRating(offerId: string) {
    await delay(DELAY);
    const reviews = reviewsData.reviews.filter(r => r.offerId === offerId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }
}

// Export all services
export default {
  buyers: BuyerService,
  sellers: SellerService,
  offers: OfferService,
  messages: MessageService,
  conversations: ConversationService,
  orders: OrderService,
  reviews: ReviewService,
};
