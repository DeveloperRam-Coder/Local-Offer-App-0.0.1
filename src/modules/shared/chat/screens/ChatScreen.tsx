import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  border: '#334155',
  messageUser: '#38BDF8',
  messageOther: '#1E293B',
};

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  read: boolean;
}

export default function ChatScreen({ route, navigation }: any) {
  const { conversationId, sellerName } = route.params ?? {};
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi, is this product still available?',
      sender: 'other',
      timestamp: new Date(Date.now() - 5400000),
      read: true,
    },
    {
      id: '2',
      text: 'Yes! It is. Would you like to know more?',
      sender: 'user',
      timestamp: new Date(Date.now() - 5100000),
      read: true,
    },
    {
      id: '3',
      text: 'What is the delivery time?',
      sender: 'other',
      timestamp: new Date(Date.now() - 4800000),
      read: true,
    },
    {
      id: '4',
      text: 'We deliver within 2-3 business days in your area!',
      sender: 'user',
      timestamp: new Date(Date.now() - 4500000),
      read: true,
    },
    {
      id: '5',
      text: 'Great! I would like to purchase it.',
      sender: 'other',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      read: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.otherMessage,
      ]}
    >
      {item.sender === 'other' && (
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarText}>S</Text>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user'
            ? styles.userBubble
            : styles.otherBubble,
        ]}
      >
        <Text style={[styles.messageText, 
          item.sender === 'user' ? styles.userText : styles.otherText
        ]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime,
          item.sender === 'user' ? styles.userTime : styles.otherTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
      {item.sender === 'user' && item.read && (
        <Ionicons name="checkmark-done" size={16} color={COLORS.primary} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{sellerName || 'Seller'}</Text>
            <Text style={styles.headerSubtitle}>Active now</Text>
          </View>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={48} color={COLORS.subtle} />
              <Text style={styles.emptyText}>No messages yet</Text>
            </View>
          }
        />

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inputArea}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={COLORS.subtle}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons 
                name="send" 
                size={18} 
                color={inputText.trim() ? COLORS.text : COLORS.subtle}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.subtle,
    marginTop: 2,
  },
  headerAction: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 12,
  },
  messageBubble: {
    maxWidth: width - 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  userText: {
    color: COLORS.background,
    fontWeight: '500',
  },
  otherText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 11,
  },
  userTime: {
    color: `${COLORS.background}80`,
  },
  otherTime: {
    color: COLORS.subtle,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.subtle,
    fontSize: 14,
    marginTop: 12,
  },
  inputArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
