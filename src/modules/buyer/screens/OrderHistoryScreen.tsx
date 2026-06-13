import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, Modal, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import type { Order, OrderStatus } from '../../../services/api/store';

const C = {
  bg: '#060D1F', card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399', danger: '#EF4444',
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569',
};

const STATUS_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  pending:    { color: '#FBBF24', icon: 'time-outline',              label: 'Pending' },
  confirmed:  { color: C.primary, icon: 'checkmark-circle-outline',  label: 'Confirmed' },
  processing: { color: '#A78BFA', icon: 'construct-outline',          label: 'Processing' },
  shipped:    { color: '#818CF8', icon: 'airplane-outline',           label: 'Shipped' },
  delivered:  { color: C.success, icon: 'checkmark-done-circle-outline', label: 'Delivered' },
  cancelled:  { color: C.danger,  icon: 'close-circle-outline',      label: 'Cancelled' },
};

const FILTER_TABS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// ─── Review Modal ─────────────────────────────────────────────────────────────

interface ReviewModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, title: string, comment: string) => Promise<void>;
  loading: boolean;
}

function ReviewModal({ order, visible, onClose, onSubmit, loading }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (visible) { setRating(5); setTitle(''); setComment(''); setErrors({}); } }, [visible]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Add a title';
    if (comment.trim().length < 10) e.comment = 'Comment must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={rv.header}>
            <TouchableOpacity onPress={onClose} style={rv.closeBtn}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
            <Text style={rv.heading}>Leave a Review</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={rv.body} keyboardShouldPersistTaps="handled">
            {order && (
              <View style={rv.offerInfo}>
                <Ionicons name="cube-outline" size={20} color={C.primary} />
                <Text style={rv.offerTitle} numberOfLines={1}>{order.offerTitle}</Text>
              </View>
            )}

            {/* Star rating */}
            <Text style={rv.label}>Your Rating</Text>
            <View style={rv.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={36} color={s <= rating ? '#FBBF24' : C.subtle} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={rv.ratingLabel}>{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}</Text>

            {/* Title */}
            <View style={rv.fieldWrap}>
              <Text style={rv.label}>Review Title</Text>
              <TextInput style={[rv.input, errors.title && rv.inputErr]} value={title} onChangeText={(v) => { setTitle(v); setErrors((e) => ({ ...e, title: '' })); }} placeholder="Summarize your experience" placeholderTextColor={C.muted} maxLength={60} />
              {!!errors.title && <Text style={rv.errText}>{errors.title}</Text>}
            </View>

            {/* Comment */}
            <View style={rv.fieldWrap}>
              <Text style={rv.label}>Your Review</Text>
              <TextInput style={[rv.input, rv.inputMulti, errors.comment && rv.inputErr]} value={comment} onChangeText={(v) => { setComment(v); setErrors((e) => ({ ...e, comment: '' })); }} placeholder="Tell others about your experience..." placeholderTextColor={C.muted} multiline maxLength={500} />
              <Text style={rv.charCount}>{comment.length}/500</Text>
              {!!errors.comment && <Text style={rv.errText}>{errors.comment}</Text>}
            </View>

            <TouchableOpacity onPress={() => { if (validate()) onSubmit(rating, title.trim(), comment.trim()); }} disabled={loading} style={rv.submitBtnWrap}>
              <LinearGradient colors={[C.primary, '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[rv.submitBtn, loading && { opacity: 0.6 }]}>
                {loading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="star-outline" size={18} color="#fff" /><Text style={rv.submitBtnText}>Submit Review</Text></>}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, onCancel, onReview, onTrack, cancelLoading }: {
  order: Order;
  onCancel: () => void;
  onReview: () => void;
  onTrack: () => void;
  cancelLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

  return (
    <View style={styles.orderCard}>
      {/* Header */}
      <TouchableOpacity style={styles.orderHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
        <View style={[styles.statusIconWrap, { backgroundColor: sc.color + '18' }]}>
          <Ionicons name={sc.icon as any} size={22} color={sc.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderTitle} numberOfLines={1}>{order.offerTitle}</Text>
          <Text style={styles.orderMeta}>#{order.id.slice(-6).toUpperCase()} · {order.sellerName}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
          <View style={[styles.statusPill, { backgroundColor: sc.color + '18' }]}>
            <Text style={[styles.statusPillText, { color: sc.color }]}>{sc.label}</Text>
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={C.muted} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {/* Expanded details */}
      {expanded && (
        <View style={styles.orderDetails}>
          <View style={styles.detailGrid}>
            <DetailRow label="Quantity" value={String(order.quantity)} />
            <DetailRow label="Unit Price" value={`$${order.price.toFixed(2)}`} />
            <DetailRow label="Payment" value={order.paymentMethod} />
            <DetailRow label="Ordered" value={new Date(order.createdAt).toLocaleDateString()} />
            {order.trackingNumber && <DetailRow label="Tracking" value={order.trackingNumber} />}
            {order.shippedAt && <DetailRow label="Shipped" value={new Date(order.shippedAt).toLocaleDateString()} />}
            {order.deliveredAt && <DetailRow label="Delivered" value={new Date(order.deliveredAt).toLocaleDateString()} />}
          </View>
          <Text style={styles.addressLabel}>Delivery Address</Text>
          <Text style={styles.addressText}>{order.shippingAddress}</Text>

          {/* Actions */}
          <View style={styles.orderActions}>
            {['pending', 'confirmed'].includes(order.status) && (
              <TouchableOpacity style={[styles.orderActionBtn, styles.cancelActionBtn]} onPress={onCancel} disabled={cancelLoading}>
                {cancelLoading ? <ActivityIndicator size="small" color={C.danger} /> : <><Ionicons name="close-circle-outline" size={14} color={C.danger} /><Text style={[styles.orderActionText, { color: C.danger }]}>Cancel Order</Text></>}
              </TouchableOpacity>
            )}
            {['shipped', 'confirmed', 'processing'].includes(order.status) && (
              <TouchableOpacity style={styles.orderActionBtn} onPress={onTrack}>
                <Ionicons name="navigate-outline" size={14} color={C.primary} />
                <Text style={[styles.orderActionText, { color: C.primary }]}>Track</Text>
              </TouchableOpacity>
            )}
            {order.status === 'delivered' && (
              <TouchableOpacity style={[styles.orderActionBtn, styles.reviewActionBtn]} onPress={onReview}>
                <Ionicons name="star-outline" size={14} color='#FBBF24' />
                <Text style={[styles.orderActionText, { color: '#FBBF24' }]}>Leave Review</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const OrderHistoryScreen = ({ navigation }: any) => {
  const { user, orders, ordersLoading, refreshOrders, cancelOrder, submitReview } = useApp();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => { refreshOrders(); }, []);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filter]);

  const handleCancel = async (order: Order) => {
    setCancellingId(order.id);
    const result = await cancelOrder(order.id);
    setCancellingId(null);
    showToast(result ? 'Order cancelled' : 'Failed to cancel order', result ? 'info' : 'error');
  };

  const handleReviewSubmit = async (rating: number, title: string, comment: string) => {
    if (!reviewOrder || !user) return;
    setReviewLoading(true);
    const result = await submitReview({
      offerId: reviewOrder.offerId, offerTitle: reviewOrder.offerTitle,
      buyerId: user.id, buyerName: user.name, sellerId: reviewOrder.sellerId,
      rating, title, comment,
    });
    setReviewLoading(false);
    if (result) {
      showToast('Review submitted! Thank you.', 'success');
      setReviewOrder(null);
    } else {
      showToast('You may have already reviewed this item', 'error');
    }
  };

  const handleTrack = (order: Order) => {
    showToast(order.trackingNumber ? `Tracking: ${order.trackingNumber}` : 'Tracking not yet available', 'info');
  };

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    active: orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }), [orders]);

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

        {/* Summary stats */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}><Text style={styles.summaryNum}>{counts.all}</Text><Text style={styles.summaryLabel}>Total</Text></View>
          <View style={styles.summaryItem}><Text style={[styles.summaryNum, { color: '#FBBF24' }]}>{counts.pending}</Text><Text style={styles.summaryLabel}>Pending</Text></View>
          <View style={styles.summaryItem}><Text style={[styles.summaryNum, { color: C.primary }]}>{counts.active}</Text><Text style={styles.summaryLabel}>Active</Text></View>
          <View style={styles.summaryItem}><Text style={[styles.summaryNum, { color: C.success }]}>{counts.delivered}</Text><Text style={styles.summaryLabel}>Delivered</Text></View>
        </View>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTER_TABS.map((f) => (
            <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {ordersLoading ? (
          <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(o) => o.id}
            renderItem={({ item }) => (
              <OrderCard
                order={item}
                onCancel={() => handleCancel(item)}
                onReview={() => setReviewOrder(item)}
                onTrack={() => handleTrack(item)}
                cancelLoading={cancellingId === item.id}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onRefresh={refreshOrders}
            refreshing={ordersLoading}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="bag-outline" size={48} color={C.subtle} />
                <Text style={styles.emptyTitle}>No orders {filter !== 'all' ? `with status "${filter}"` : 'yet'}</Text>
                {filter === 'all' && <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Main', { screen: 'Deals' })}><Text style={{ color: C.primary, fontWeight: '700' }}>Browse Deals</Text></TouchableOpacity>}
              </View>
            }
          />
        )}

        <ReviewModal order={reviewOrder} visible={!!reviewOrder} onClose={() => setReviewOrder(null)} onSubmit={handleReviewSubmit} loading={reviewLoading} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, gap: 10 },
  summaryItem: { flex: 1, backgroundColor: C.card, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  summaryNum: { fontSize: 18, fontWeight: '800', color: C.text },
  summaryLabel: { fontSize: 10, color: C.muted, marginTop: 2 },
  filterRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: C.muted },
  filterTextActive: { color: '#060D1F' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },

  orderCard: { backgroundColor: C.card, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  orderHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  statusIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  orderTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  orderMeta: { fontSize: 11, color: C.muted, marginTop: 2 },
  orderTotal: { fontSize: 16, fontWeight: '800', color: C.success },
  statusPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  statusPillText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

  orderDetails: { borderTopWidth: 1, borderTopColor: C.border, padding: 14 },
  detailGrid: { gap: 6, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 12, color: C.muted },
  detailValue: { fontSize: 12, fontWeight: '600', color: C.text },
  addressLabel: { fontSize: 11, color: C.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  addressText: { fontSize: 13, color: C.text, marginBottom: 14 },

  orderActions: { flexDirection: 'row', gap: 8 },
  orderActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.border },
  cancelActionBtn: { borderColor: C.danger + '30', backgroundColor: C.danger + '0A' },
  reviewActionBtn: { borderColor: '#FBBF24' + '30', backgroundColor: '#FBBF24' + '0A' },
  orderActionText: { fontSize: 12, fontWeight: '600' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 16, color: C.muted, textAlign: 'center' },
  shopBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: C.primary },
});

const rv = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center' },
  heading: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: C.text },
  body: { padding: 20, paddingBottom: 40 },
  offerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.card, borderRadius: 10, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: C.border },
  offerTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: C.text },
  label: { color: C.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  stars: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  ratingLabel: { fontSize: 14, color: '#FBBF24', fontWeight: '700', marginBottom: 20 },
  fieldWrap: { marginBottom: 16 },
  input: { backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border },
  inputMulti: { height: 110, textAlignVertical: 'top' },
  inputErr: { borderColor: '#F87171' + '60' },
  errText: { color: '#F87171', fontSize: 11, marginTop: 4 },
  charCount: { color: C.subtle, fontSize: 11, textAlign: 'right', marginTop: 4 },
  submitBtnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
