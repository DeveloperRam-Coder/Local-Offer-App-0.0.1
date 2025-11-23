import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBuyerCart } from '../hooks';
import { DEFAULT_CART_IMAGE } from '../../../assets/images';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    subtle: '#94A3B8',
  },
  border: '#334155',
};

interface CartScreenProps {
  navigation?: any;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useBuyerCart();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Image
          source={DEFAULT_CART_IMAGE}
          style={styles.itemImage}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemSeller}>{item.sellerName}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.itemActions}>
        {/* Quantity Controls */}
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.offerId, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={16} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.offerId, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={16} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.offerId)}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        {cart.items.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => clearCart()}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.accent} />
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items */}
      {cart.items.length > 0 ? (
        <>
          <FlatList
            data={cart.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.offerId}
            scrollEnabled={false}
            contentContainerStyle={styles.itemsContainer}
          />

          {/* Summary Section */}
          <LinearGradient
            colors={['#0F172A', '#1E293B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.summaryContainer}
          >
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${cart.subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>${cart.tax.toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${cart.total.toFixed(2)}</Text>
              </View>

              {/* Checkout Button */}
              <LinearGradient
                colors={[COLORS.primary, '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkoutButton}
              >
                <TouchableOpacity
                  style={styles.checkoutButtonContent}
                  onPress={() => navigation?.navigate('Checkout')}
                >
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                  <Ionicons name="arrow-forward" size={18} color="#0F172A" />
                </TouchableOpacity>
              </LinearGradient>

              {/* Continue Shopping */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation?.navigate('BuyerHome')}
              >
                <Text style={styles.continueButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={56} color={COLORS.text.subtle} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add items to get started</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation?.navigate('BuyerHome')}
            >
              <LinearGradient
                colors={[COLORS.primary, '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyButtonGradient}
              >
                <Text style={styles.emptyButtonText}>Start Shopping</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.text.subtle,
  },
  clearButton: {
    padding: 8,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  itemImageContainer: {
    width: 80,
    height: 80,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111827',
  },
  itemContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  itemSeller: {
    fontSize: 11,
    color: COLORS.text.subtle,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  itemActions: {
    width: 100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
    minWidth: 18,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summary: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  checkoutButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  checkoutButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  checkoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  continueButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.text.subtle,
    marginBottom: 24,
  },
  emptyButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
});
