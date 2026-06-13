import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';

const C = {
  bg: '#060D1F',
  card: '#1E293B',
  border: 'rgba(255,255,255,0.08)',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  text: '#F1F5F9',
  muted: '#94A3B8',
  error: '#F87171',
};

export default function RegisterScreen({ navigation }: any) {
  const { register, isAuthenticated, user } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: user.role === 'seller' ? 'SellerDashboard' : 'BuyerHome' } }],
      });
    }
  }, [isAuthenticated, user]);

  const onSubmit = async () => {
    if (loading) return;
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    const ok = await register(name.trim(), email.trim(), password, role);
    setLoading(false);
    if (!ok) Alert.alert('Error', 'Registration failed. Please try again.');
  };

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kav}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand */}
            <View style={styles.brand}>
              <View style={styles.logoCircle}>
                <Ionicons name="pricetag-outline" size={32} color={C.primary} />
              </View>
              <Text style={styles.brandName}>LocalOffer</Text>
            </View>

            <Text style={styles.heading}>Create account</Text>
            <Text style={styles.subheading}>Join thousands of local buyers & sellers</Text>

            {/* Role picker */}
            <View style={styles.roleRow}>
              {(['buyer', 'seller'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, role === r && { borderColor: r === 'buyer' ? C.primary : C.success, backgroundColor: (r === 'buyer' ? C.primary : C.success) + '18' }]}
                  onPress={() => setRole(r)}
                >
                  <Ionicons
                    name={r === 'buyer' ? 'cart-outline' : 'storefront-outline'}
                    size={18}
                    color={role === r ? (r === 'buyer' ? C.primary : C.success) : C.muted}
                  />
                  <Text style={[styles.roleText, role === r && { color: r === 'buyer' ? C.primary : C.success, fontWeight: '700' }]}>
                    {r === 'buyer' ? "I'm a Buyer" : "I'm a Seller"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name */}
            <View style={styles.field}>
              <Ionicons name="person-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={C.muted}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Ionicons name="mail-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={C.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Ionicons name="lock-closed-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={C.muted}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.85}
              style={styles.btnWrap}
            >
              <LinearGradient
                colors={role === 'seller' ? [C.success, '#059669'] : [C.primary, '#0EA5E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btn, loading && { opacity: 0.6 }]}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Text style={styles.btnText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>

            {/* Login link */}
            <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.link}>
              <Text style={styles.linkText}>
                Already have an account?{'  '}
                <Text style={{ color: C.primary, fontWeight: '700' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },

  brand: { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(56,189,248,0.12)',
    borderWidth: 1, borderColor: 'rgba(56,189,248,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  brandName: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: 0.5 },

  heading: { fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 6 },
  subheading: { fontSize: 15, color: C.muted, marginBottom: 24 },

  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12,
    backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border,
  },
  roleText: { color: C.muted, fontSize: 14 },

  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.card, borderRadius: 14, paddingHorizontal: 14, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
  },
  input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 14 },

  btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, gap: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  link: { alignItems: 'center', marginTop: 20, paddingVertical: 4 },
  linkText: { color: C.muted, fontSize: 14 },
});
