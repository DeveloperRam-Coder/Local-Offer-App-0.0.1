import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  danger: '#EF4444',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
};

export default function AccountScreen({ navigation }: any) {
  const { user, logout } = useApp();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* Header removed — navigator header will provide title */}

          {user ? (
            <View style={styles.card}>
              <Ionicons name="person-circle-outline" size={80} color={COLORS.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.role}>Role: {user.role}</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.button}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonInner}
                >
                  <Text style={styles.buttonText}>Demo Credentials</Text>
                  <Ionicons name="key-outline" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={logout}
                style={[styles.button, { marginTop: 14 }]}
              >
                <LinearGradient
                  colors={[COLORS.danger, '#B91C1C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonInner}
                >
                  <Text style={styles.buttonText}>Logout</Text>
                  <Ionicons name="log-out-outline" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.notLoggedText}>You are not logged in.</Text>
              <TouchableOpacity
                onPress={() => navigation.replace('Login')}
                style={styles.button}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonInner}
                >
                  <Text style={styles.buttonText}>Login Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(30,41,59,0.7)',
    borderRadius: 20,
    padding: 20,
    marginTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: COLORS.subtle,
    textAlign: 'center',
    marginTop: 4,
  },
  role: {
    fontSize: 16,
    color: COLORS.success,
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    alignSelf: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
  notLoggedText: {
    color: COLORS.subtle,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
});
