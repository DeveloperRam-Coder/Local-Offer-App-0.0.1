import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  card: '#1E293B',
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    subtle: '#94A3B8',
  },
  border: '#334155',
};

interface ReviewCardProps {
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
  verified?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  buyerName,
  rating,
  comment,
  createdAt,
  helpful = 0,
  verified = false,
}) => {
  const daysAgo = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.buyerName}>{buyerName}</Text>
          {verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#34D399" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <Text style={styles.date}>{daysAgo} days ago</Text>
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={14}
            color={star <= rating ? '#F59E0B' : '#475569'}
            style={styles.star}
          />
        ))}
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{comment}</Text>

      {/* Helpful */}
      <View style={styles.helpfulSection}>
        <Ionicons name="thumbs-up-outline" size={14} color={COLORS.text.subtle} />
        <Text style={styles.helpfulText}>Helpful ({helpful})</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#34D399',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: COLORS.text.subtle,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 2,
  },
  star: {
    marginRight: 2,
  },
  comment: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  helpfulSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    fontSize: 12,
    color: COLORS.text.subtle,
  },
});
