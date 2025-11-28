import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { useApp } from '../../../../context/AppContext';
import { formatCurrency, formatDistance, formatRelativeTime } from '../../../common/utils';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
};

export default function DealsScreen({ navigation }: any) {
  const { offers } = useApp();
  const [query, setQuery] = useState('');

  const normalize = (value?: string) => (value ?? '').toLowerCase();
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return offers;
    return offers.filter(
      (o) => normalize(o?.title).includes(q) || normalize(o?.description).includes(q)
    );
  }, [offers, query]);

  return (
    <ScreenWrapper>
      {/* Header removed — navigator header will provide title */}

      {/* 🔍 Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search deals..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {/* 🛒 Deals List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OfferDetails', { id: item.id })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.meta}>
              💰 {formatCurrency(item.price)} • 📍{' '}
              {item.distanceMeters
                ? formatDistance(item.distanceMeters)
                : 'nearby'}{' '}
              • ⏱ {formatRelativeTime(new Date(item.createdAt))}
            </Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // container padding is provided by ScreenWrapper
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: 'rgba(30,41,59,0.7)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: COLORS.subtle,
    fontSize: 14,
    marginBottom: 8,
  },
  meta: {
    color: COLORS.subtle,
    fontSize: 14,
  },
  separator: {
    height: 8,
  },
});
