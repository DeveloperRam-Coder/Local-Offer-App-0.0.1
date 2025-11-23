import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ScreenWrapper } from '../../../common/components/layout';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';

// 🎨 Same color palette as onboarding/login
const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  secondary: '#34D399',
  text: '#F8FAFC',
};

export default function RegisterScreen({ navigation }: any) {
  const { register } = useApp();
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('buyer@example.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');

  const onSubmit = async () => {
    const ok = await register(name.trim(), email.trim(), password, role);
    if (!ok) {
      Alert.alert('Error', 'Please provide name, email, and password');
      return;
    }

    Alert.alert('Welcome', `Registered as ${role}`, [
      { 
        text: 'Continue', 
        onPress: () => {
          // Navigate to the correct initial screen based on role
          if (role === 'seller') {
            navigation.navigate('Main', { screen: 'SellerHome' });
          } else {
            navigation.navigate('Main', { screen: 'BuyerHome' });
          }
        }
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join and start your journey</Text>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Full name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Role Selection */}
            <View style={styles.roleRow}>
              <TouchableOpacity
                onPress={() => setRole('buyer')}
                style={[
                  styles.roleBtn,
                  role === 'buyer' && { backgroundColor: COLORS.primary },
                ]}
              >
                <Ionicons
                  name="cart-outline"
                  size={18}
                  color={role === 'buyer' ? '#fff' : '#9CA3AF'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'buyer' && { color: '#fff' },
                  ]}
                >
                  I'm a Buyer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('seller')}
                style={[
                  styles.roleBtn,
                  role === 'seller' && { backgroundColor: COLORS.secondary },
                ]}
              >
                <Ionicons
                  name="storefront-outline"
                  size={18}
                  color={role === 'seller' ? '#fff' : '#9CA3AF'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'seller' && { color: '#fff' },
                  ]}
                >
                  I'm a Seller
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity onPress={onSubmit} style={styles.button}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Register</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Link to Login */}
            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
              style={styles.linkBtn}
            >
              <Text style={styles.link}>
                Have an account? <Text style={styles.linkHighlight}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 12,
    fontSize: 16,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  roleText: {
    color: '#CBD5E1',
    fontSize: 15,
  },
  button: {
    alignSelf: 'center',
    width: '100%',
    marginTop: 24,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  linkBtn: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  link: {
    color: '#CBD5E1',
    fontSize: 15,
  },
  linkHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
