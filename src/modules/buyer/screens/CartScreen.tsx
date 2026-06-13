import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  bg: '#060D1F', card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399', danger: '#EF4444',
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569',
};

const PAYMENT_METHODS = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay', 'Cash on Delivery'];

export const CartScreen = ({ navigation }: any) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount, placeOrder, user } = useApp();
  const { showToast } = useToast();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState('');

  const tax = cartTotal * 0.08;
  const delivery = cartTotal > 50 ? 0 : 3.99;
  const finalTotal = cartTotal + tax + delivery;

  const handleCheckout = async () => {
    if (!address.trim()) { setAddressError('Delivery address is required'); return; }
    setAddressError('');
    setLoading(true);
    const order = await placeOrder(cart, address.trim(), paymentMethod);
    setLoading(false);
    if (order) {
      setStep('success');
      showToast('Order placed successfully!', 'success');
    } else {
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.center}>
          <LinearGradient colors={[C.success + '20', C.success + '08']} style={styles.successCircle}>
            <Ionicons name="checkmark-circle" size={72} color={C.success} />
          </LinearGradient>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSub}>We'll notify you when your order ships.</Text>
          <View style={styles.successActions}>
            <TouchableOpacity style={styles.successBtnPrimary} onPress={() => navigation.navigate('OrderHistory')}>
              <Text style={{ color: '#060D1F', fontWeight: '700', fontSize: 15 }}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.successBtnSecondary} onPress={() => navigation.navigate('Main', { screen: user?.role === 'buyer' ? 'Deals' : 'SellerDashboard' })}>
              <Text style={{ color: C.primary, fontWeight: '700', fontSize: 15 }}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── Checkout step ─────────────────────────────────────────────────────────
  if (step === 'checkout') {
    return (
      <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

              <TouchableOpacity style={styles.backRow} onPress={() => setStep('cart')}>
                <Ionicons name="chevron-back" size={18} color={C.primary} />
                <Text style={{ color: C.primary, fontWeight: '600' }}>Back to Cart</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TextInput
                style={[styles.field, addressError && styles.fieldErr]}
                value={address}
                onChangeText={(v) => { setAddress(v); setAddressError(''); }}
                placeholder="123 Main St, City, State ZIP"
                placeholderTextColor={C.muted}
                multiline
              />
              {!!addressError && <Text style={styles.errText}>{addressError}</Text>}

              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Payment Method</Text>
              <View style={styles.paymentList}>
                {PAYMENT_METHODS.map((pm) => (
                  <TouchableOpacity key={pm} style={[styles.paymentChip, paymentMethod === pm && styles.paymentChipActive]} onPress={() => setPaymentMethod(pm)}>
                    <Ionicons name={paymentMethod === pm ? 'radio-button-on' : 'radio-button-off'} size={16} color={paymentMethod === pm ? C.primary : C.muted} />
                    <Text style={[styles.paymentChipText, paymentMethod === pm && { color: C.text }]}>{pm}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Order summary */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                {cart.map((item) => (
                  <View key={item.offerId} style={styles.summaryRow}>
                    <Text style={styles.summaryItemName} numberOfLines={1}>{item.title} × {item.quantity}</Text>
                    <Text style={styles.summaryItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
                <View style={styles.divider} />
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax (8%)</Text><Text style={styles.summaryValue}>${tax.toFixed(2)}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={styles.summaryValue}>{delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}</Text></View>
                <View style={[styles.summaryRow, { marginTop: 4 }]}>
                  <Text style={[styles.summaryLabel, { color: C.text, fontWeight: '800', fontSize: 15 }]}>Total</Text>
                  <Text style={[styles.summaryValue, { color: C.success, fontWeight: '800', fontSize: 17 }]}>${finalTotal.toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleCheckout} disabled={loading} activeOpacity={0.85} style={styles.ctaWrap}>
                <LinearGradient colors={[C.primary, '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, loading && { opacity: 0.6 }]}>
                  {loading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="bag-check-outline" size={20} color="#fff" /><Text style={styles.ctaText}>Place Order · ${finalTotal.toFixed(2)}</Text></>}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── Cart step ─────────────────────────────────────────────────────────────
  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        {cart.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="bag-outline" size={56} color={C.subtle} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Main', { screen: 'Deals' })}>
              <Text style={{ color: C.primary, fontWeight: '700' }}>Browse Deals</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(i) => i.offerId}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.cartHeader}>
                  <Text style={styles.cartCount}>{cartCount} item{cartCount !== 1 ? 's' : ''}</Text>
                  <TouchableOpacity onPress={() => { clearCart(); showToast('Cart cleared', 'info'); }}>
                    <Text style={{ color: C.danger, fontSize: 13, fontWeight: '600' }}>Clear all</Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <View style={styles.cartItemIcon}>
                    <Ionicons name="cube-outline" size={24} color={C.primary} />
                  </View>
                  <View style={styles.cartItemContent}>
                    <Text style={styles.cartItemTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.cartItemSeller}>{item.sellerName}</Text>
                    <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} each</Text>
                  </View>
                  <View style={styles.cartItemActions}>
                    <View style={styles.qtyRow}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQuantity(item.offerId, item.quantity - 1)}>
                        <Ionicons name="remove" size={16} color={C.text} />
                      </TouchableOpacity>
                      <Text style={styles.qtyNum}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQuantity(item.offerId, item.quantity + 1)}>
                        <Ionicons name="add" size={16} color={C.text} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cartItemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => { removeFromCart(item.offerId); showToast(`"${item.title}" removed`, 'info'); }}>
                      <Ionicons name="trash-outline" size={18} color={C.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            {/* Bottom summary */}
            <View style={styles.bottomBar}>
              <View style={styles.totals}>
                <View style={styles.totalRow}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text></View>
                <View style={styles.totalRow}><Text style={styles.totalLabel}>Tax</Text><Text style={styles.totalValue}>${tax.toFixed(2)}</Text></View>
                <View style={styles.totalRow}><Text style={styles.totalLabel}>Delivery</Text><Text style={styles.totalValue}>{delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}</Text></View>
                <View style={[styles.totalRow, { marginTop: 4 }]}><Text style={[styles.totalLabel, { color: C.text, fontWeight: '800' }]}>Total</Text><Text style={[styles.totalValue, { color: C.success, fontWeight: '800', fontSize: 18 }]}>${finalTotal.toFixed(2)}</Text></View>
              </View>
              <TouchableOpacity onPress={() => setStep('checkout')} activeOpacity={0.85} style={styles.ctaWrap}>
                <LinearGradient colors={[C.primary, '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                  <Ionicons name="card-outline" size={20} color="#fff" />
                  <Text style={styles.ctaText}>Proceed to Checkout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  shopBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: C.primary },

  list: { paddingHorizontal: 16, paddingBottom: 20 },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  cartCount: { fontSize: 14, fontWeight: '700', color: C.text },
  cartItem: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 14, padding: 12, marginBottom: 10, gap: 12, borderWidth: 1, borderColor: C.border },
  cartItemIcon: { width: 52, height: 52, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.1)', justifyContent: 'center', alignItems: 'center' },
  cartItemContent: { flex: 1 },
  cartItemTitle: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 2 },
  cartItemSeller: { fontSize: 11, color: C.muted, marginBottom: 4 },
  cartItemPrice: { fontSize: 12, color: C.muted },
  cartItemActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#0A1628', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  qtyNum: { fontSize: 14, fontWeight: '700', color: C.text, minWidth: 20, textAlign: 'center' },
  cartItemTotal: { fontSize: 14, fontWeight: '800', color: C.success },

  bottomBar: { backgroundColor: '#0A1628', borderTopWidth: 1, borderTopColor: C.border, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  totals: { gap: 4, marginBottom: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 13, color: C.muted },
  totalValue: { fontSize: 13, fontWeight: '600', color: C.text },

  scroll: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 40 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  field: { backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: C.text, fontSize: 14, borderWidth: 1, borderColor: C.border, minHeight: 60, textAlignVertical: 'top' },
  fieldErr: { borderColor: '#F87171' + '60' },
  errText: { color: '#F87171', fontSize: 12, marginTop: 4 },
  paymentList: { gap: 8 },
  paymentChip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: C.border },
  paymentChipActive: { borderColor: C.primary + '60', backgroundColor: 'rgba(56,189,248,0.06)' },
  paymentChipText: { fontSize: 14, color: C.muted },
  summaryCard: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginTop: 20, borderWidth: 1, borderColor: C.border },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryItemName: { fontSize: 12, color: C.muted, flex: 1 },
  summaryItemPrice: { fontSize: 12, fontWeight: '600', color: C.text },
  summaryLabel: { fontSize: 13, color: C.muted },
  summaryValue: { fontSize: 13, fontWeight: '600', color: C.text },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 8 },

  ctaWrap: { borderRadius: 14, overflow: 'hidden' },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  successCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  successTitle: { fontSize: 26, fontWeight: '800', color: C.text },
  successSub: { fontSize: 14, color: C.muted, textAlign: 'center', maxWidth: 260 },
  successActions: { width: '100%', gap: 10, marginTop: 8 },
  successBtnPrimary: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  successBtnSecondary: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.primary },
});
