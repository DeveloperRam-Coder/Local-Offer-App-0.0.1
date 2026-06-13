import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import type { Offer } from '../../../services/api/store';

const C = {
  bg: '#060D1F', card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399', danger: '#EF4444',
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569',
};

const CATEGORIES = ['Electronics', 'Fashion', 'Sports', 'Home & Garden', 'Fresh Produce', 'Handmade', 'Books', 'Other'];
const STATUSES = ['active', 'inactive', 'draft'] as const;
const STATUS_COLOR: Record<string, string> = { active: C.success, inactive: C.muted, draft: C.accent, sold: C.primary };

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  offer: Offer | null;
  visible: boolean;
  onClose: () => void;
  onSave: (data: Partial<Offer>) => Promise<void>;
  loading: boolean;
}

function EditModal({ offer, visible, onClose, onSave, loading }: EditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (offer) {
      setTitle(offer.title);
      setDescription(offer.description);
      setPrice(String(offer.price));
      setStock(String(offer.stock));
      setCategory(offer.category);
      setErrors({});
    }
  }, [offer]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Required';
    if (!description.trim()) e.description = 'Required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = 'Enter a valid price';
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) e.stock = 'Enter valid stock';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave({ title: title.trim(), description: description.trim(), price: Number(price), stock: Number(stock), category });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={modal.header}>
            <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
              <Ionicons name="close" size={22} color={C.text} />
            </TouchableOpacity>
            <Text style={modal.heading}>Edit Offer</Text>
            <TouchableOpacity onPress={handleSave} disabled={loading} style={[modal.saveBtn, loading && { opacity: 0.6 }]}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={modal.saveBtnText}>Save</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={modal.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={modal.field}>
              <Text style={modal.label}>Title</Text>
              <TextInput style={[modal.input, errors.title && modal.inputErr]} value={title} onChangeText={(v) => { setTitle(v); setErrors((e) => ({ ...e, title: '' })); }} placeholder="Offer title" placeholderTextColor={C.muted} maxLength={80} />
              {!!errors.title && <Text style={modal.errText}>{errors.title}</Text>}
            </View>

            {/* Description */}
            <View style={modal.field}>
              <Text style={modal.label}>Description</Text>
              <TextInput style={[modal.input, modal.inputMulti, errors.description && modal.inputErr]} value={description} onChangeText={(v) => { setDescription(v); setErrors((e) => ({ ...e, description: '' })); }} placeholder="Describe your offer" placeholderTextColor={C.muted} multiline maxLength={300} />
              {!!errors.description && <Text style={modal.errText}>{errors.description}</Text>}
            </View>

            {/* Price + Stock row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[modal.field, { flex: 1 }]}>
                <Text style={modal.label}>Price ($)</Text>
                <TextInput style={[modal.input, errors.price && modal.inputErr]} value={price} onChangeText={(v) => { setPrice(v); setErrors((e) => ({ ...e, price: '' })); }} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={C.muted} />
                {!!errors.price && <Text style={modal.errText}>{errors.price}</Text>}
              </View>
              <View style={[modal.field, { flex: 1 }]}>
                <Text style={modal.label}>Stock</Text>
                <TextInput style={[modal.input, errors.stock && modal.inputErr]} value={stock} onChangeText={(v) => { setStock(v); setErrors((e) => ({ ...e, stock: '' })); }} keyboardType="number-pad" placeholder="0" placeholderTextColor={C.muted} />
                {!!errors.stock && <Text style={modal.errText}>{errors.stock}</Text>}
              </View>
            </View>

            {/* Category */}
            <View style={modal.field}>
              <Text style={modal.label}>Category</Text>
              <View style={modal.catGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity key={cat} style={[modal.catChip, category === cat && modal.catChipActive]} onPress={() => setCategory(cat)}>
                    <Text style={[modal.catText, category === cat && modal.catTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Offer Row Card ───────────────────────────────────────────────────────────

interface OfferCardProps {
  offer: Offer;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function OfferRow({ offer, onEdit, onDelete, onToggleStatus }: OfferCardProps) {
  const statusColor = STATUS_COLOR[offer.status] ?? C.muted;
  return (
    <View style={styles.offerCard}>
      <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />
      <View style={styles.offerBody}>
        <View style={styles.offerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.offerTitle} numberOfLines={1}>{offer.title}</Text>
            <Text style={styles.offerCategory}>{offer.category}</Text>
          </View>
          <Text style={styles.offerPrice}>${offer.price.toFixed(2)}</Text>
        </View>

        <View style={styles.offerStats}>
          <View style={styles.statItem}><Ionicons name="eye-outline" size={12} color={C.muted} /><Text style={styles.statText}>{offer.views}</Text></View>
          <View style={styles.statItem}><Ionicons name="cube-outline" size={12} color={C.muted} /><Text style={styles.statText}>{offer.stock} left</Text></View>
          <View style={styles.statItem}><Ionicons name="star-outline" size={12} color={C.accent} /><Text style={styles.statText}>{offer.rating}</Text></View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor + '40' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{offer.status}</Text>
          </View>
        </View>

        <View style={styles.offerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
            <Ionicons name="pencil-outline" size={14} color={C.primary} />
            <Text style={[styles.actionText, { color: C.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onToggleStatus}>
            <Ionicons name={offer.status === 'active' ? 'pause-circle-outline' : 'play-circle-outline'} size={14} color={C.accent} />
            <Text style={[styles.actionText, { color: C.accent }]}>{offer.status === 'active' ? 'Pause' : 'Activate'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={14} color={C.danger} />
            <Text style={[styles.actionText, { color: C.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ManageOffersScreen({ navigation }: any) {
  const { user, myOffers, offersLoading, updateOffer, deleteOffer, toggleOfferStatus, refreshOffers } = useApp();
  const { showToast } = useToast();
  const [editTarget, setEditTarget] = useState<Offer | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return myOffers.filter((o) => {
      const matchQ = !q || o.title.toLowerCase().includes(q) || o.category.toLowerCase().includes(q);
      const matchS = filterStatus === 'all' || o.status === filterStatus;
      return matchQ && matchS;
    });
  }, [myOffers, query, filterStatus]);

  const handleSaveEdit = async (data: Partial<Offer>) => {
    if (!editTarget) return;
    setEditLoading(true);
    const result = await updateOffer(editTarget.id, data);
    setEditLoading(false);
    if (result) {
      showToast('Offer updated successfully', 'success');
      setEditTarget(null);
    } else {
      showToast('Failed to update offer', 'error');
    }
  };

  const handleDelete = (offer: Offer) => {
    Alert.alert(
      'Delete Offer',
      `Delete "${offer.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            setDeletingId(offer.id);
            const ok = await deleteOffer(offer.id);
            setDeletingId(null);
            showToast(ok ? 'Offer deleted' : 'Failed to delete', ok ? 'success' : 'error');
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (offer: Offer) => {
    const result = await toggleOfferStatus(offer.id);
    if (result) {
      showToast(`Offer ${result.status === 'active' ? 'activated' : 'paused'}`, 'info');
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient colors={['#060D1F', '#0F172A']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={C.accent} />
          <Text style={styles.noticeText}>Only sellers can manage offers.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={C.muted} />
          <TextInput style={styles.searchInput} value={query} onChangeText={setQuery} placeholder="Search your offers..." placeholderTextColor={C.muted} />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={16} color={C.muted} /></TouchableOpacity>}
        </View>

        {/* Status filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {['all', 'active', 'inactive', 'draft', 'sold'].map((s) => (
            <TouchableOpacity key={s} style={[styles.filterChip, filterStatus === s && styles.filterChipActive]} onPress={() => setFilterStatus(s)}>
              <Text style={[styles.filterText, filterStatus === s && styles.filterTextActive]}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBadge}><Text style={styles.statBadgeNum}>{myOffers.length}</Text><Text style={styles.statBadgeLabel}>Total</Text></View>
          <View style={styles.statBadge}><Text style={[styles.statBadgeNum, { color: C.success }]}>{myOffers.filter((o) => o.status === 'active').length}</Text><Text style={styles.statBadgeLabel}>Active</Text></View>
          <View style={styles.statBadge}><Text style={[styles.statBadgeNum, { color: C.accent }]}>{myOffers.filter((o) => o.status === 'inactive').length}</Text><Text style={styles.statBadgeLabel}>Paused</Text></View>
          <View style={styles.statBadge}><Text style={[styles.statBadgeNum, { color: C.primary }]}>{myOffers.reduce((s, o) => s + o.views, 0)}</Text><Text style={styles.statBadgeLabel}>Views</Text></View>
        </View>

        {/* List */}
        {offersLoading ? (
          <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(o) => o.id}
            renderItem={({ item }) => (
              deletingId === item.id
                ? <View style={[styles.offerCard, { justifyContent: 'center', alignItems: 'center', minHeight: 80 }]}><ActivityIndicator color={C.danger} /></View>
                : <OfferRow offer={item} onEdit={() => setEditTarget(item)} onDelete={() => handleDelete(item)} onToggleStatus={() => handleToggleStatus(item)} />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onRefresh={refreshOffers}
            refreshing={offersLoading}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="pricetags-outline" size={48} color={C.subtle} />
                <Text style={styles.emptyTitle}>{query ? 'No matches found' : 'No offers yet'}</Text>
                <Text style={styles.emptyText}>{query ? 'Try a different search term' : 'Tap + to create your first offer'}</Text>
              </View>
            }
          />
        )}

        {/* FAB */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewOffer')} activeOpacity={0.85}>
          <LinearGradient colors={[C.success, '#059669']} style={styles.fabInner}>
            <Ionicons name="add" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Edit Modal */}
        <EditModal offer={editTarget} visible={!!editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} loading={editLoading} />
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

  offerCard: { backgroundColor: C.card, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden', flexDirection: 'row' },
  statusStrip: { width: 4 },
  offerBody: { flex: 1, padding: 12 },
  offerTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  offerTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  offerCategory: { fontSize: 11, color: C.muted, marginTop: 2 },
  offerPrice: { fontSize: 16, fontWeight: '800', color: C.success },
  offerStats: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statText: { fontSize: 11, color: C.muted },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  offerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.border },
  deleteBtn: { borderColor: C.danger + '30', backgroundColor: C.danger + '0A' },
  actionText: { fontSize: 11, fontWeight: '600' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  emptyText: { fontSize: 13, color: C.muted },

  fab: { position: 'absolute', bottom: 24, right: 20 },
  fabInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
});

const modal = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center' },
  heading: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: C.text },
  saveBtn: { backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  saveBtnText: { color: '#060D1F', fontWeight: '700', fontSize: 14 },
  body: { padding: 16, paddingBottom: 40 },
  field: { marginBottom: 16 },
  label: { color: C.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  input: { backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  inputErr: { borderColor: '#F87171' + '60' },
  errText: { color: '#F87171', fontSize: 11, marginTop: 4 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  catChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  catChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  catText: { fontSize: 12, color: C.muted, fontWeight: '500' },
  catTextActive: { color: '#060D1F', fontWeight: '700' },
});
