import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { formatCurrency, formatRelativeTime } from '../../common/utils';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
};

export default function MyOffersScreen() {
  const { myOffers, user } = useApp();

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.accent} />
          <Text style={styles.noticeText}>Only sellers can view their offers.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
  {/* Header removed — navigator header will provide title */}

        <FlatList
          data={myOffers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                💰 {formatCurrency(item.price)} • ⏱ {formatRelativeTime(new Date(item.createdAt))}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Ionicons name="pricetags-outline" size={50} color={COLORS.subtle} />
              <Text style={styles.emptyText}>No offers yet. Create one!</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: 'rgba(30,41,59,0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: COLORS.subtle,
    marginTop: 6,
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 12,
  },
  emptyText: {
    color: COLORS.subtle,
    marginTop: 8,
    fontSize: 15,
  },
});
