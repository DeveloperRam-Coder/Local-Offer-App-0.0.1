import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  success: '#34D399',
  warning: '#FBBF24',
};

interface BuyerOnboardingFlowProps {
  navigation: any;
  onExplore: () => void;
}

export const BuyerOnboardingFlow: React.FC<BuyerOnboardingFlowProps> = ({ navigation, onExplore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const fadeAnim = new Animated.Value(0);

  const slides = [
    {
      icon: 'gift-outline',
      title: 'Find Amazing Deals',
      description: 'Discover incredible offers from local sellers in your area',
      color: ['#0F172A', '#1E3A8A'],
    },
    {
      icon: 'location-outline',
      title: 'Local & Fresh',
      description: 'Support local businesses and get deals nearby',
      color: ['#1E3A8A', '#1E293B'],
    },
    {
      icon: 'chatbubbles-outline',
      title: 'Direct Connection',
      description: 'Chat with sellers and negotiate the best prices',
      color: ['#1E293B', '#0F172A'],
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Safe & Verified',
      description: 'All sellers are verified for your peace of mind',
      color: ['#0F172A', '#1E3A8A'],
    },
    {
      icon: 'trending-up-outline',
      title: 'Smart Recommendations',
      description: 'Get personalized suggestions based on your interests',
      color: ['#1E3A8A', '#1E293B'],
    },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentSlide]);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      fadeAnim.setValue(0);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onExplore();
    } else {
      setCurrentSlide((prev) => prev + 1);
      fadeAnim.setValue(0);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      fadeAnim.setValue(0);
    }
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <LinearGradient colors={slide.color as [string, string]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onExplore}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Slide Indicator Dots */}
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: index === currentSlide ? COLORS.primary : COLORS.card,
                      opacity: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [index === currentSlide ? 0.5 : 1, 1],
                      }),
                    },
                  ]}
                />
              ))}
            </View>

            {/* Icon Animation */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.iconBox}>
                <Ionicons
                  name={slide.icon as any}
                  size={56}
                  color={COLORS.primary}
                />
              </View>
            </Animated.View>

            {/* Text Content */}
            <Animated.View
              style={[
                styles.textContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </Animated.View>

            {/* Feature List (on last slide) */}
            {isLastSlide && (
              <Animated.View style={[styles.featureList, { opacity: fadeAnim }]}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark" size={20} color={COLORS.success} />
                  <Text style={styles.featureText}>Real-time notifications</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark" size={20} color={COLORS.success} />
                  <Text style={styles.featureText}>Secure payments</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark" size={20} color={COLORS.success} />
                  <Text style={styles.featureText}>24/7 support</Text>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Navigation Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.navButton, currentSlide === 0 && styles.navButtonDisabled]}
              onPress={handlePrev}
              disabled={currentSlide === 0}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={currentSlide === 0 ? COLORS.card : COLORS.primary}
              />
            </TouchableOpacity>

            <LinearGradient
              colors={[COLORS.primary, '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.exploreButton}
            >
              <TouchableOpacity onPress={handleNext} style={styles.exploreContent}>
                <Text style={styles.exploreText}>
                  {isLastSlide ? 'Start Exploring' : 'Next'}
                </Text>
                <Ionicons
                  name={isLastSlide ? 'arrow-forward' : 'chevron-forward'}
                  size={20}
                  color={COLORS.background}
                />
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setIsAutoPlay(!isAutoPlay)}
            >
              <Ionicons
                name={isAutoPlay ? 'pause' : 'play'}
                size={24}
                color={isAutoPlay ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Slide Counter */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentSlide + 1} / {slides.length}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  skipText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  featureList: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 30,
    gap: 12,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  navButtonDisabled: {
    opacity: 0.5,
    borderColor: COLORS.card,
  },
  exploreButton: {
    flex: 1,
    borderRadius: 12,
    height: 48,
  },
  exploreContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  exploreText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
  counter: {
    alignItems: 'center',
    marginTop: 20,
  },
  counterText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BuyerOnboardingFlow;
