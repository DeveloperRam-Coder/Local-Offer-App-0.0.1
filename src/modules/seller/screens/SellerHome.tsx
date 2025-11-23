import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  border: '#334155',
};

const { width } = Dimensions.get('window');

interface SellerStats {
  activeOffers: number;
  totalSales: number;
  earnings: number;
  reviews: number;
}

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: string;
}

export default function SellerHome({ navigation }: any) {
  const { user } = useApp();
  const [stats] = useState<SellerStats>({
    activeOffers: 12,
    totalSales: 45,
    earnings: 1250.5,
    reviews: 4.8,
  });

  const quickActions: QuickActionItem[] = [
    {
      id: '1',
      title: 'Create Offer',
      subtitle: 'List a new product',
      icon: 'add-circle-outline',
      color: COLORS.primary,
      action: 'NewOffer',
    },
    {
      id: '2',
      title: 'My Offers',
      subtitle: 'View & manage',
      icon: 'briefcase-outline',
      color: COLORS.accent,
      action: 'ManageOffers',
    },
    {
      id: '3',
      title: 'Messages',
      subtitle: 'Chat with buyers',
      icon: 'chatbubbles-outline',
      color: COLORS.success,
      action: 'SellerMessages',
    },
    {
      id: '4',
      title: 'Analytics',
      subtitle: 'View insights',
      icon: 'analytics-outline',
      color: '#8B5CF6',
      action: 'AnalyticsScreen',
    },
  ];

  const handleNavigate = (action: string) => {
    navigation.navigate('Main', { screen: action });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Welcome Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back! 👋</Text>
              <Text style={styles.name}>{user?.name || 'Seller'}</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationBell}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <StatCard
              icon="briefcase-outline"
              label="Active Offers"
              value={stats.activeOffers.toString()}
              color={COLORS.primary}
            />
            <StatCard
              icon="cash-outline"
              label="Total Earnings"
              value={`$${stats.earnings.toFixed(0)}`}
              color={COLORS.success}
            />
          </View>

          <View style={styles.statsContainer}>
            <StatCard
              icon="checkmark-done-circle-outline"
              label="Total Sales"
              value={stats.totalSales.toString()}
              color={COLORS.accent}
            />
            <StatCard
              icon="star-outline"
              label="Rating"
              value={stats.reviews.toFixed(1)}
              color="#8B5CF6"
            />
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleNavigate(action.action)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: `${action.color}20` },
                  ]}
                >
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: COLORS.success }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New Order Received</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </View>
            <View style={styles.divider} />
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: COLORS.primary }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Product Viewed 15 times</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </View>
            <View style={styles.divider} />
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: COLORS.accent }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Message from buyer</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => handleNavigate('AnalyticsScreen')}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>View Dashboard</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.subtle,
    fontWeight: '500',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  notificationBell: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.subtle,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  activityItem: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.subtle,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  ctaButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  spacer: {
    height: 20,
  },
});
