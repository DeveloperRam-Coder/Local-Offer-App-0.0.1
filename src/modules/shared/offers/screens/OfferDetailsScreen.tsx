import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
// Header removed; using navigator header/title instead
import { useApp } from '../../../../context/AppContext';
import { formatCurrency, formatRelativeTime } from '../../../common/utils';

export default function OfferDetailsScreen({ route }: any) {
  const { id } = route.params as { id: string };
  const { offers } = useApp();

  const offer = useMemo(() => offers.find((o) => o.id === id), [offers, id]);

  if (!offer) {
    return (
      <View style={styles.center}> 
        <Text>Offer not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header removed — navigator header will provide title */}
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.price}>{formatCurrency(offer.price)}</Text>
      <Text style={styles.desc}>{offer.description}</Text>
      <Text style={styles.meta}>Posted {formatRelativeTime(new Date(offer.createdAt))}</Text>
      <View style={{ height: 16 }} />
      <Text style={styles.cta} onPress={() => Alert.alert('Chat', 'Demo chat coming soon...')}>Chat with seller</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  price: { fontSize: 18, marginTop: 4 },
  desc: { color: '#374151', marginTop: 12 },
  meta: { color: '#6b7280', marginTop: 8 },
  cta: { color: '#2563eb', marginTop: 18, fontWeight: '600' },
});
