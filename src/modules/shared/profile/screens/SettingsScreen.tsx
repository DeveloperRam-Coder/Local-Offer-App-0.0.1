import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../common/components/layout';
import { useApp } from '../../../../context/AppContext';

export default function SettingsScreen({ navigation }: any) {
  const { user } = useApp();

  return (
    <ScreenWrapper>
      <View style={styles.row}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{user?.email ?? 'guest@example.com'}</Text>
      </View>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.itemText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Notifications')}>
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Favorites')}>
        <Text style={styles.itemText}>Favorites</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 24 },
  label: { color: '#94A3B8', fontSize: 13 },
  value: { color: '#F8FAFC', fontSize: 16, fontWeight: '600', marginTop: 6 },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  itemText: { color: '#E2E8F0', fontSize: 16 },
});
