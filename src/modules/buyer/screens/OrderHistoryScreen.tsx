import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBuyerHistory } from '../hooks';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  warning: '#FBBF24',
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    subtle: '#94A3B8',
  },
  border: '#334155',
};

const statusColors: Record<string, string> = {
  pending: '#FBBF24',
  confirmed: '#38BDF8',
  shipped: '#8B5CF6',
  delivered: '#34D399',
  cancelled: '#EF4444',
};

interface OrderHistoryScreenProps {
  navigation?: any;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ navigation }) => {
  const { orders } = useBuyerHistory();
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'time';
      case 'confirmed':
        return 'checkmark-circle';
      case 'shipped':
        return 'airplane';
      case 'delivered':
        return 'checkmark-done-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderOrder = ({ item }: { item: any }) => {
    const isExpanded = expandedOrder === item.id;

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => setExpandedOrder(isExpanded ? null : item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.headerLeft}>
            <View style={styles.orderNumberBadge}>
              <Text style={styles.orderNumber}>#{item.id.substring(2)}</Text>
            </View>
            <View style={styles.orderMeta}>
              <Text style={styles.offerTitle} numberOfLines={1}>
                {item.offerTitle}
              </Text>
              <Text style={styles.orderDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.text.subtle}
            />
          </View>
        </TouchableOpacity>

        {/* Status Badge */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[item.status] + '20' },
            ]}
          >
            <Ionicons
              name={getStatusIcon(item.status)}
              size={14}
              color={statusColors[item.status]}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>{item.quantity}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price per item</Text>
              <Text style={styles.detailValue}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seller</Text>
              <Text style={styles.detailValue}>{item.sellerName}</Text>
            </View>

            {item.trackingNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tracking</Text>
                <Text style={styles.detailValue}>{item.trackingNumber}</Text>
              </View>
            )}

            {item.deliveryDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Delivery Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(item.deliveryDate).toLocaleDateString()}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              {item.status === 'delivered' && (
                <>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="star-outline" size={16} color={COLORS.accent} />
                    <Text style={styles.actionButtonText}>Leave Review</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="reload" size={16} color={COLORS.primary} />
                    <Text style={styles.actionButtonText}>Reorder</Text>
                  </TouchableOpacity>
                </>
              )}
              {['pending', 'confirmed', 'shipped'].includes(item.status) && (
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.actionButtonText}>Track</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterButtons.map((btn) => (
          <TouchableOpacity
            key={btn.value}
            style={[styles.filterButton, filter === btn.value && styles.filterButtonActive]}
            onPress={() => setFilter(btn.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === btn.value && styles.filterButtonTextActive,
              ]}
            >
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={48} color={COLORS.text.subtle} />
          <Text style={styles.emptyStateText}>No orders found</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  filterButtonTextActive: {
    color: '#0F172A',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderNumberBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  orderMeta: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.text.subtle,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statusRow: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#111827',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.text.subtle,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.text.subtle,
  },
});
