import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../../common/components/layout';
import { useApp } from '../../../../context/AppContext';

export default function NotificationsScreen() {
  const { notifications = [] } = useApp() as any;

  return (
    <ScreenWrapper>
      <FlatList
        data={notifications}
        keyExtractor={(i: any, idx: number) => i.id ?? String(idx)}
        ListEmptyComponent={() => (
          <View style={styles.empty}><Text style={styles.emptyText}>No notifications yet.</Text></View>
        )}
        renderItem={({ item }: any) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>{item.body}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  title: { color: '#F8FAFC', fontWeight: '600' },
  meta: { color: '#94A3B8', marginTop: 4 },
  empty: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#94A3B8' },
});
