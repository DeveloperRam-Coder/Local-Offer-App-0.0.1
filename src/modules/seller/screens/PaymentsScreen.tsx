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
import { useApp } from '../../../context/AppContext';
import { useSellerTransactions } from '../hooks';
import { StatCard, FilterBar } from '../components';
import { formatRelativeTime } from '../../common/utils';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  success: '#34D399',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
];

export default function PaymentsScreen() {
  const { user } = useApp();
  const { transactions, filter, setFilter, totalEarnings, totalCount } =
    useSellerTransactions();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.accent} />
          <Text style={styles.noticeText}>Only sellers can view payments.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const completedTransactions = transactions.filter((t) => t.status === 'completed');
  const pendingTransactions = transactions.filter((t) => t.status === 'pending');

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#1E3A8A']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Payments & Earnings</Text>
          </View>

          {/* Earnings Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earnings Summary</Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Earnings</Text>
                <Text style={styles.summaryAmount}>${totalEarnings.toFixed(2)}</Text>
                <Text style={styles.summaryDescription}>From all sales</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Completed</Text>
                <Text style={styles.summaryAmount}>{completedTransactions.length}</Text>
                <Text style={styles.summaryDescription}>Transactions</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Pending</Text>
                <Text style={styles.summaryAmount}>{pendingTransactions.length}</Text>
                <Text style={styles.summaryDescription}>Awaiting payment</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <StatCard
              icon="trending-up-outline"
              label="Average Transaction"
              value={`$${(totalEarnings / (totalCount || 1)).toFixed(2)}`}
              color={COLORS.primary}
            />
            <StatCard
              icon="wallet-outline"
              label="Monthly Payout"
              value={`$${(totalEarnings * 0.9).toFixed(2)}`}
              color={COLORS.success}
            />
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethodCard}>
              <View style={styles.methodHeader}>
                <Ionicons name="card-outline" size={24} color={COLORS.primary} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Stripe Account</Text>
                  <Text style={styles.methodEmail}>••••••••@stripe.com</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change Method</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter */}
          <View style={styles.filterSection}>
            <FilterBar
              filters={FILTERS}
              activeFilter={filter}
              onFilterChange={(value) => setFilter(value as any)}
            />
          </View>

          {/* Transactions List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="cash-outline" size={48} color={COLORS.subtle} />
                <Text style={styles.emptyTitle}>No Transactions</Text>
              </View>
            ) : (
              <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.transactionItem,
                      item.status === 'pending' && styles.transactionPending,
                    ]}
                  >
                    <View style={styles.transactionIcon}>
                      <Ionicons
                        name={
                          item.status === 'completed'
                            ? 'checkmark-circle'
                            : 'time-outline'
                        }
                        size={20}
                        color={
                          item.status === 'completed'
                            ? COLORS.success
                            : COLORS.warning
                        }
                      />
                    </View>

                    <View style={styles.transactionContent}>
                      <Text style={styles.offerTitle} numberOfLines={1}>
                        {item.offerTitle}
                      </Text>
                      <Text style={styles.buyerName}>From: {item.buyerName}</Text>
                      <Text style={styles.transactionDate}>
                        {formatRelativeTime(new Date(item.date))}
                      </Text>
                    </View>

                    <View style={styles.transactionAmount}>
                      <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                      <Text
                        style={[
                          styles.status,
                          item.status === 'completed'
                            ? styles.completedStatus
                            : styles.pendingStatus,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                )}
                scrollEnabled={false}
              />
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '500',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: 11,
    color: COLORS.subtle,
  },
  paymentMethodCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  methodEmail: {
    fontSize: 12,
    color: COLORS.subtle,
    marginTop: 2,
  },
  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  transactionPending: {
    borderColor: COLORS.warning,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  buyerName: {
    fontSize: 12,
    color: COLORS.subtle,
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: COLORS.subtle,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  completedStatus: {
    color: COLORS.success,
  },
  pendingStatus: {
    color: COLORS.warning,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    color: COLORS.subtle,
    marginTop: 12,
    fontWeight: '600',
  },
  noticeText: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 16,
  },
  spacer: {
    height: 20,
  },
});
