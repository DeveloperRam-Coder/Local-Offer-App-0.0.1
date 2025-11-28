import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

// 🎨 Same color palette from Onboarding
const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  secondary: '#34D399',
  text: '#F8FAFC',
};

export default function LoginScreen({ navigation, route }: any) {
  const { login } = useApp();
  const params = route?.params as { email?: string; password?: string } | undefined;
  const [email, setEmail] = useState(params?.email ?? 'buyer@example.com');
  const [password, setPassword] = useState(params?.password ?? 'password');
  const [error, setError] = useState('');

  useEffect(() => {
    if (params?.email) setEmail(params.email);
    if (params?.password) setPassword(params.password);
  }, [params]);

  const onSubmit = async () => {
    setError('');
    const ok = await login(email.trim(), password);
    if (!ok) {
      setError('Invalid credentials');
      return;
    }

    const role = email.toLowerCase().startsWith('sell') ? 'seller' : 'buyer';
    Alert.alert('Welcome', `Signed in as ${role}`, [
      { 
        text: 'Continue', 
        onPress: () => {
          // Navigate to the correct initial screen based on role
          if (role === 'seller') {
            navigation.navigate('Main', { screen: 'SellerDashboard' });
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
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Login to your account</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity onPress={onSubmit} style={styles.button}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Login</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.replace('Register')}
              style={styles.linkBtn}
            >
              <Text style={styles.link}>
                No account? <Text style={styles.linkHighlight}>Register</Text>
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
  error: {
    color: '#F87171',
    textAlign: 'center',
    marginTop: 10,
  },
});
