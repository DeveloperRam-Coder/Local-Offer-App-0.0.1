// Legacy service exports (read-only, JSON-backed)
export {
  BuyerService,
  SellerService,
  OfferService,
  MessageService,
  ConversationService,
  OrderService,
  ReviewService,
} from './dataService';

export { default as apiService } from './dataService';

// New in-memory store with full CRUD
export {
  OfferStore,
  OrderStore,
  ReviewStore,
  ConversationStore,
  MessageStore,
  NotificationStore,
  resetStore,
} from './store';

export type {
  Offer,
  Order,
  Review,
  Conversation,
  Message,
  AppNotification,
  OfferStatus,
  OrderStatus,
} from './store';
