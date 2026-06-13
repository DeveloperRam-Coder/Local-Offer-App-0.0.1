import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, Modal, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert,
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
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569', warning: '#FBBF24',
};

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_META: Record<OrderStatus, { color: string; icon: string; label: string }> = {
  pending: { color: C.warning, icon: 'time-outline', label: 'Pending' },
  confirmed: { color: C.primary, icon: 'checkmark-circle-outline', label: 'Confirmed' },
  processing: { color: '#A78BFA', icon: 'construct-outline', label: 'Processing' },
  shipped: { color: '#818CF8', icon: 'airplane-outline', label: 'Shipped' },
  delivered: { color: C.success, icon: 'checkmark-done-circle-outline', label: 'Delivered' },
  cancelled: { color: C.danger, icon: 'close-circle-outline', label: 'Cancelled' },
};

type OrderFormMode = 'create' | 'edit';

interface OrderFormState {
  buyerId: string;
  buyerName: string;
  offerId: string;
  offerTitle: string;
  quantity: string;
  price: string;
  shippingAddress: string;
  paymentMethod: string;
  notes: string;
  trackingNumber: string;
  status: OrderStatus;
}

const emptyForm: OrderFormState = {
  buyerId: 'b-1',
  buyerName: 'Buyer Demo',
  offerId: '',
  offerTitle: '',
  quantity: '1',
  price: '',
  shippingAddress: '123 Main St, San Francisco, CA 94105',
  paymentMethod: 'Credit Card',
  notes: '',
  trackingNumber: '',
  status: 'pending',
};

function toForm(order: Order | null): OrderFormState {
  if (!order) return emptyForm;
  return {
    buyerId: order.buyerId,
    buyerName: order.buyerName,
    offerId: order.offerId,
    offerTitle: order.offerTitle,
    quantity: String(order.quantity),
    price: String(order.price),
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    notes: order.notes ?? '',
    trackingNumber: order.trackingNumber ?? '',
    status: order.status,
  };
}

function OrderModal({
  mode, visible, order, onClose, onSave, loading,
}: {
  mode: OrderFormMode;
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onSave: (form: OrderFormState) => Promise<void>;
  loading: boolean;
}) {
  const [form, setForm] = useState<OrderFormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setForm(toForm(order));
      setErrors({});
    }
  }, [order, visible]);

  const setValue = (key: keyof OrderFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.buyerId.trim()) next.buyerId = 'Buyer ID is required';
    if (!form.buyerName.trim()) next.buyerName = 'Buyer name is required';
    if (!form.offerId.trim()) next.offerId = 'Offer ID is required';
    if (!form.offerTitle.trim()) next.offerTitle = 'Offer title is required';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) next.quantity = 'Enter a valid quantity';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) next.price = 'Enter a valid unit price';
    if (!form.shippingAddress.trim()) next.shippingAddress = 'Shipping address is required';
    if (!form.paymentMethod.trim()) next.paymentMethod = 'Payment method is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    await onSave(form);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={modal.wrap}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={modal.header}>
            <TouchableOpacity onPress={onClose} style={modal.iconBtn}>
              <Ionicons name="close" size={22} color={C.text} />
            </TouchableOpacity>
            <Text style={modal.heading}>{mode === 'create' ? 'Create Order' : 'Edit Order'}</Text>
            <TouchableOpacity onPress={submit} disabled={loading} style={[modal.saveBtn, loading && { opacity: 0.65 }]}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={modal.saveText}>Save</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={modal.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Input label="Buyer ID" value={form.buyerId} error={errors.buyerId} onChangeText={(value) => setValue('buyerId', value)} />
            <Input label="Buyer Name" value={form.buyerName} error={errors.buyerName} onChangeText={(value) => setValue('buyerName', value)} />
            <Input label="Offer ID" value={form.offerId} error={errors.offerId} onChangeText={(value) => setValue('offerId', value)} />
            <Input label="Offer Title" value={form.offerTitle} error={errors.offerTitle} onChangeText={(value) => setValue('offerTitle', value)} />

            <View style={modal.row}>
              <Input label="Quantity" value={form.quantity} error={errors.quantity} keyboardType="number-pad" onChangeText={(value) => setValue('quantity', value)} style={{ flex: 1 }} />
              <Input label="Unit Price" value={form.price} error={errors.price} keyboardType="decimal-pad" onChangeText={(value) => setValue('price', value)} style={{ flex: 1 }} />
            </View>

            <Input label="Shipping Address" value={form.shippingAddress} error={errors.shippingAddress} multiline onChangeText={(value) => setValue('shippingAddress', value)} />
            <Input label="Payment Method" value={form.paymentMethod} error={errors.paymentMethod} onChangeText={(value) => setValue('paymentMethod', value)} />
            <Input label="Tracking Number" value={form.trackingNumber} onChangeText={(value) => setValue('trackingNumber', value)} />
            <Input label="Notes" value={form.notes} multiline onChangeText={(value) => setValue('notes', value)} />

            <Text style={modal.label}>Status</Text>
            <View style={modal.statusGrid}>
              {STATUSES.map((status) => {
                const meta = STATUS_META[status];
                const active = form.status === status;
                return (
                  <TouchableOpacity key={status} style={[modal.statusChip, active && { backgroundColor: meta.color, borderColor: meta.color }]} onPress={() => setForm((current) => ({ ...current, status }))}>
                    <Ionicons name={meta.icon as any} size={14} color={active ? '#061121' : meta.color} />
                    <Text style={[modal.statusText, active && { color: '#061121' }]}>{meta.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Input({
  label, value, error, onChangeText, keyboardType, multiline, style,
}: {
  label: string;
  value: string;
  error?: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  multiline?: boolean;
  style?: object;
}) {
  return (
    <View style={[modal.field, style]}>
      <Text style={modal.label}>{label}</Text>
      <TextInput
        style={[modal.input, multiline && modal.inputMulti, error && modal.inputErr]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={C.muted}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
      />
      {!!error && <Text style={modal.errText}>{error}</Text>}
    </View>
  );
}

function OrderRow({
  order, onEdit, onDelete, onStatus,
}: {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  onStatus: (status: OrderStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status];
  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    pending: 'confirmed',
    confirmed: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
  };

  return (
    <View style={styles.orderCard}>
      <TouchableOpacity style={styles.orderHead} onPress={() => setExpanded((value) => !value)} activeOpacity={0.85}>
        <View style={[styles.statusIcon, { backgroundColor: meta.color + '20' }]}>
          <Ionicons name={meta.icon as any} size={22} color={meta.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderTitle} numberOfLines={1}>{order.offerTitle}</Text>
          <Text style={styles.orderMeta}>#{order.id.slice(-7).toUpperCase()} by {order.buyerName}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
          <View style={[styles.statusPill, { backgroundColor: meta.color + '18' }]}>
            <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={C.muted} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <Detail label="Buyer ID" value={order.buyerId} />
          <Detail label="Offer ID" value={order.offerId} />
          <Detail label="Quantity" value={String(order.quantity)} />
          <Detail label="Unit Price" value={`$${order.price.toFixed(2)}`} />
          <Detail label="Payment" value={order.paymentMethod} />
          <Detail label="Ordered" value={new Date(order.createdAt).toLocaleDateString()} />
          {!!order.trackingNumber && <Detail label="Tracking" value={order.trackingNumber} />}
          {!!order.notes && <Detail label="Notes" value={order.notes} />}
          <Text style={styles.addressLabel}>Ship To</Text>
          <Text style={styles.address}>{order.shippingAddress}</Text>

          <View style={styles.actions}>
            {nextStatus[order.status] && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => onStatus(nextStatus[order.status]!)}>
                <Ionicons name="arrow-forward-circle-outline" size={15} color={C.success} />
                <Text style={[styles.actionText, { color: C.success }]}>Move to {STATUS_META[nextStatus[order.status]!].label}</Text>
              </TouchableOpacity>
            )}
            {!['cancelled', 'delivered'].includes(order.status) && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => onStatus('cancelled')}>
                <Ionicons name="ban-outline" size={15} color={C.accent} />
                <Text style={[styles.actionText, { color: C.accent }]}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <Ionicons name="pencil-outline" size={15} color={C.primary} />
              <Text style={[styles.actionText, { color: C.primary }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
              <Ionicons name="trash-outline" size={15} color={C.danger} />
              <Text style={[styles.actionText, { color: C.danger }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ManageOrders({ navigation }: any) {
  const { user, sellerOrders, myOffers, ordersLoading, refreshOrders, createOrder, updateOrder, updateOrderStatus, deleteOrder } = useApp();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [modalMode, setModalMode] = useState<OrderFormMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { refreshOrders(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return sellerOrders.filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;
      const matchesQuery = !q || order.offerTitle.toLowerCase().includes(q) || order.buyerName.toLowerCase().includes(q) || order.id.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, sellerOrders, status]);

  const counts = useMemo(() => ({
    total: sellerOrders.length,
    open: sellerOrders.filter((order) => ['pending', 'confirmed', 'processing'].includes(order.status)).length,
    shipped: sellerOrders.filter((order) => order.status === 'shipped').length,
    revenue: sellerOrders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0),
  }), [sellerOrders]);

  const openCreate = () => {
    const firstOffer = myOffers[0];
    setModalMode('create');
    setEditing(null);
    setModalOpen(true);
    if (firstOffer) {
      emptyForm.offerId = firstOffer.id;
      emptyForm.offerTitle = firstOffer.title;
      emptyForm.price = String(firstOffer.price);
    }
  };

  const openEdit = (order: Order) => {
    setModalMode('edit');
    setEditing(order);
    setModalOpen(true);
  };

  const saveOrder = async (form: OrderFormState) => {
    if (!user || user.role !== 'seller') return;
    setSaving(true);
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    const payload = {
      buyerId: form.buyerId.trim(),
      buyerName: form.buyerName.trim(),
      sellerId: user.id,
      sellerName: user.name,
      offerId: form.offerId.trim(),
      offerTitle: form.offerTitle.trim(),
      quantity,
      price,
      total: quantity * price,
      shippingAddress: form.shippingAddress.trim(),
      paymentMethod: form.paymentMethod.trim(),
      notes: form.notes.trim() || undefined,
      trackingNumber: form.trackingNumber.trim() || undefined,
    };
    const result = modalMode === 'create'
      ? await createOrder(payload)
      : await updateOrder(editing!.id, { ...payload, status: form.status });
    if (result && modalMode === 'create' && form.status !== 'pending') {
      await updateOrderStatus(result.id, form.status);
    }
    setSaving(false);
    if (result) {
      showToast(modalMode === 'create' ? 'Order created' : 'Order updated', 'success');
      setModalOpen(false);
      setEditing(null);
    } else {
      showToast('Unable to save order', 'error');
    }
  };

  const changeStatus = async (order: Order, next: OrderStatus) => {
    const result = await updateOrderStatus(order.id, next);
    showToast(result ? `Order marked ${STATUS_META[next].label.toLowerCase()}` : 'Unable to update order', result ? 'success' : 'error');
  };

  const confirmDelete = (order: Order) => {
    Alert.alert('Delete Order', `Delete order for "${order.offerTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const ok = await deleteOrder(order.id);
          showToast(ok ? 'Order deleted' : 'Unable to delete order', ok ? 'info' : 'error');
        },
      },
    ]);
  };

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient colors={['#060D1F', '#0F172A']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={C.accent} />
          <Text style={styles.noticeText}>Only sellers can manage orders.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={C.muted} />
          <TextInput style={styles.searchInput} value={query} onChangeText={setQuery} placeholder="Search orders..." placeholderTextColor={C.muted} />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={16} color={C.muted} /></TouchableOpacity>}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {['all', ...STATUSES].map((item) => (
            <TouchableOpacity key={item} style={[styles.filterChip, status === item && styles.filterChipActive]} onPress={() => setStatus(item)}>
              <Text style={[styles.filterText, status === item && styles.filterTextActive]}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={styles.statBadge}><Text style={styles.statBadgeNum}>{counts.total}</Text><Text style={styles.statBadgeLabel}>Total</Text></View>
          <View style={styles.statBadge}><Text style={[styles.statBadgeNum, { color: C.warning }]}>{counts.open}</Text><Text style={styles.statBadgeLabel}>Open</Text></View>
          <View style={styles.statBadge}><Text style={[styles.statBadgeNum, { color: C.primary }]}>{counts.shipped}</Text><Text style={styles.statBadgeLabel}>Shipped</Text></View>
          <View style={styles.statBadge}><Text style={[styles.statBadgeNum, { color: C.success }]}>${counts.revenue.toFixed(0)}</Text><Text style={styles.statBadgeLabel}>Revenue</Text></View>
        </View>

        {ordersLoading ? (
          <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(order) => order.id}
            renderItem={({ item }) => <OrderRow order={item} onEdit={() => openEdit(item)} onDelete={() => confirmDelete(item)} onStatus={(next) => changeStatus(item, next)} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onRefresh={refreshOrders}
            refreshing={ordersLoading}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="receipt-outline" size={48} color={C.subtle} />
                <Text style={styles.emptyTitle}>{query ? 'No matching orders' : 'No seller orders yet'}</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={openCreate}>
                  <Text style={styles.emptyBtnText}>Create test order</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={openCreate} activeOpacity={0.85}>
          <LinearGradient colors={[C.primary, '#0EA5E9']} style={styles.fabInner}>
            <Ionicons name="add" size={28} color="#061121" />
          </LinearGradient>
        </TouchableOpacity>

        <OrderModal mode={modalMode} order={editing} visible={modalOpen} onClose={() => setModalOpen(false)} onSave={saveOrder} loading={saving} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  noticeText: { color: C.accent, fontSize: 16, fontWeight: '600' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 8, marginBottom: 4,
    backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 12,
    borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, color: C.text, fontSize: 14, paddingVertical: 10 },
  filterRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: C.muted },
  filterTextActive: { color: '#060D1F' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  statBadge: { flex: 1, backgroundColor: C.card, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  statBadgeNum: { fontSize: 16, fontWeight: '800', color: C.text },
  statBadgeLabel: { fontSize: 10, color: C.muted, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  orderCard: { backgroundColor: C.card, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  orderHead: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  statusIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  orderTitle: { color: C.text, fontSize: 14, fontWeight: '800' },
  orderMeta: { color: C.muted, fontSize: 11, marginTop: 2 },
  orderTotal: { color: C.success, fontSize: 15, fontWeight: '800' },
  statusPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, marginTop: 4 },
  statusPillText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  details: { borderTopWidth: 1, borderTopColor: C.border, padding: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 7 },
  detailLabel: { color: C.muted, fontSize: 12 },
  detailValue: { color: C.text, fontSize: 12, fontWeight: '600', flex: 1, textAlign: 'right' },
  addressLabel: { color: C.muted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginTop: 4, marginBottom: 4 },
  address: { color: C.text, fontSize: 13, marginBottom: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { flexGrow: 1, flexBasis: '45%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: 'rgba(255,255,255,0.04)' },
  deleteBtn: { borderColor: C.danger + '30', backgroundColor: C.danger + '0A' },
  actionText: { fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 70, gap: 12 },
  emptyTitle: { color: C.muted, fontSize: 16, fontWeight: '600' },
  emptyBtn: { borderWidth: 1, borderColor: C.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  emptyBtnText: { color: C.primary, fontWeight: '800' },
  fab: { position: 'absolute', bottom: 24, right: 20 },
  fabInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
});

const modal = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  iconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center' },
  heading: { flex: 1, textAlign: 'center', color: C.text, fontSize: 17, fontWeight: '800' },
  saveBtn: { backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  saveText: { color: '#061121', fontWeight: '800' },
  body: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 14 },
  label: { color: C.muted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: { color: C.text, backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15 },
  inputMulti: { minHeight: 76, textAlignVertical: 'top' },
  inputErr: { borderColor: C.danger + '80' },
  errText: { color: '#FCA5A5', fontSize: 11, marginTop: 4 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.card, paddingHorizontal: 10, paddingVertical: 7 },
  statusText: { color: C.muted, fontSize: 12, fontWeight: '700' },
});
