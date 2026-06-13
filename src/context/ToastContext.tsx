import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICON: Record<ToastType, string> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

const COLOR: Record<ToastType, string> = {
  success: '#34D399',
  error: '#F87171',
  info: '#38BDF8',
};

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 20 }),
      Animated.delay(2800),
      Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onDone);
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] });
  const opacity = anim;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Ionicons name={ICON[toast.type] as any} size={18} color={COLOR[toast.type]} />
      <Text style={styles.toastText} numberOfLines={2}>{toast.message}</Text>
      <View style={[styles.toastBar, { backgroundColor: COLOR[toast.type] }]} />
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = counter.current++;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDone={() => remove(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  toastText: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '500',
  },
  toastBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
