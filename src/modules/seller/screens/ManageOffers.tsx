import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useSellerOffers } from '../hooks';
import { OfferCard, FilterBar } from '../components';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  success: '#34D399',
  danger: '#EF4444',
};

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Sold', value: 'sold' },
  { label: 'Inactive', value: 'inactive' },
];

export default function ManageOffersScreen({ navigation }: any) {
  const { user, myOffers } = useApp();
  const { offers, sortBy, setSortBy, totalOffers } = useSellerOffers();
  const [activeFilter, setActiveFilter] = useState('all');

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.accent} />
          <Text style={styles.noticeText}>Only sellers can manage offers.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleEdit = (offerId: string) => {
    // Navigate to edit screen
    Alert.alert('Edit Offer', `Edit offer ${offerId}`);
  };

  const handleDelete = (offerId: string) => {
    Alert.alert(
      'Delete Offer',
      'Are you sure you want to delete this offer?',
      [
        { text: 'Cancel', onPress: () => {} },
        { text: 'Delete', onPress: () => Alert.alert('Deleted', 'Offer deleted successfully'), style: 'destructive' },
      ]
    );
  };

  const handleSort = () => {
    const nextSort = sortBy === 'recent' ? 'popular' : sortBy === 'popular' ? 'price' : 'recent';
    setSortBy(nextSort);
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#1E3A8A']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Header with count */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Manage Offers</Text>
            <Text style={styles.subtitle}>{totalOffers} offers total</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('NewOffer')}
          >
            <Ionicons name="add" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Filter and Sort */}
        <FilterBar
          filters={FILTER_OPTIONS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSort={handleSort}
        />

        {/* Offers List */}
        {totalOffers === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetags-outline" size={64} color={COLORS.subtle} />
            <Text style={styles.emptyTitle}>No Offers Yet</Text>
            <Text style={styles.emptyText}>Create your first offer to get started!</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('NewOffer')}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.text} />
              <Text style={styles.createButtonText}>Create Offer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={offers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.offerWrapper}>
                <OfferCard
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  views={Math.floor(Math.random() * 100)}
                  likes={Math.floor(Math.random() * 50)}
                  messages={Math.floor(Math.random() * 20)}
                  status="active"
                  createdAt={item.createdAt}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  imageUri={item.imageUri}
                />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.subtle,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerWrapper: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.subtle,
    marginTop: 8,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  noticeText: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 16,
  },
});
