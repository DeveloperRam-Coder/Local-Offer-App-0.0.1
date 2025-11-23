import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  success: '#34D399',
  danger: '#EF4444',
};

type OfferCardProps = {
  id: string;
  title: string;
  price: number;
  views?: number;
  likes?: number;
  messages?: number;
  status?: 'active' | 'sold' | 'inactive';
  createdAt: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  imageUri?: string;
};

export default function OfferCard({
  id,
  title,
  price,
  views = 0,
  likes = 0,
  messages = 0,
  status = 'active',
  createdAt,
  onPress,
  onEdit,
  onDelete,
  imageUri,
}: OfferCardProps) {
  const statusColor = {
    active: COLORS.success,
    sold: COLORS.danger,
    inactive: COLORS.subtle,
  }[status];

  const createdDate = new Date(createdAt);
  const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
          </View>
        </View>

        <Text style={styles.price}>${price.toFixed(2)}</Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
            <Text style={styles.statText}>{views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={14} color={COLORS.accent} />
            <Text style={styles.statText}>{likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubbles-outline" size={14} color={COLORS.subtle} />
            <Text style={styles.statText}>{messages}</Text>
          </View>
          <Text style={styles.dateText}>{daysAgo}d ago</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="pencil-outline" size={16} color={COLORS.primary} />
            <Text style={[styles.actionText, { color: COLORS.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            <Text style={[styles.actionText, { color: COLORS.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 11,
    color: COLORS.subtle,
    marginLeft: 'auto',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
