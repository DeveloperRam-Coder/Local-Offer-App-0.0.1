import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';
import { useToast } from '../../../../context/ToastContext';

const C = {
  card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399', danger: '#EF4444',
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569',
};

export default function ProfileScreen({ navigation }: any) {
  const { user } = useApp();
  const { showToast } = useToast();

  const isSeller = user?.role === 'seller';

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={[styles.avatar, { borderColor: (isSeller ? C.success : C.primary) + '60' }]}>
              <Ionicons name="person-circle-outline" size={48} color={isSeller ? C.success : C.primary} />
            </View>
            <Text style={styles.name}>{user?.name ?? 'User'}</Text>
            <Text style={styles.email}>{user?.email ?? '—'}</Text>
            <View style={[styles.badge, { backgroundColor: (isSeller ? C.success : C.primary) + '18' }]}>
              <Ionicons name={isSeller ? 'storefront-outline' : 'cart-outline'} size={12} color={isSeller ? C.success : C.primary} />
              <Text style={[styles.badgeText, { color: isSeller ? C.success : C.primary }]}>
                {isSeller ? 'Seller Account' : 'Buyer Account'}
              </Text>
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.section}>
            {isSeller ? (
              <>
                <MenuItem icon="analytics-outline" color={C.primary} label="Dashboard" onPress={() => navigation.navigate('Main', { screen: 'SellerDashboard' })} />
                <MenuItem icon="pricetags-outline" color={C.accent} label="My Offers" onPress={() => navigation.navigate('ManageOffers')} />
                <MenuItem icon="bar-chart-outline" color={C.success} label="Analytics" onPress={() => navigation.navigate('AnalyticsScreen')} />
                <MenuItem icon="wallet-outline" color="#A78BFA" label="Payments" onPress={() => navigation.navigate('PaymentsScreen')} />
              </>
            ) : (
              <>
                <MenuItem icon="person-outline" color={C.primary} label="My Profile" onPress={() => navigation.navigate('BuyerProfile')} />
                <MenuItem icon="receipt-outline" color={C.accent} label="Order History" onPress={() => navigation.navigate('OrderHistory')} />
                <MenuItem icon="heart-outline" color="#F87171" label="Favorites" onPress={() => navigation.navigate('Favorites')} />
                <MenuItem icon="cart-outline" color={C.success} label="Cart" onPress={() => navigation.navigate('Cart')} />
              </>
            )}
          </View>

          <View style={styles.section}>
            <MenuItem icon="notifications-outline" color={C.primary} label="Notifications" onPress={() => navigation.navigate('Notifications')} />
            <MenuItem icon="settings-outline" color={C.muted} label="Settings" onPress={() => navigation.navigate('Settings')} />
            <MenuItem icon="help-circle-outline" color={C.muted} label="Help & Support" onPress={() => showToast('Help centre coming soon', 'info')} />
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function MenuItem({ icon, color, label, onPress }: { icon: string; color: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={C.subtle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  profileCard: {
    alignItems: 'center', gap: 6,
    backgroundColor: C.card, borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  name: { fontSize: 20, fontWeight: '800', color: C.text },
  email: { fontSize: 13, color: C.muted },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },

  section: {
    backgroundColor: C.card, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
});
