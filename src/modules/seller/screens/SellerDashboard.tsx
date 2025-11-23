import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useSellerAnalytics } from '../hooks';
import { StatCard, AnalyticsChart } from '../components';
import { generateMockProfile } from '../utils';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  success: '#34D399',
};

export default function SellerDashboard({ navigation }: any) {
  const { user, myOffers } = useApp();
  const { analytics, loading, refreshAnalytics } = useSellerAnalytics();
  const [profile] = useState(generateMockProfile());
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshAnalytics().then(() => setRefreshing(false));
  }, [refreshAnalytics]);

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.accent} />
          <Text style={styles.noticeText}>Only sellers can access this dashboard.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#1E3A8A']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Welcome Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{profile.name}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <StatCard
              icon="cash-outline"
              label="Total Earnings"
              value={`$${analytics.totalEarnings.toFixed(2)}`}
              color={COLORS.success}
            />
            <StatCard
              icon="trending-up-outline"
              label="Total Sales"
              value={analytics.totalSales}
              color={COLORS.primary}
            />
            <StatCard
              icon="star-outline"
              label="Rating"
              value={`${analytics.rating}/5.0`}
              color={COLORS.accent}
            />
            <StatCard
              icon="time-outline"
              label="Avg. Response Time"
              value={`${analytics.responseTime}m`}
              color={COLORS.primary}
            />
          </View>

          {/* Analytics Charts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Views</Text>
            <AnalyticsChart
              data={analytics.weeklyViews}
              title="Views by Day"
              barColor={COLORS.primary}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Sales</Text>
            <AnalyticsChart
              data={analytics.monthlySales.slice(0, 7)}
              title="Sales Last 7 Days"
              barColor={COLORS.success}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('NewOffer')}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.text} />
              <Text style={styles.actionText}>Create New Offer</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ManageOffers')}
            >
              <Ionicons name="pricetags-outline" size={20} color={COLORS.text} />
              <Text style={styles.actionText}>Manage Offers ({myOffers.length})</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('SellerMessages')}
            >
              <Ionicons name="chatbubbles-outline" size={20} color={COLORS.text} />
              <Text style={styles.actionText}>Messages</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </TouchableOpacity>
          </View>

          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{profile.location}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Response Time:</Text>
                <Text style={styles.infoValue}>{profile.responseTime}m avg</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member Since:</Text>
                <Text style={styles.infoValue}>
                  {new Date(profile.joinDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.subtle,
    fontWeight: '500',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },
  verifiedBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 12,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.subtle,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
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
