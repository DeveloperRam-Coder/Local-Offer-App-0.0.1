export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  BuyerOnboarding: undefined;
  Profile: undefined;
  BuyerProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  Favorites: undefined;
  Search: undefined;
  Messages: undefined;
  Chat: { conversationId: string } | undefined;
  OfferDetails: { id: string };
  NewOffer: undefined;
  SellerDashboard: undefined;
  AnalyticsScreen: undefined;
  ManageOffers: undefined;
  SellerMessages: undefined;
  PaymentsScreen: undefined;
  // Buyer Screens
  ProductDetails: { productId: string };
  OrderHistory: undefined;
  Cart: undefined;
  Checkout: undefined;
};

export type MainTabParamList = {
  // Buyer Tabs
  BuyerHome: undefined;
  Deals: undefined;
  Search: undefined;
  Messages: undefined;
  Account: undefined;
  
  // Seller Tabs
  SellerDashboard: undefined;
  ManageOffers: undefined;
  SellerMessages: undefined;
  PaymentsScreen: undefined;
  SellerAccountScreen: undefined;
  
  // Shared Tabs (legacy)
  SellerHome: undefined;
  NewOffer: undefined;
  MyOffers: undefined;
};
