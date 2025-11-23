import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useSellerAnalytics } from '../hooks';
import { StatCard, AnalyticsChart } from '../components';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  success: '#34D399',
  danger: '#EF4444',
};

export default function AnalyticsScreen() {
  const { user } = useApp();
  const { analytics, loading, refreshAnalytics } = useSellerAnalytics();
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

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
          <Text style={styles.noticeText}>Only sellers can view analytics.</Text>
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
          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
            {(['week', 'month', 'year'] as const).map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.timeRangeButton,
                  timeRange === range && styles.activeTimeRange,
                ]}
                onPress={() => setTimeRange(range)}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === range && styles.activeTimeRangeText,
                  ]}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Key Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <StatCard
              icon="trending-up-outline"
              label="Conversion Rate"
              value={`${analytics.conversionRate}%`}
              color={COLORS.success}
            />
            <StatCard
              icon="eye-outline"
              label="Total Views"
              value={analytics.weeklyViews.reduce((a, b) => a + b, 0)}
              color={COLORS.primary}
            />
            <StatCard
              icon="cash-outline"
              label="Total Earnings"
              value={`$${analytics.totalEarnings.toFixed(2)}`}
              color={COLORS.success}
            />
            <StatCard
              icon="star-outline"
              label="Seller Rating"
              value={`${analytics.rating}/5`}
              color={COLORS.accent}
            />
          </View>

          {/* Views Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Views Trend</Text>
            <AnalyticsChart
              data={analytics.weeklyViews}
              title="Views by Day of Week"
              barColor={COLORS.primary}
            />
            <View style={styles.chartStats}>
              <View style={styles.chartStat}>
                <Text style={styles.chartStatLabel}>Peak Day:</Text>
                <Text style={styles.chartStatValue}>
                  {analytics.weeklyViews.indexOf(Math.max(...analytics.weeklyViews)) + 1} ({Math.max(...analytics.weeklyViews)} views)
                </Text>
              </View>
              <View style={styles.chartStat}>
                <Text style={styles.chartStatLabel}>Avg Daily:</Text>
                <Text style={styles.chartStatValue}>
                  {(analytics.weeklyViews.reduce((a, b) => a + b, 0) / analytics.weeklyViews.length).toFixed(0)} views
                </Text>
              </View>
            </View>
          </View>

          {/* Sales Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Sales</Text>
            <AnalyticsChart
              data={analytics.monthlySales.slice(0, 7)}
              title="Sales Last 7 Days"
              barColor={COLORS.success}
            />
            <View style={styles.chartStats}>
              <View style={styles.chartStat}>
                <Text style={styles.chartStatLabel}>Total:</Text>
                <Text style={styles.chartStatValue}>
                  ${analytics.monthlySales.slice(0, 7).reduce((a, b) => a + b, 0) * 50} estimated
                </Text>
              </View>
              <View style={styles.chartStat}>
                <Text style={styles.chartStatLabel}>Peak:</Text>
                <Text style={styles.chartStatValue}>
                  {Math.max(...analytics.monthlySales.slice(0, 7))} sales
                </Text>
              </View>
            </View>
          </View>

          {/* Performance Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Response Time</Text>
                  <Text style={styles.summaryValue}>{analytics.responseTime}m</Text>
                  <Text style={styles.summaryDescription}>Average</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Reviews</Text>
                  <Text style={styles.summaryValue}>{analytics.reviewCount}</Text>
                  <Text style={styles.summaryDescription}>From buyers</Text>
                </View>
              </View>
              <View style={styles.summaryRowDivider} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Sales</Text>
                  <Text style={styles.summaryValue}>{analytics.totalSales}</Text>
                  <Text style={styles.summaryDescription}>Completed</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Rating</Text>
                  <Text style={styles.summaryValue}>{analytics.rating}</Text>
                  <Text style={styles.summaryDescription}>Out of 5</Text>
                </View>
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
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  activeTimeRange: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.subtle,
  },
  activeTimeRangeText: {
    color: '#fff',
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
  chartStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  chartStat: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chartStatLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '500',
    marginBottom: 4,
  },
  chartStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryRowDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#334155',
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: 11,
    color: COLORS.subtle,
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
