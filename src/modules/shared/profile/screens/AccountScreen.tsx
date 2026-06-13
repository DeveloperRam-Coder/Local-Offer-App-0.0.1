import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';

const C = {
  card: '#1E293B',
  border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  danger: '#EF4444',
  text: '#F1F5F9',
  muted: '#94A3B8',
  subtle: '#475569',
};

type MenuItem = { icon: string; label: string; sub: string; screen: string; color?: string };

const BUYER_MENU: MenuItem[] = [
  { icon: 'person-outline', label: 'My Profile', sub: 'View & edit your profile', screen: 'BuyerProfile' },
  { icon: 'receipt-outline', label: 'Order History', sub: 'Track your purchases', screen: 'OrderHistory' },
  { icon: 'heart-outline', label: 'Favorites', sub: 'Your wishlisted items', screen: 'Favorites' },
  { icon: 'cart-outline', label: 'Cart', sub: 'Items ready to checkout', screen: 'Cart' },
  { icon: 'chatbubbles-outline', label: 'Messages', sub: 'Chat with sellers', screen: 'Messages' },
  { icon: 'notifications-outline', label: 'Notifications', sub: 'Alerts & updates', screen: 'Notifications' },
  { icon: 'settings-outline', label: 'Settings', sub: 'App preferences', screen: 'Settings' },
];

const SELLER_MENU: MenuItem[] = [
  { icon: 'analytics-outline', label: 'Dashboard', sub: 'Your performance overview', screen: 'SellerDashboard' },
  { icon: 'pricetags-outline', label: 'Manage Offers', sub: 'Edit your listings', screen: 'ManageOffers' },
  { icon: 'add-circle-outline', label: 'New Offer', sub: 'Create a new listing', screen: 'NewOffer', color: C.success },
  { icon: 'bar-chart-outline', label: 'Analytics', sub: 'Sales & views insights', screen: 'AnalyticsScreen' },
  { icon: 'wallet-outline', label: 'Payments', sub: 'Revenue & payouts', screen: 'PaymentsScreen' },
  { icon: 'chatbubbles-outline', label: 'Messages', sub: 'Chat with buyers', screen: 'SellerMessages' },
  { icon: 'notifications-outline', label: 'Notifications', sub: 'Alerts & updates', screen: 'Notifications' },
  { icon: 'settings-outline', label: 'Settings', sub: 'App preferences', screen: 'Settings' },
];

export default function AccountScreen({ navigation }: any) {
  const { user, logout } = useApp();
  const menu = user?.role === 'seller' ? SELLER_MENU : BUYER_MENU;
  const roleColor = user?.role === 'seller' ? C.success : C.primary;

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Avatar card */}
          <View style={styles.profileCard}>
            <View style={[styles.avatar, { borderColor: roleColor + '60' }]}>
              <Ionicons name="person-circle-outline" size={52} color={roleColor} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
              <Text style={styles.email}>{user?.email ?? '—'}</Text>
              <View style={[styles.roleBadge, { backgroundColor: roleColor + '18', borderColor: roleColor + '40' }]}>
                <Ionicons name={user?.role === 'seller' ? 'storefront-outline' : 'cart-outline'} size={12} color={roleColor} />
                <Text style={[styles.roleText, { color: roleColor }]}>
                  {user?.role === 'seller' ? 'Seller' : 'Buyer'}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu items */}
          <View style={styles.menuCard}>
            {menu.map((item, i) => (
              <TouchableOpacity
                key={item.screen}
                style={[styles.menuItem, i < menu.length - 1 && styles.menuDivider]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: (item.color ?? C.primary) + '15' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color ?? C.primary} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSub}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={C.subtle} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={logout} activeOpacity={0.85} style={styles.logoutWrap}>
            <LinearGradient
              colors={['rgba(239,68,68,0.12)', 'rgba(239,68,68,0.08)']}
              style={styles.logoutBtn}
            >
              <Ionicons name="log-out-outline" size={20} color={C.danger} />
              <Text style={styles.logoutText}>Log Out</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.version}>LocalOffer v0.0.1</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.card, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
  },
  profileInfo: { flex: 1, gap: 3 },
  name: { fontSize: 18, fontWeight: '700', color: C.text },
  email: { fontSize: 13, color: C.muted },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20, borderWidth: 1, marginTop: 4,
  },
  roleText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  menuCard: {
    backgroundColor: C.card, borderRadius: 20,
    borderWidth: 1, borderColor: C.border, marginBottom: 14, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: C.border },
  menuIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: C.text },
  menuSub: { fontSize: 12, color: C.muted, marginTop: 1 },

  logoutWrap: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)',
  },
  logoutText: { color: C.danger, fontSize: 16, fontWeight: '700' },

  version: { color: C.subtle, fontSize: 12, textAlign: 'center' },
});
