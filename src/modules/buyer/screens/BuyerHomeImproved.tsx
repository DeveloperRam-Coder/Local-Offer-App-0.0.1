import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../../context/AppContext';
import { ProductCard } from '../components';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textSubtle: '#94A3B8',
  success: '#34D399',
  warning: '#FBBF24',
  border: '#334155',
};

interface OfferItem {
  id: string;
  title: string;
  price: number;
  imageUri?: string;
  distanceMeters?: number;
  createdAt: string;
  sellerId: string;
  description?: string;
}

interface BuyerHomeProps {
  navigation: any;
}

export default function BuyerHome({ navigation }: BuyerHomeProps) {
  const { offers } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'fresh', label: 'Fresh', icon: 'leaf-outline' },
    { id: 'handmade', label: 'Handmade', icon: 'build-outline' },
    { id: 'electronics', label: 'Electronics', icon: 'flash-outline' },
    { id: 'books', label: 'Books', icon: 'book-outline' },
  ];

  // Filter and sort offers
  const normalize = (value?: string) => (value ?? '').toLowerCase();
  const safeNumber = (value?: number) => (typeof value === 'number' ? value : 0);

  const filteredOffers = useMemo(() => {
    let result = [...offers];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = normalize(searchQuery);
      result = result.filter((o) => {
        const title = normalize(o?.title);
        const description = normalize(o?.description);
        return title.includes(query) || description.includes(query);
      });
    }

    // Sort offers
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => safeNumber(a.price) - safeNumber(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => safeNumber(b.price) - safeNumber(a.price));
        break;
      case 'distance':
        result.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
        break;
      case 'rating':
        result.sort(
          (a, b) => safeNumber(b.price) - safeNumber(a.price)
        );
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [offers, searchQuery, sortBy]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleExplore = (offerId: string) => {
    navigation.navigate('ProductDetails', { productId: offerId });
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Discover</Text>
              <Text style={styles.title}>Local Deals</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.textSubtle} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search offers..."
              placeholderTextColor={COLORS.textSubtle}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={20} color={COLORS.textSubtle} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionLabel}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={18}
                    color={
                      selectedCategory === category.id ? COLORS.background : COLORS.primary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id && styles.categoryLabelActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sort Options */}
          <View style={styles.sortSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortsContainer}
            >
              {[
                { id: 'recent', label: 'Recent', icon: 'time-outline' },
                { id: 'price-low', label: 'Price: Low', icon: 'arrow-down-outline' },
                { id: 'price-high', label: 'Price: High', icon: 'arrow-up-outline' },
                { id: 'distance', label: 'Nearest', icon: 'location-outline' },
                { id: 'rating', label: 'Rating', icon: 'star-outline' },
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.id}
                  style={[
                    styles.sortChip,
                    sortBy === sort.id && styles.sortChipActive,
                  ]}
                  onPress={() => setSortBy(sort.id)}
                >
                  <Ionicons
                    name={sort.icon as any}
                    size={14}
                    color={
                      sortBy === sort.id ? COLORS.background : COLORS.textSubtle
                    }
                  />
                  <Text
                    style={[
                      styles.sortLabel,
                      sortBy === sort.id && styles.sortLabelActive,
                    ]}
                  >
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Featured Deals Banner */}
          <LinearGradient
            colors={[COLORS.primary, '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerContainer}
          >
            <View style={styles.bannerContent}>
              <View>
                <Text style={styles.bannerLabel}>⚡ Flash Deal</Text>
                <Text style={styles.bannerTitle}>Up to 50% Off</Text>
                <Text style={styles.bannerSubtitle}>on selected items today</Text>
              </View>
              <Ionicons name="flash" size={48} color={COLORS.background} />
            </View>
          </LinearGradient>

          {/* Offers List */}
          <View style={styles.offersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Offers</Text>
              <Text style={styles.itemCount}>{filteredOffers.length} items</Text>
            </View>

            {filteredOffers.length > 0 ? (
              <View style={styles.offersGrid}>
                {filteredOffers.map((offer) => (
                  <ProductCard
                    key={offer.id}
                    id={offer.id}
                    title={offer.title}
                    price={offer.price}
                    imageUri={offer.imageUri}
                    rating={4.5}
                    reviewCount={Math.floor(Math.random() * 100) + 10}
                    distance={offer.distanceMeters ? offer.distanceMeters / 1000 : 2.5}
                    isFavorite={false}
                    onPress={() => handleExplore(offer.id)}
                    onFavoritePress={() => console.log('Add to favorites')}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={COLORS.textSubtle} />
                <Text style={styles.emptyTitle}>No offers found</Text>
                <Text style={styles.emptyDescription}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Favorites')}
            >
              <LinearGradient
                colors={['#F97316', '#EA580C']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="heart-outline" size={24} color={COLORS.text} />
                <Text style={styles.actionButtonText}>Favorites</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <LinearGradient
                colors={['#34D399', '#10B981']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="cart-outline" size={24} color={COLORS.text} />
                <Text style={styles.actionButtonText}>Cart</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('OrderHistory')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="list-outline" size={24} color={COLORS.text} />
                <Text style={styles.actionButtonText}>Orders</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSubtle,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: COLORS.background,
  },
  sortSection: {
    marginBottom: 16,
  },
  sortsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  sortChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortLabel: {
    color: COLORS.textSubtle,
    fontSize: 12,
    fontWeight: '500',
  },
  sortLabelActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  bannerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.background,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.background,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.background,
    opacity: 0.9,
  },
  offersSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemCount: {
    color: COLORS.textSubtle,
    fontSize: 13,
    fontWeight: '500',
  },
  offersGrid: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.textSubtle,
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
