import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';
import { useToast } from '../../../../context/ToastContext';
import { formatCurrency, formatRelativeTime } from '../../../common/utils';

const C = {
  bg: '#060D1F', card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399',
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569',
};

export default function OfferDetailsScreen({ route, navigation }: any) {
  const { id } = (route.params ?? {}) as { id: string };
  const { offers, toggleFavorite, isFavorite, addToCart, user } = useApp();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);

  const offer = useMemo(() => offers.find((o) => o.id === id), [offers, id]);

  if (!offer) {
    return (
      <LinearGradient colors={['#060D1F', '#0F172A']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={C.accent} />
          <Text style={styles.notFound}>Offer not found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: C.primary, fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const liked = isFavorite(offer.id);

  const handleFavorite = () => {
    toggleFavorite(offer.id);
    showToast(liked ? 'Removed from favorites' : 'Added to favorites', liked ? 'info' : 'success');
  };

  const handleAddToCart = () => {
    if (!user) { showToast('Please log in first', 'error'); return; }
    addToCart({
      offerId: offer.id, title: offer.title, price: offer.price,
      quantity: qty, sellerId: offer.sellerId, sellerName: 'Local Seller',
      addedAt: new Date().toISOString(),
    });
    showToast(`${qty}× "${offer.title}" added to cart`, 'success');
  };

  const handleChat = () => {
    navigation.navigate('Chat', { conversationId: `conv-${offer.id}`, sellerName: 'Seller' });
  };

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* Back + Favorite header */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color={C.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleFavorite}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? C.accent : C.text} />
            </TouchableOpacity>
          </View>

          {/* Image placeholder */}
          <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.imagePlaceholder}>
            <Ionicons name="cube-outline" size={72} color={C.primary + '60'} />
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{offer.title}</Text>

            <View style={styles.row}>
              <Text style={styles.price}>{formatCurrency(offer.price)}</Text>
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={12} color={C.muted} />
                <Text style={styles.metaText}>{formatRelativeTime(new Date(offer.createdAt))}</Text>
              </View>
              {offer.distanceMeters && (
                <View style={styles.metaChip}>
                  <Ionicons name="location-outline" size={12} color={C.muted} />
                  <Text style={styles.metaText}>{(offer.distanceMeters / 1000).toFixed(1)} km</Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.desc}>{offer.description || 'No description provided.'}</Text>

            {/* Quantity */}
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Ionicons name="remove" size={18} color={C.text} />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                <Ionicons name="add" size={18} color={C.text} />
              </TouchableOpacity>
              <Text style={styles.qtyTotal}>{formatCurrency(offer.price * qty)} total</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sticky action bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.chatBtn} onPress={handleChat}>
            <Ionicons name="chatbubble-outline" size={20} color={C.primary} />
            <Text style={[styles.actionText, { color: C.primary }]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtnWrap} onPress={handleAddToCart} activeOpacity={0.85}>
            <LinearGradient colors={[C.primary, '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cartBtn}>
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text style={styles.cartBtnText}>Add to Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFound: { fontSize: 18, fontWeight: '700', color: C.text },
  backBtn: { padding: 12 },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.card, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
  },

  imagePlaceholder: {
    height: 220, marginHorizontal: 16, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
  },

  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  price: { fontSize: 24, fontWeight: '800', color: C.success },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  metaText: { fontSize: 11, color: C.muted },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  desc: { fontSize: 15, color: C.muted, lineHeight: 22 },

  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.card, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  qtyNum: { fontSize: 18, fontWeight: '700', color: C.text, minWidth: 28, textAlign: 'center' },
  qtyTotal: { fontSize: 14, color: C.success, fontWeight: '700', marginLeft: 8 },

  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#0A1628', borderTopWidth: 1, borderTopColor: C.border,
  },
  chatBtn: {
    width: 56, height: 52, borderRadius: 14,
    backgroundColor: C.card, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: C.primary + '40', gap: 2,
  },
  actionText: { fontSize: 10, fontWeight: '600' },
  cartBtnWrap: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  cartBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  cartBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
