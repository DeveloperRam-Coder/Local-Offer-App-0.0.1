import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'gift-outline' as const,
    accent: '#38BDF8',
    title: 'Welcome to LocalOffer',
    description: 'Discover amazing deals and offers from verified sellers right in your neighbourhood.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    accent: '#34D399',
    title: 'Verified Sellers',
    description: 'Every seller on our platform is reviewed and verified so you can shop with confidence.',
  },
  {
    icon: 'chatbubbles-outline' as const,
    accent: '#A78BFA',
    title: 'Direct Chat',
    description: 'Message sellers instantly, negotiate prices, and arrange pickup — all in one place.',
  },
  {
    icon: 'bulb-outline' as const,
    accent: '#FBBF24',
    title: 'Smart Recommendations',
    description: 'Our AI learns your preferences and surfaces the best local deals tailored just for you.',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setCurrent(index);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % SLIDES.length;
        goTo(next);
        return prev; // goTo handles state
      });
    }, 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleNext = () => {
    resetTimer();
    if (current === SLIDES.length - 1) {
      navigation.navigate('Login');
    } else {
      goTo(current + 1);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const slide = SLIDES[current];

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safe}>

        {/* Top bar: step counter + skip */}
        <View style={styles.topBar}>
          <Text style={styles.stepText}>{current + 1} / {SLIDES.length}</Text>
          {current < SLIDES.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.skipText}>Skip</Text>
              <Ionicons name="chevron-forward" size={14} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Illustration area */}
        <View style={styles.illustrationWrap}>
          <Animated.View
            style={[
              styles.iconCircle,
              { borderColor: slide.accent + '40', opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <LinearGradient
              colors={[slide.accent + '22', slide.accent + '08']}
              style={styles.iconGradient}
            >
              <Ionicons name={slide.icon} size={72} color={slide.accent} />
            </LinearGradient>
          </Animated.View>

          {/* Decorative ring */}
          <View style={[styles.ring, { borderColor: slide.accent + '18' }]} />
        </View>

        {/* Content block: title + desc + dots — grouped together, no dead space */}
        <Animated.View
          style={[styles.contentBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>

          {/* Dots immediately below description */}
          <View style={styles.dots}>
            {SLIDES.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => { resetTimer(); goTo(i); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Animated.View
                  style={[
                    styles.dot,
                    i === current && { width: 24, backgroundColor: slide.accent },
                    i !== current && { backgroundColor: '#334155' },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Footer: CTA button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={styles.btnWrap}>
            <LinearGradient
              colors={current === SLIDES.length - 1 ? ['#34D399', '#059669'] : [slide.accent, slide.accent + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>
                {current === SLIDES.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <Ionicons
                name={current === SLIDES.length - 1 ? 'rocket-outline' : 'arrow-forward'}
                size={20}
                color="#fff"
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
            <Text style={styles.registerText}>
              New here?{'  '}
              <Text style={{ color: slide.accent, fontWeight: '700' }}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const ICON_SIZE = Math.min(width * 0.52, 240);

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  stepText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  skipBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  skipText: { color: '#64748B', fontSize: 14, fontWeight: '600' },

  illustrationWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: ICON_SIZE + 40,
    height: ICON_SIZE + 40,
    borderRadius: (ICON_SIZE + 40) / 2,
    borderWidth: 1,
  },

  // Content block: no flex:1, so it sits naturally above footer
  contentBlock: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  title: {
    fontSize: Math.min(width * 0.072, 28),
    fontWeight: '800',
    color: '#F1F5F9',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 320,
    marginBottom: 24,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  footer: {
    paddingBottom: 12,
    gap: 12,
  },
  btnWrap: { borderRadius: 16, overflow: 'hidden' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  registerLink: { alignItems: 'center', paddingVertical: 4 },
  registerText: { color: '#64748B', fontSize: 14 },
});
