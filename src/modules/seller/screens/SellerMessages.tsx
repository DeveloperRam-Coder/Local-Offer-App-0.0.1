import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useSellerMessages } from '../hooks';
import { formatRelativeTime } from '../../common/utils';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
};

export default function SellerMessages({ navigation }: any) {
  const { user } = useApp();
  const { conversations, unreadCount, markAsRead } = useSellerMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const normalize = (value?: string) => (value ?? '').toLowerCase();

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.accent} />
          <Text style={styles.noticeText}>Only sellers can view messages.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const filteredConversations = conversations.filter((conv) =>
    normalize(conv?.participantName).includes(normalize(searchQuery))
  );

  const handleConversationPress = (conversation: any) => {
    markAsRead(conversation.id);
    // Navigate to conversation detail
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#1E3A8A']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Header with unread count */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Messages</Text>
            {unreadCount > 0 && (
              <Text style={styles.subtitle}>{unreadCount} unread</Text>
            )}
          </View>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.subtle} />
          <Text style={styles.searchPlaceholder}>Search conversations...</Text>
        </View>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={COLORS.subtle} />
            <Text style={styles.emptyTitle}>No Messages</Text>
            <Text style={styles.emptyText}>Your messages will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.conversationItem,
                  item.unreadCount > 0 && styles.unreadConversation,
                ]}
                onPress={() => handleConversationPress(item)}
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Ionicons name="person-circle" size={40} color={COLORS.primary} />
                  </View>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadDot} />
                  )}
                </View>

                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.participantName} numberOfLines={1}>
                      {item.participantName || 'Buyer'}
                    </Text>
                    <Text style={styles.timestamp}>
                      {formatRelativeTime(new Date(item.lastMessageTime))}
                    </Text>
                  </View>
                  {item.offerTitle && (
                    <Text style={styles.offerTitle} numberOfLines={1}>
                      📌 {item.offerTitle}
                    </Text>
                  )}
                  <Text style={styles.messagePreview} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                </View>

                {item.unreadCount > 0 && (
                  <View style={styles.unreadIndicator}>
                    <Text style={styles.unreadIndicatorText}>{item.unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.subtle,
    marginTop: 4,
  },
  unreadBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchPlaceholder: {
    fontSize: 14,
    color: COLORS.subtle,
    marginLeft: 8,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  unreadConversation: {
    backgroundColor: '#1E3A8A',
    borderColor: COLORS.primary,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  unreadDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.subtle,
  },
  offerTitle: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  messagePreview: {
    fontSize: 13,
    color: COLORS.subtle,
  },
  unreadIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.subtle,
    marginTop: 8,
    textAlign: 'center',
  },
  noticeText: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 16,
  },
});
