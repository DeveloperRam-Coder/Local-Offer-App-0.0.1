import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../../../../context/AppContext';

export default function NewOfferScreen({ navigation }: any) {
  const { createOffer, user } = useApp();
  const [title, setTitle] = useState('New Product');
  const [description, setDescription] = useState('Short description');
  const [price, setPrice] = useState('10');

  const onSubmit = () => {
    const p = Number(price);
    if (!title || !description || isNaN(p)) return;
    const created = createOffer({ title, description, price: p });
    if (created) {
      Alert.alert('Offer created', 'Your offer has been posted.');
      navigation.navigate('Main', { screen: 'ManageOffers' });
    } else {
      Alert.alert('Not allowed', 'Only sellers can create offers.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header removed — navigator header will provide title */}
      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" style={[styles.input, { height: 100 }]} value={description} onChangeText={setDescription} multiline />
      <TextInput placeholder="Price" style={styles.input} value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
      <TouchableOpacity onPress={onSubmit} style={[styles.button, { opacity: user?.role === 'seller' ? 1 : 0.6 }]}>
        <Text style={styles.buttonText}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  button: { backgroundColor: '#111827', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
