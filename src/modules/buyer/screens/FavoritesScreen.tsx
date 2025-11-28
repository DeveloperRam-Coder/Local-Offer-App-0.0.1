import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  border: '#334155',
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 52) / 2;

export default function FavoritesScreen({ navigation }: any) {
  const { offers, favorites = [] } = useApp() as any;
  const [sortBy, setSortBy] = useState('recent');
  const safeNumber = (value?: number) => (typeof value === 'number' ? value : 0);
  const safeString = (value?: string) => value ?? '';

  const favOffers = useMemo(() => {
    const favoriteOffers = offers.filter((o: any) => favorites.includes(o.id));
    const result = [...favoriteOffers];

    switch (sortBy) {
      case 'price-low':
        return result.sort((a: any, b: any) => safeNumber(a.price) - safeNumber(b.price));
      case 'price-high':
        return result.sort((a: any, b: any) => safeNumber(b.price) - safeNumber(a.price));
      case 'name':
        return result.sort((a: any, b: any) => safeString(a.title).localeCompare(safeString(b.title)));
      case 'recent':
      default:
        return result.sort(
          (a: any, b: any) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    }
  }, [offers, favorites, sortBy]);

  const renderFavoriteCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardImage}>
        <LinearGradient
          colors={['#38BDF8', '#0EA5E9']}
          style={styles.imagePlaceholder}
        >
          <Ionicons name="image-outline" size={32} color={COLORS.background} />
        </LinearGradient>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            // Remove from favorites logic
          }}
        >
          <Ionicons name="close-circle-outline" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title || 'Untitled offer'}
        </Text>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={12} color={COLORS.subtle} />
          <Text style={styles.cardDistance}>2.5 km away</Text>
        </View>
        <Text style={styles.cardPrice}>
          ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>My Favorites</Text>
              <Text style={styles.headerSubtitle}>
                {favOffers.length} {favOffers.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="heart" size={28} color={COLORS.accent} />
            </View>
          </View>

          {favOffers.length > 0 ? (
            <>
              {/* Sort Options */}
              <View style={styles.sortSection}>
                <Text style={styles.sortLabel}>Sort by</Text>
                <View style={styles.sortOptions}>
                  {[
                    { id: 'recent', label: 'Recent', icon: 'time-outline' },
                    { id: 'price-low', label: 'Price ↓', icon: 'arrow-down-outline' },
                    { id: 'price-high', label: 'Price ↑', icon: 'arrow-up-outline' },
                    { id: 'name', label: 'A-Z', icon: 'text-outline' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.sortOption,
                        sortBy === option.id && styles.sortOptionActive,
                      ]}
                      onPress={() => setSortBy(option.id)}
                    >
                      <Ionicons
                        name={option.icon as any}
                        size={14}
                        color={
                          sortBy === option.id ? COLORS.background : COLORS.subtle
                        }
                      />
                      <Text
                        style={[
                          styles.sortOptionText,
                          sortBy === option.id && styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Favorites Grid */}
              <View style={styles.gridContainer}>
                <FlatList
                  data={favOffers}
                  renderItem={renderFavoriteCard}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.columnWrapper}
                  scrollEnabled={false}
                />
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="heart-outline" size={64} color={COLORS.subtle} />
              </View>
              <Text style={styles.emptyTitle}>No Favorites Yet</Text>
              <Text style={styles.emptyDescription}>
                Add items to your favorites to see them here
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Main', { screen: 'BuyerHome' })}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.exploreButtonGradient}
                >
                  <Ionicons name="compass-outline" size={18} color={COLORS.text} />
                  <Text style={styles.exploreButtonText}>Explore Offers</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.subtle,
  },
  headerIcon: {
    backgroundColor: `${COLORS.accent}20`,
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.subtle,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.subtle,
  },
  sortOptionTextActive: {
    color: COLORS.background,
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  favoriteCard: {
    width: cardWidth,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage: {
    height: cardWidth,
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: `${COLORS.background}90`,
    borderRadius: 12,
    padding: 4,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  cardDistance: {
    fontSize: 11,
    color: COLORS.subtle,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.subtle,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  exploreButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});
