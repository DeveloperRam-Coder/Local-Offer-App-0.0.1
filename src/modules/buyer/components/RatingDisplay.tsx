import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    subtle: '#94A3B8',
  },
};

interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
  showBreakdown?: boolean;
  breakdown?: { [key: number]: number };
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  showBreakdown = false,
  breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}) => {
  const totalReviews = Object.values(breakdown).reduce((a, b) => a + b, 0) || reviewCount;

  const getPercentage = (count: number): string => {
    return totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(0) : '0';
  };

  return (
    <View style={styles.container}>
      {/* Main Rating */}
      <View style={styles.mainRating}>
        <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name="star"
              size={16}
              color={star <= Math.round(rating) ? '#F59E0B' : '#475569'}
            />
          ))}
        </View>
        <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
      </View>

      {/* Breakdown */}
      {showBreakdown && (
        <View style={styles.breakdown}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const percentage = getPercentage(breakdown[stars]);
            return (
              <View key={stars} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{stars}★</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%` as any },
                    ]}
                  />
                </View>
                <Text style={styles.breakdownCount}>{breakdown[stars]}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  mainRating: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.text.subtle,
  },
  breakdown: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownLabel: {
    width: 30,
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  breakdownCount: {
    width: 40,
    textAlign: 'right',
    fontSize: 12,
    color: COLORS.text.subtle,
  },
});
