import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../../../context/ToastContext';

const C = {
  card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399',
  text: '#F1F5F9', muted: '#94A3B8',
};

const ICON_MAP: Record<string, string> = {
  'new-offer': 'pricetag-outline',
  'price-drop': 'trending-down-outline',
  'order-update': 'cube-outline',
  'message': 'chatbubble-outline',
};

const COLOR_MAP: Record<string, string> = {
  'new-offer': C.primary, 'price-drop': C.success,
  'order-update': C.accent, 'message': '#A78BFA',
};

const DEMO = [
  { id: 'n-1', type: 'new-offer', title: 'New offer near you!', body: 'Fresh organic vegetables just listed nearby', timestamp: new Date().toISOString(), read: false },
  { id: 'n-2', type: 'price-drop', title: 'Price dropped', body: 'Handmade Wallet reduced from $30 to $24', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
  { id: 'n-3', type: 'order-update', title: 'Order shipped!', body: 'Your order #o-1 is on its way', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
  { id: 'n-4', type: 'message', title: 'New message', body: 'Local Farm Market sent you a message', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
];

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsScreen() {
  const { showToast } = useToast();
  const [items, setItems] = useState(DEMO);

  const unread = items.filter((i) => !i.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, read: true } : i));
  };

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

        {unread > 0 && (
          <TouchableOpacity style={styles.markAllRow} onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all as read ({unread})</Text>
            <Ionicons name="checkmark-done-outline" size={16} color={C.primary} />
          </TouchableOpacity>
        )}

        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={48} color={C.muted} />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
          renderItem={({ item }) => {
            const color = COLOR_MAP[item.type] ?? C.primary;
            const icon = ICON_MAP[item.type] ?? 'information-circle-outline';
            return (
              <TouchableOpacity
                style={[styles.item, !item.read && styles.itemUnread]}
                onPress={() => markRead(item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.body}>{item.body}</Text>
                  <Text style={styles.time}>{timeAgo(item.timestamp)}</Text>
                </View>
                {!item.read && <View style={[styles.dot, { backgroundColor: color }]} />}
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  markAllRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: 6, paddingHorizontal: 16, paddingVertical: 10,
  },
  markAllText: { color: C.primary, fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: C.card, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  itemUnread: { borderColor: 'rgba(56,189,248,0.25)', backgroundColor: 'rgba(56,189,248,0.05)' },
  iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 2 },
  body: { fontSize: 13, color: C.muted, marginBottom: 4, lineHeight: 18 },
  time: { fontSize: 11, color: '#475569' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { color: C.muted, fontSize: 15 },
});
