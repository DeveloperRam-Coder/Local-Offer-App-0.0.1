import React, { useMemo, useRef, useState } from 'react';
import {
  View, Text, FlatList, TextInput, StyleSheet,
  TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';
import { useToast } from '../../../../context/ToastContext';
import { formatCurrency, formatDistance, formatRelativeTime } from '../../../common/utils';

const { width } = Dimensions.get('window');

const C = {
  bg: '#060D1F', card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399',
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569',
};

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'fresh', label: 'Fresh', icon: 'leaf-outline' },
  { id: 'handmade', label: 'Handmade', icon: 'color-palette-outline' },
  { id: 'electronics', label: 'Electronics', icon: 'flash-outline' },
  { id: 'books', label: 'Books', icon: 'book-outline' },
  { id: 'home', label: 'Home', icon: 'home-outline' },
];

export default function DealsScreen({ navigation }: any) {
  const { offers, toggleFavorite, isFavorite, addToCart, user } = useApp();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const fabAnim = useRef(new Animated.Value(1)).current;

  const normalize = (v?: string) => (v ?? '').toLowerCase();

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return offers.filter((o) => {
      const matchQ = !q || normalize(o.title).includes(q) || normalize(o.description).includes(q);
      return matchQ;
    });
  }, [offers, query]);

  const handleFavorite = (id: string, title: string) => {
    toggleFavorite(id);
    showToast(
      isFavorite(id) ? `Removed "${title}" from favorites` : `Added "${title}" to favorites`,
      isFavorite(id) ? 'info' : 'success'
    );
  };

  const handleAddToCart = (offer: any) => {
    if (!user) { showToast('Please log in to add to cart', 'error'); return; }
    addToCart({
      offerId: offer.id,
      title: offer.title,
      price: offer.price,
      quantity: 1,
      sellerId: offer.sellerId,
      sellerName: 'Local Seller',
      addedAt: new Date().toISOString(),
    });
    showToast(`"${offer.title}" added to cart`, 'success');
  };

  const handleFABPress = () => {
    Animated.sequence([
      Animated.timing(fabAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(fabAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    navigation.navigate('Search');
  };

  const renderItem = ({ item }: { item: any }) => {
    const liked = isFavorite(item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OfferDetails', { id: item.id })}
        activeOpacity={0.85}
      >
        {/* Color accent strip */}
        <View style={styles.cardStrip} />

        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="cube-outline" size={28} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            </View>
          </View>

          <View style={styles.cardMeta}>
            <View style={styles.metaChip}>
              <Ionicons name="pricetag-outline" size={12} color={C.success} />
              <Text style={[styles.metaText, { color: C.success, fontWeight: '700' }]}>
                {formatCurrency(item.price)}
              </Text>
            </View>
            {item.distanceMeters && (
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={12} color={C.muted} />
                <Text style={styles.metaText}>{formatDistance(item.distanceMeters)}</Text>
              </View>
            )}
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={12} color={C.muted} />
              <Text style={styles.metaText}>{formatRelativeTime(new Date(item.createdAt))}</Text>
            </View>
          </View>

          {/* Inline one-tap actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionBtn, liked && styles.actionBtnActive]}
              onPress={() => handleFavorite(item.id, item.title)}
            >
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={16} color={liked ? C.accent : C.muted} />
              <Text style={[styles.actionBtnText, liked && { color: C.accent }]}>
                {liked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={() => handleAddToCart(item)}
            >
              <Ionicons name="cart-outline" size={16} color={C.bg} />
              <Text style={[styles.actionBtnText, { color: C.bg, fontWeight: '700' }]}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('OfferDetails', { id: item.id })}
            >
              <Ionicons name="arrow-forward-outline" size={16} color={C.primary} />
              <Text style={[styles.actionBtnText, { color: C.primary }]}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

        {/* Sticky search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={C.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search deals..."
            placeholderTextColor={C.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={C.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips */}
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              style={[styles.catChip, category === cat.id && styles.catChipActive]}
              onPress={() => setCategory(cat.id)}
            >
              <Ionicons name={cat.icon as any} size={14} color={category === cat.id ? C.bg : C.muted} />
              <Text style={[styles.catText, category === cat.id && styles.catTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Results header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{filtered.length} deals</Text>
          {query.length > 0 && (
            <Text style={styles.queryLabel}>for "<Text style={{ color: C.primary }}>{query}</Text>"</Text>
          )}
        </View>

        {/* Deals list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={C.subtle} />
              <Text style={styles.emptyTitle}>No deals found</Text>
              <Text style={styles.emptyText}>Try a different search term</Text>
            </View>
          }
        />

        {/* FAB */}
        <Animated.View style={[styles.fab, { transform: [{ scale: fabAnim }] }]}>
          <TouchableOpacity onPress={handleFABPress} activeOpacity={1}>
            <LinearGradient colors={[C.primary, '#0EA5E9']} style={styles.fabInner}>
              <Ionicons name="search" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 8, marginBottom: 4,
    backgroundColor: C.card, borderRadius: 14,
    paddingHorizontal: 14, borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 12 },

  catList: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  catChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  catText: { fontSize: 12, fontWeight: '600', color: C.muted },
  catTextActive: { color: C.bg },

  resultsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 4 },
  resultsCount: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  queryLabel: { fontSize: 12, color: C.muted },

  list: { paddingHorizontal: 16, paddingBottom: 100 },

  card: {
    backgroundColor: C.card, borderRadius: 16,
    marginBottom: 12, borderWidth: 1, borderColor: C.border,
    overflow: 'hidden',
  },
  cardStrip: { height: 3, backgroundColor: C.primary },
  cardBody: { padding: 14 },
  cardTop: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  cardIconWrap: {
    width: 52, height: 52, borderRadius: 12,
    backgroundColor: 'rgba(56,189,248,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 3 },
  cardDesc: { fontSize: 13, color: C.muted, lineHeight: 18 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  metaText: { fontSize: 11, color: C.muted, fontWeight: '500' },

  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 8, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: C.border,
  },
  actionBtnActive: { borderColor: C.accent + '50', backgroundColor: C.accent + '10' },
  actionBtnPrimary: { backgroundColor: C.primary, borderColor: C.primary },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: C.muted },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text, marginTop: 16 },
  emptyText: { fontSize: 14, color: C.muted, marginTop: 6 },

  fab: { position: 'absolute', bottom: 24, right: 20 },
  fabInner: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
});
