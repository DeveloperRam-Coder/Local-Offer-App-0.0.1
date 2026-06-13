import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';
import { useToast } from '../../../../context/ToastContext';

const C = {
  bg: '#060D1F', card: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399',
  text: '#F1F5F9', muted: '#94A3B8', error: '#F87171',
};

const CATEGORIES = ['Fresh Produce', 'Handmade', 'Electronics', 'Books', 'Home & Garden', 'Fashion', 'Sports', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Used', 'Fresh', 'Handcrafted'];
const SHIPPING_OPTIONS = ['Pickup', 'Same Day', 'Free', 'Delivery', 'Paid Shipping'];

export default function NewOfferScreen({ navigation }: any) {
  const { createOffer, user } = useApp();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [condition, setCondition] = useState('New');
  const [shipping, setShipping] = useState('Pickup');
  const [warranty, setWarranty] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = 'Enter a valid price';
    if (originalPrice && (isNaN(Number(originalPrice)) || Number(originalPrice) <= 0)) e.originalPrice = 'Enter a valid original price';
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) e.stock = 'Enter a valid stock quantity';
    if (!category) e.category = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) { showToast('Please fix the errors below', 'error'); return; }
    if (user?.role !== 'seller') { showToast('Only sellers can create offers', 'error'); return; }
    setLoading(true);
    const parsedPrice = Number(price);
    const parsedOriginal = originalPrice ? Number(originalPrice) : undefined;
    const discount = parsedOriginal && parsedOriginal > parsedPrice
      ? `${Math.round(((parsedOriginal - parsedPrice) / parsedOriginal) * 100)}%`
      : undefined;
    const created = await createOffer({
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      originalPrice: parsedOriginal,
      discount,
      category,
      subcategory: subcategory.trim() || undefined,
      stock: Number(stock),
      images: [imageUrl.trim() || `https://via.placeholder.com/400x400/1E293B/38BDF8?text=${encodeURIComponent(title.trim().slice(0, 24) || 'Offer')}`],
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      condition,
      warranty: warranty.trim() || null,
      shipping,
      featured,
      distanceMeters: 1200,
    });
    setLoading(false);
    if (created) {
      showToast('Offer published successfully!', 'success');
      navigation.navigate('Main', { screen: 'ManageOffers' });
    } else {
      showToast('Failed to create offer', 'error');
    }
  };

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.imageWrap}>
              <Ionicons name="camera-outline" size={36} color={C.muted} />
              <Text style={styles.imageText}>Offer Photo URL</Text>
              <TextInput
                style={styles.imageInput}
                placeholder="https://example.com/photo.jpg"
                placeholderTextColor={C.muted}
                value={imageUrl}
                onChangeText={setImageUrl}
                autoCapitalize="none"
              />
              <Text style={styles.imageHint}>Leave blank to use a generated placeholder</Text>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Title <Text style={styles.req}>*</Text></Text>
              <View style={[styles.field, errors.title && styles.fieldErr]}>
                <Ionicons name="text-outline" size={18} color={C.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Fresh organic avocados"
                  placeholderTextColor={C.muted}
                  value={title}
                  onChangeText={(v) => { setTitle(v); setErrors((e) => ({ ...e, title: '' })); }}
                  maxLength={80}
                />
                <Text style={styles.charCount}>{title.length}/80</Text>
              </View>
              {!!errors.title && <Text style={styles.errText}>{errors.title}</Text>}
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Description <Text style={styles.req}>*</Text></Text>
              <View style={[styles.field, styles.fieldMulti, errors.description && styles.fieldErr]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your offer in detail..."
                  placeholderTextColor={C.muted}
                  value={description}
                  onChangeText={(v) => { setDescription(v); setErrors((e) => ({ ...e, description: '' })); }}
                  multiline
                  maxLength={300}
                />
              </View>
              {!!errors.description && <Text style={styles.errText}>{errors.description}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>Price <Text style={styles.req}>*</Text></Text>
                <View style={[styles.field, errors.price && styles.fieldErr]}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={C.muted}
                    value={price}
                    onChangeText={(v) => { setPrice(v); setErrors((e) => ({ ...e, price: '' })); }}
                    keyboardType="decimal-pad"
                  />
                </View>
                {!!errors.price && <Text style={styles.errText}>{errors.price}</Text>}
              </View>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>Original</Text>
                <View style={[styles.field, errors.originalPrice && styles.fieldErr]}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Optional"
                    placeholderTextColor={C.muted}
                    value={originalPrice}
                    onChangeText={(v) => { setOriginalPrice(v); setErrors((e) => ({ ...e, originalPrice: '' })); }}
                    keyboardType="decimal-pad"
                  />
                </View>
                {!!errors.originalPrice && <Text style={styles.errText}>{errors.originalPrice}</Text>}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>Stock <Text style={styles.req}>*</Text></Text>
                <View style={[styles.field, errors.stock && styles.fieldErr]}>
                  <Ionicons name="cube-outline" size={18} color={C.muted} />
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    placeholderTextColor={C.muted}
                    value={stock}
                    onChangeText={(v) => { setStock(v); setErrors((e) => ({ ...e, stock: '' })); }}
                    keyboardType="number-pad"
                  />
                </View>
                {!!errors.stock && <Text style={styles.errText}>{errors.stock}</Text>}
              </View>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>Subcategory</Text>
                <View style={styles.field}>
                  <Ionicons name="albums-outline" size={18} color={C.muted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Optional"
                    placeholderTextColor={C.muted}
                    value={subcategory}
                    onChangeText={setSubcategory}
                  />
                </View>
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Category <Text style={styles.req}>*</Text></Text>
              {!!errors.category && <Text style={styles.errText}>{errors.category}</Text>}
              <View style={styles.catGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity key={cat} style={[styles.catChip, category === cat && styles.catChipActive]} onPress={() => { setCategory(cat); setErrors((e) => ({ ...e, category: '' })); }}>
                    <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Condition</Text>
              <View style={styles.catGrid}>
                {CONDITIONS.map((item) => (
                  <TouchableOpacity key={item} style={[styles.catChip, condition === item && styles.catChipActive]} onPress={() => setCondition(item)}>
                    <Text style={[styles.catText, condition === item && styles.catTextActive]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Shipping</Text>
              <View style={styles.catGrid}>
                {SHIPPING_OPTIONS.map((item) => (
                  <TouchableOpacity key={item} style={[styles.catChip, shipping === item && styles.catChipActive]} onPress={() => setShipping(item)}>
                    <Text style={[styles.catText, shipping === item && styles.catTextActive]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Tags</Text>
              <View style={styles.field}>
                <Ionicons name="pricetag-outline" size={18} color={C.muted} />
                <TextInput style={styles.input} placeholder="organic, local, fresh" placeholderTextColor={C.muted} value={tags} onChangeText={setTags} autoCapitalize="none" />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Warranty</Text>
              <View style={styles.field}>
                <Ionicons name="shield-checkmark-outline" size={18} color={C.muted} />
                <TextInput style={styles.input} placeholder="Optional" placeholderTextColor={C.muted} value={warranty} onChangeText={setWarranty} />
              </View>
            </View>

            <TouchableOpacity style={styles.toggleRow} onPress={() => setFeatured((value) => !value)} activeOpacity={0.8}>
              <View>
                <Text style={styles.toggleTitle}>Feature this offer</Text>
                <Text style={styles.toggleSubtitle}>Adds it to highlighted sections in mock data.</Text>
              </View>
              <Ionicons name={featured ? 'toggle' : 'toggle-outline'} size={36} color={featured ? C.success : C.muted} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSubmit} disabled={loading} activeOpacity={0.85} style={styles.btnWrap}>
              <LinearGradient colors={[C.success, '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.btn, loading && { opacity: 0.6 }]}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <><Ionicons name="cloud-upload-outline" size={20} color="#fff" /><Text style={styles.btnText}>Publish Offer</Text></>
                }
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  imageWrap: {
    minHeight: 170, borderRadius: 16, marginBottom: 20,
    backgroundColor: C.card, borderWidth: 2,
    borderColor: 'rgba(56,189,248,0.2)', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 14,
  },
  imageText: { color: C.muted, fontSize: 15, fontWeight: '600' },
  imageHint: { color: C.muted, fontSize: 11 },
  imageInput: {
    width: '88%', color: C.text, fontSize: 13, backgroundColor: '#0F172A',
    borderRadius: 10, borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 12, paddingVertical: 9, textAlign: 'center',
  },
  row: { flexDirection: 'row', gap: 12 },
  fieldWrap: { marginBottom: 16 },
  label: { color: C.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  req: { color: C.accent },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.card, borderRadius: 12,
    paddingHorizontal: 12, borderWidth: 1, borderColor: C.border,
  },
  fieldMulti: { alignItems: 'flex-start', paddingVertical: 10 },
  fieldErr: { borderColor: C.error + '60' },
  input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 13 },
  textArea: { height: 90, textAlignVertical: 'top' },
  currencySymbol: { color: C.success, fontSize: 16, fontWeight: '700' },
  charCount: { color: C.muted, fontSize: 11 },
  errText: { color: C.error, fontSize: 12, marginTop: 4 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  catChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  catChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  catText: { fontSize: 13, color: C.muted, fontWeight: '500' },
  catTextActive: { color: '#060D1F', fontWeight: '700' },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, padding: 14, marginBottom: 16,
  },
  toggleTitle: { color: C.text, fontSize: 14, fontWeight: '700' },
  toggleSubtitle: { color: C.muted, fontSize: 12, marginTop: 2 },
  btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
