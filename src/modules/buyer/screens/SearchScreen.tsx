import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  border: '#334155',
};

const { width } = Dimensions.get('window');

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
}

export default function SearchScreen({ navigation }: any) {
  const { offers } = useApp() as any;
  const [q, setQ] = useState('');
  const normalize = (value?: string) => (value ?? '').toLowerCase();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([
    { id: '1', query: 'Fresh vegetables', timestamp: new Date() },
    { id: '2', query: 'Electronics', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', query: 'Handmade crafts', timestamp: new Date(Date.now() - 86400000) },
  ]);

  const results = useMemo(() => {
    const t = normalize(q.trim());
    if (!t) return [];
    return offers.filter((o: any) => {
      const title = normalize(o?.title);
      const description = normalize(o?.description);
      return title.includes(t) || description.includes(t);
    });
  }, [offers, q]);

  const handleSearch = (query: string) => {
    setQ(query);
    if (query.trim() && !searchHistory.some((h) => h.query === query)) {
      setSearchHistory([
        { id: Date.now().toString(), query, timestamp: new Date() },
        ...searchHistory.slice(0, 4),
      ]);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.resultIcon}>
        <LinearGradient
          colors={['#38BDF8', '#0EA5E9']}
          style={styles.iconBg}
        >
          <Ionicons name="cube-outline" size={20} color={COLORS.background} />
        </LinearGradient>
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title || 'Untitled offer'}
        </Text>
        <Text style={styles.resultPrice}>
          ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: SearchHistory }) => (
    <TouchableOpacity
      style={styles.historyChip}
      onPress={() => handleSearch(item.query)}
    >
      <Ionicons name="time-outline" size={14} color={COLORS.subtle} />
      <Text style={styles.historyText}>{item.query}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        {/* Search Header */}
        <View style={styles.header}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.subtle} />
            <TextInput
              placeholder="Search offers..."
              placeholderTextColor={COLORS.subtle}
              style={styles.input}
              value={q}
              onChangeText={setQ}
              returnKeyType="search"
              autoFocus
            />
            {q.length > 0 && (
              <TouchableOpacity onPress={() => setQ('')}>
                <Ionicons name="close-circle-outline" size={20} color={COLORS.subtle} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {q.trim().length > 0 ? (
          <>
            {/* Search Results */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </Text>
            </View>
            {results.length > 0 ? (
              <FlatList
                data={results}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={48} color={COLORS.subtle} />
                <Text style={styles.noResultsTitle}>No Results Found</Text>
                <Text style={styles.noResultsText}>
                  Try adjusting your search terms
                </Text>
              </View>
            )}
          </>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Search History */}
            {searchHistory.length > 0 && (
              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearButton}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.historyList}>
                  {searchHistory.map((item) => (
                    <View key={item.id}>{renderHistoryItem({ item })}</View>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <View style={styles.categoriesGrid}>
                {[
                  { icon: 'leaf-outline', label: 'Fresh Food' },
                  { icon: 'build-outline', label: 'Handmade' },
                  { icon: 'flash-outline', label: 'Electronics' },
                  { icon: 'book-outline', label: 'Books' },
                  { icon: 'home-outline', label: 'Home' },
                  { icon: 'shirt-outline', label: 'Fashion' },
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat.label}
                    style={styles.categoryCard}
                    onPress={() => handleSearch(cat.label)}
                  >
                    <View style={styles.categoryIcon}>
                      <Ionicons
                        name={cat.icon as any}
                        size={24}
                        color={COLORS.primary}
                      />
                    </View>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trending */}
            <View style={styles.trendingSection}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              {[
                '🥑 Organic Avocados',
                '📱 Used Smartphones',
                '✨ Handcrafted Jewelry',
                '📚 Study Materials',
              ].map((trend) => (
                <TouchableOpacity
                  key={trend}
                  style={styles.trendingItem}
                  onPress={() => handleSearch(trend.replace(/[^a-zA-Z ]/g, ''))}
                >
                  <Ionicons name="flash-outline" size={16} color={COLORS.accent} />
                  <Text style={styles.trendingText}>{trend}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.subtle} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.subtle,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultIcon: {
    marginRight: 12,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: COLORS.subtle,
  },
  historySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  clearButton: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  historyList: {
    gap: 8,
  },
  historyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  historyText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  categoryCard: {
    width: (width - 52) / 3,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  trendingSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  trendingText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
});
