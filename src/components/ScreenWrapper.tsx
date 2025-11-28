import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function ScreenWrapper({ children, style, ...rest }: Props) {
  return (
    <SafeAreaView style={styles.safe} {...rest}>
      <LinearGradient colors={["#0F172A", "#1E293B", "#1E3A8A"]} style={styles.gradient}>
        <View style={[styles.container, style]}>{children}</View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  gradient: { flex: 1 },
  container: { flex: 1, padding: 16 },
});
