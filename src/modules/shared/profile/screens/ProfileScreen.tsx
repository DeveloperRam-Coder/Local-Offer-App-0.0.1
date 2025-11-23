import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';

export default function ProfileScreen({ navigation }: any) {
  const demoBuyer = { email: 'buyer@example.com', password: 'password' };
  const demoSeller = { email: 'seller@example.com', password: 'password' };

  const onUseBuyer = () => navigation.navigate('Login', { email: demoBuyer.email, password: demoBuyer.password });
  const onUseSeller = () => navigation.navigate('Login', { email: demoSeller.email, password: demoSeller.password });

  const onShare = async (creds: { email: string; password: string }) => {
    await Share.share({ message: `Demo credentials:\nemail: ${creds.email}\npassword: ${creds.password}` });
  };

  return (
    <View style={styles.container}>
      {/* Header removed — navigator header will provide title */}
      <View style={styles.card}>
        <Text style={styles.heading}>Demo Credentials</Text>
        <Text style={styles.label}>Buyer</Text>
        <Text style={styles.value}>Email: {demoBuyer.email}</Text>
        <Text style={styles.value}>Password: {demoBuyer.password}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={onUseBuyer}><Text style={styles.btnText}>Use Buyer</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnAlt} onPress={() => onShare(demoBuyer)}><Text style={styles.btnAltText}>Share</Text></TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Seller</Text>
        <Text style={styles.value}>Email: {demoSeller.email}</Text>
        <Text style={styles.value}>Password: {demoSeller.password}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={onUseSeller}><Text style={styles.btnText}>Use Seller</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnAlt} onPress={() => onShare(demoSeller)}><Text style={styles.btnAltText}>Share</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf8' },
  card: { margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  label: { color: '#4ca987', fontWeight: '700', marginTop: 8 },
  value: { color: '#111', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  btn: { backgroundColor: '#32e06c', padding: 12, borderRadius: 10, flex: 1, marginRight: 8, alignItems: 'center' },
  btnText: { color: '#111', fontWeight: '700' },
  btnAlt: { backgroundColor: '#eaf7f0', padding: 12, borderRadius: 10, flex: 1, marginLeft: 8, alignItems: 'center' },
  btnAltText: { color: '#111' },
});
