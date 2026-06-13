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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function LoginScreen({ navigation }: any) {
  const { login, isAuthenticated, user } = useApp();
  const [email, setEmail] = useState('buyer@example.com');
  const [password, setPassword] = useState('password');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (!ok) setError('Invalid credentials. Use the demo accounts below.');
  };

  const fillDemo = (role: 'buyer' | 'seller') => {
    setEmail(role === 'buyer' ? 'buyer@example.com' : 'seller@example.com');
    setPassword('password');
    setError('');
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
            {/* Logo / Brand */}
            <View style={styles.brand}>
              <View style={styles.logoCircle}>
                <Ionicons name="pricetag-outline" size={32} color={C.primary} />
              </View>
              <Text style={styles.brandName}>LocalOffer</Text>
            </View>

            <Text style={styles.heading}>Welcome back 👋</Text>
            <Text style={styles.subheading}>Sign in to continue</Text>

            {/* Email */}
            <View style={[styles.field, error && styles.fieldError]}>
              <Ionicons name="mail-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={C.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(v) => { setEmail(v); setError(''); }}
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={[styles.field, error && styles.fieldError]}>
              <Ionicons name="lock-closed-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={C.muted}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={(v) => { setPassword(v); setError(''); }}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
              </TouchableOpacity>
            </View>

            {!!error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color={C.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.85}
              style={styles.btnWrap}
            >
              <LinearGradient
                colors={[C.primary, '#0EA5E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btn, loading && { opacity: 0.6 }]}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Text style={styles.btnText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>

            {/* Demo accounts */}
            <View style={styles.demoBox}>
              <Text style={styles.demoLabel}>Demo accounts — tap to fill</Text>
              <View style={styles.demoRow}>
                <TouchableOpacity style={styles.demoChip} onPress={() => fillDemo('buyer')}>
                  <Ionicons name="cart-outline" size={14} color={C.primary} />
                  <Text style={styles.demoChipText}>Buyer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.demoChip, { borderColor: C.accent + '50' }]} onPress={() => fillDemo('seller')}>
                  <Ionicons name="storefront-outline" size={14} color={C.accent} />
                  <Text style={[styles.demoChipText, { color: C.accent }]}>Seller</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.demoHint}>Email: buyer@example.com  ·  Password: password</Text>
            </View>

            {/* Register link */}
            <TouchableOpacity onPress={() => navigation.replace('Register')} style={styles.link}>
              <Text style={styles.linkText}>
                Don't have an account?{'  '}
                <Text style={{ color: C.primary, fontWeight: '700' }}>Register</Text>
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

  brand: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(56,189,248,0.12)',
    borderWidth: 1, borderColor: 'rgba(56,189,248,0.25)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
  },
  brandName: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: 0.5 },

  heading: { fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 6 },
  subheading: { fontSize: 15, color: C.muted, marginBottom: 28 },

  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.card,
    borderRadius: 14, paddingHorizontal: 14, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
  },
  fieldError: { borderColor: C.error + '60' },
  input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 14 },

  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  errorText: { color: C.error, fontSize: 13, flex: 1 },

  btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, gap: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  demoBox: {
    marginTop: 24, backgroundColor: 'rgba(56,189,248,0.06)',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(56,189,248,0.15)',
  },
  demoLabel: { color: C.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  demoRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  demoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(56,189,248,0.1)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)',
  },
  demoChipText: { color: C.primary, fontSize: 13, fontWeight: '600' },
  demoHint: { color: '#475569', fontSize: 11 },

  link: { alignItems: 'center', marginTop: 20, paddingVertical: 4 },
  linkText: { color: C.muted, fontSize: 14 },
});
