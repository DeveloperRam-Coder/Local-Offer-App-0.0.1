import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import OnboardingScreen from './src/screen/OnboardingScreen';
import type { RootStackParamList, MainTabParamList } from './src/navigation/types';
// Import from new module structure - Buyer screens
import SearchScreen from './src/modules/buyer/screens/SearchScreen';
import FavoritesScreen from './src/modules/buyer/screens/FavoritesScreen';
import { ProductDetailsScreen, OrderHistoryScreen, CartScreen, CheckoutScreen, BuyerHomeImproved, BuyerOnboardingFlow, BuyerProfileScreen } from './src/modules/buyer/screens';
// Import from new module structure - Seller screens
import {
  SellerHome,
  MyOffersScreen,
  SellerDashboard,
  AnalyticsScreen,
  ManageOffers,
  SellerMessages,
  PaymentsScreen,
  SellerAccountScreen,
} from './src/modules/seller/screens';
// Import from new module structure - Shared/Auth screens
import { LoginScreen, RegisterScreen } from './src/modules/shared/auth/screens';
// Import from new module structure - Shared/Chat screens
import { ChatScreen, MessagesScreen } from './src/modules/shared/chat/screens';
// Import from new module structure - Shared/Offers screens
import { OfferDetailsScreen, DealsScreen, NewOfferScreen } from './src/modules/shared/offers/screens';
// Import from new module structure - Shared/Profile screens
import { ProfileScreen, AccountScreen, SettingsScreen, NotificationsScreen } from './src/modules/shared/profile/screens';
import { AppProvider, useApp } from './src/context/AppContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { user } = useApp();

  return (
    <Tab.Navigator
      id={'MainTabs' as any}
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 5 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      {user?.role === 'buyer' ? (
        <>
          <Tab.Screen name="BuyerHome" component={BuyerHomeImproved} options={{ title: 'Explore', tabBarIcon: ({ color, size }) => (<Ionicons name="compass-outline" color={color} size={size} />) }} />
          <Tab.Screen name="Deals" component={DealsScreen} options={{ title: 'Deals', tabBarIcon: ({ color, size }) => (<Ionicons name="pricetags-outline" color={color} size={size} />) }} />
          <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search', tabBarIcon: ({ color, size }) => (<Ionicons name="search-outline" color={color} size={size} />) }} />
          <Tab.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages', tabBarIcon: ({ color, size }) => (<Ionicons name="chatbubbles-outline" color={color} size={size} />) }} />
          <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'Account', tabBarIcon: ({ color, size }) => (<Ionicons name="person-circle-outline" color={color} size={size} />) }} />
        </>
      ) : (
        <>
          <Tab.Screen name="SellerDashboard" component={SellerDashboard} options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => (<Ionicons name="analytics-outline" color={color} size={size} />) }} />
          <Tab.Screen name="ManageOffers" component={ManageOffers} options={{ title: 'Manage', tabBarIcon: ({ color, size }) => (<Ionicons name="briefcase-outline" color={color} size={size} />) }} />
          <Tab.Screen name="SellerMessages" component={SellerMessages} options={{ title: 'Messages', tabBarIcon: ({ color, size }) => (<Ionicons name="chatbubbles-outline" color={color} size={size} />) }} />
          <Tab.Screen name="PaymentsScreen" component={PaymentsScreen} options={{ title: 'Payments', tabBarIcon: ({ color, size }) => (<Ionicons name="wallet-outline" color={color} size={size} />) }} />
          <Tab.Screen name="SellerAccountScreen" component={SellerAccountScreen} options={{ title: 'Account', tabBarIcon: ({ color, size }) => (<Ionicons name="person-circle-outline" color={color} size={size} />) }} />
        </>
      )}
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useApp();
  return (
    <Stack.Navigator id={'RootStack' as any} initialRouteName="Onboarding" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="BuyerOnboarding" component={BuyerOnboardingFlow} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="BuyerProfile" component={BuyerProfileScreen} options={{ title: 'My Profile' }} />
          <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} options={{ title: 'Offer Details' }} />
          <Stack.Screen name="NewOffer" component={NewOfferScreen} options={{ title: 'New Offer' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
          <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
          {/* Buyer Screens */}
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Order History' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
          {/* Seller Screens */}
          <Stack.Screen name="SellerDashboard" component={SellerDashboard} options={{ title: 'Dashboard' }} />
          <Stack.Screen name="AnalyticsScreen" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
          <Stack.Screen name="ManageOffers" component={ManageOffers} options={{ title: 'Manage Offers' }} />
          <Stack.Screen name="SellerMessages" component={SellerMessages} options={{ title: 'Messages' }} />
          <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} options={{ title: 'Payments' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://localoffers.example.com'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Login: 'login',
      Register: 'register',
      Main: {
        screens: {
          BuyerHome: 'explore',
          Deals: 'deals',
          Search: 'search',
          Messages: 'messages',
          Account: 'account',
          SellerDashboard: 'dashboard',
          ManageOffers: 'manage-offers',
          SellerMessages: 'seller-messages',
          PaymentsScreen: 'payments',
          SellerAccountScreen: 'seller-account',
          SellerHome: 'sell',
          NewOffer: 'new-offer',
          MyOffers: 'my-offers',
        } as Record<keyof MainTabParamList, string>,
      },
      OfferDetails: 'offer/:id',
      NewOffer: 'new-offer',
      SellerDashboard: 'dashboard',
      AnalyticsScreen: 'analytics',
      ManageOffers: 'manage-offers',
      SellerMessages: 'seller-messages',
      PaymentsScreen: 'payments',
    },
  },
  getInitialURL: async () => null,
};

export default function App() {
  return (
    <AppProvider>
        <NavigationContainer linking={{ ...linking, prefixes: [...linking.prefixes] }}>
          <ExpoStatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
    </AppProvider>
  );
}
